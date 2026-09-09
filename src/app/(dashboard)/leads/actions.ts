"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";
import { normalizeLeadSource, normalizeLeadStatus, normalizeWebsite, parseTags } from "@/lib/csv";
import { requireWorkspaceContext } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function parsePriorityScore(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? 50);
  if (Number.isNaN(parsed)) return 50;
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function leadPayload(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const website = normalizeWebsite(String(formData.get("website") ?? ""));

  return {
    name,
    slug: slugify(String(formData.get("slug") ?? name)),
    website,
    description: String(formData.get("description") ?? "").trim() || null,
    lead_status: normalizeLeadStatus(String(formData.get("lead_status") ?? "new")),
    priority_score: parsePriorityScore(formData.get("priority_score")),
    source: normalizeLeadSource(String(formData.get("source") ?? "manual")),
    notes: String(formData.get("notes") ?? "").trim() || null,
    tags: parseTags(String(formData.get("tags") ?? "")),
  };
}

function revalidateLeadPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/contacts");
  revalidatePath("/summaries");
  if (id) {
    revalidatePath(`/leads/${id}`);
    revalidatePath(`/leads/${id}/edit`);
  }
}

export async function createLeadAction(formData: FormData) {
  const { workspace } = await requireWorkspaceContext();
  const supabase = await createClient();
  const payload = leadPayload(formData);

  if (!payload.name) {
    redirect("/leads/new?error=missing_name");
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      workspace_id: workspace.id,
      ...payload,
    })
    .select("id, name")
    .single();

  if (error || !data) {
    redirect("/leads/new?error=save_failed");
  }

  await logActivity({
    workspace_id: workspace.id,
    organization_id: data.id,
    type: "lead_created",
    summary: `Added lead ${data.name}.`,
    metadata: { source: payload.source, status: payload.lead_status },
  });

  revalidateLeadPaths(data.id);
  redirect(`/leads/${data.id}`);
}

export async function updateLeadAction(formData: FormData) {
  const { workspace } = await requireWorkspaceContext();
  const supabase = await createClient();
  const leadId = String(formData.get("lead_id") ?? "");
  const redirectTo = String(formData.get("redirect_to") ?? `/leads/${leadId}`);
  const payload = leadPayload(formData);

  if (!leadId || !payload.name) {
    redirect(`${redirectTo}?error=missing_fields`);
  }

  const { data: existing } = await supabase
    .from("organizations")
    .select("id, name, lead_status, priority_score")
    .eq("id", leadId)
    .eq("workspace_id", workspace.id)
    .single();

  if (!existing) {
    redirect("/leads?error=not_found");
  }

  const { error } = await supabase
    .from("organizations")
    .update(payload)
    .eq("id", leadId)
    .eq("workspace_id", workspace.id);

  if (error) {
    redirect(`${redirectTo}?error=save_failed`);
  }

  const changedStatus = existing.lead_status !== payload.lead_status;
  await logActivity({
    workspace_id: workspace.id,
    organization_id: leadId,
    type: changedStatus ? "lead_status_changed" : "lead_updated",
    summary: changedStatus
      ? `${payload.name} moved from ${existing.lead_status.replace(/_/g, " ")} to ${payload.lead_status.replace(/_/g, " ")}.`
      : `Updated lead ${payload.name}.`,
    metadata: {
      previous_status: existing.lead_status,
      status: payload.lead_status,
      priority_score: payload.priority_score,
    },
  });

  revalidateLeadPaths(leadId);
  redirect(redirectTo);
}

export async function updateLeadStatusAction(formData: FormData) {
  const { workspace } = await requireWorkspaceContext();
  const supabase = await createClient();
  const leadId = String(formData.get("lead_id") ?? "");
  const nextStatus = normalizeLeadStatus(String(formData.get("lead_status") ?? "new"));
  const redirectTo = String(formData.get("redirect_to") ?? `/leads/${leadId}`);

  if (!leadId) {
    redirect("/leads?error=missing_lead");
  }

  const { data: existing } = await supabase
    .from("organizations")
    .select("id, name, lead_status")
    .eq("id", leadId)
    .eq("workspace_id", workspace.id)
    .single();

  if (!existing) {
    redirect("/leads?error=not_found");
  }

  await supabase
    .from("organizations")
    .update({ lead_status: nextStatus })
    .eq("id", leadId)
    .eq("workspace_id", workspace.id);

  await logActivity({
    workspace_id: workspace.id,
    organization_id: leadId,
    type: "lead_status_changed",
    summary: `${existing.name} moved from ${existing.lead_status.replace(/_/g, " ")} to ${nextStatus.replace(/_/g, " ")}.`,
    metadata: {
      previous_status: existing.lead_status,
      status: nextStatus,
    },
  });

  revalidateLeadPaths(leadId);
  redirect(redirectTo);
}

export async function updateLeadNotesAction(formData: FormData) {
  const { workspace } = await requireWorkspaceContext();
  const supabase = await createClient();
  const leadId = String(formData.get("lead_id") ?? "");
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const redirectTo = String(formData.get("redirect_to") ?? `/leads/${leadId}`);

  if (!leadId) {
    redirect("/leads?error=missing_lead");
  }

  const { data: existing } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", leadId)
    .eq("workspace_id", workspace.id)
    .single();

  if (!existing) {
    redirect("/leads?error=not_found");
  }

  await supabase
    .from("organizations")
    .update({ notes })
    .eq("id", leadId)
    .eq("workspace_id", workspace.id);

  await logActivity({
    workspace_id: workspace.id,
    organization_id: leadId,
    type: "lead_notes_updated",
    summary: `Updated notes for ${existing.name}.`,
  });

  revalidateLeadPaths(leadId);
  redirect(`${redirectTo}?saved=notes`);
}
