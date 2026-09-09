import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { getWorkspaceContext } from "@/lib/workspace";
import {
  normalizeLeadSource,
  normalizeLeadStatus,
  normalizeWebsite,
  parseCsv,
  parseTags,
} from "@/lib/csv";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function clampScore(value: string | null | undefined) {
  const parsed = Number(value ?? 50);
  if (Number.isNaN(parsed)) return 50;
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function pickValue(row: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: Request) {
  const context = await getWorkspaceContext();
  if (!context) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Missing CSV file" }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCsv(text);

  if (rows.length === 0) {
    return NextResponse.json({ success: false, error: "CSV file is empty" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: existingOrganizations } = await supabase
    .from("organizations")
    .select("id, name, website")
    .eq("workspace_id", context.workspace.id);

  const existing = (existingOrganizations ?? []).map((organization) => ({
    id: organization.id,
    name: organization.name,
    normalizedName: normalizeName(organization.name),
    website: normalizeWebsite(organization.website) ?? "",
  }));

  const errors: Array<{ row: number; message: string }> = [];
  let created = 0;
  let updated = 0;

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    const name = pickValue(row, ["name", "company", "organization"]);
    const website = normalizeWebsite(pickValue(row, ["website", "domain", "url"]));
    const description = pickValue(row, ["description", "company_description"]);
    const notes = pickValue(row, ["notes"]);
    const tags = parseTags(pickValue(row, ["tags"]));
    const status = normalizeLeadStatus(pickValue(row, ["status", "lead_status"]));
    const source = normalizeLeadSource(pickValue(row, ["source"])) || "csv_import";
    const priorityScore = clampScore(
      pickValue(row, ["priority_score", "score", "priority"])
    );

    if (!name) {
      errors.push({ row: rowNumber, message: "Missing company name." });
      continue;
    }

    const normalizedName = normalizeName(name);
    const match = existing.find((organization) => {
      if (organization.normalizedName !== normalizedName) return false;
      if (website) {
        return organization.website === website;
      }

      return true;
    });

    const payload = {
      name,
      slug: slugify(name),
      website,
      description: description || null,
      lead_status: status,
      priority_score: priorityScore,
      source: source || "csv_import",
      notes: notes || null,
      tags,
    };

    if (match) {
      const { error } = await supabase
        .from("organizations")
        .update(payload)
        .eq("id", match.id)
        .eq("workspace_id", context.workspace.id);

      if (error) {
        errors.push({ row: rowNumber, message: "Could not update existing lead." });
        continue;
      }

      updated += 1;
      continue;
    }

    const { data, error } = await supabase
      .from("organizations")
      .insert({
        workspace_id: context.workspace.id,
        ...payload,
      })
      .select("id, name, website")
      .single();

    if (error || !data) {
      errors.push({ row: rowNumber, message: "Could not create lead." });
      continue;
    }

    existing.push({
      id: data.id,
      name: data.name,
      normalizedName,
      website: normalizeWebsite(data.website) ?? "",
    });
    created += 1;
  }

  await logActivity({
    workspace_id: context.workspace.id,
    type: "lead_imported",
    summary: `Imported ${created + updated} leads from CSV.`,
    metadata: { created, updated, errors: errors.length },
  });

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/contacts");
  revalidatePath("/settings");
  revalidatePath("/summaries");

  return NextResponse.json({
    success: true,
    created,
    updated,
    errors,
  });
}
