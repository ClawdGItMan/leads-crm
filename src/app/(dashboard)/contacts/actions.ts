"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";
import { requireWorkspaceContext } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";

function buildFullName(firstName: string, lastName: string, fullName: string) {
  if (fullName.trim()) return fullName.trim();
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
}

function contactPayload(formData: FormData) {
  const firstName = String(formData.get("first_name") ?? "");
  const lastName = String(formData.get("last_name") ?? "");
  const fullName = buildFullName(
    firstName,
    lastName,
    String(formData.get("full_name") ?? "")
  );

  return {
    first_name: firstName.trim() || null,
    last_name: lastName.trim() || null,
    full_name: fullName || null,
    title: String(formData.get("title") ?? "").trim() || null,
    role: String(formData.get("role") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    linkedin_url: String(formData.get("linkedin_url") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

function revalidateContactPaths(organizationId?: string | null) {
  revalidatePath("/");
  revalidatePath("/contacts");
  revalidatePath("/leads");
  if (organizationId) {
    revalidatePath(`/leads/${organizationId}`);
    revalidatePath(`/leads/${organizationId}/edit`);
  }
}

export async function createContactAction(formData: FormData) {
  const { workspace } = await requireWorkspaceContext();
  const supabase = await createClient();
  const organizationId = String(formData.get("organization_id") ?? "");
  const redirectTo = String(formData.get("redirect_to") ?? "/contacts");
  const payload = contactPayload(formData);

  if (!organizationId) {
    redirect(`${redirectTo}?error=missing_organization`);
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", organizationId)
    .eq("workspace_id", workspace.id)
    .single();

  if (!organization) {
    redirect(`${redirectTo}?error=organization_not_found`);
  }

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      workspace_id: workspace.id,
      organization_id: organization.id,
      ...payload,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`${redirectTo}?error=save_failed`);
  }

  await logActivity({
    workspace_id: workspace.id,
    organization_id: organization.id,
    contact_id: data.id,
    type: "contact_created",
    summary: `Added contact ${payload.full_name ?? "Untitled contact"} for ${organization.name}.`,
  });

  revalidateContactPaths(organization.id);
  redirect(redirectTo);
}

export async function updateContactAction(formData: FormData) {
  const { workspace } = await requireWorkspaceContext();
  const supabase = await createClient();
  const contactId = String(formData.get("contact_id") ?? "");
  const organizationId = String(formData.get("organization_id") ?? "");
  const redirectTo = String(formData.get("redirect_to") ?? "/contacts");
  const payload = contactPayload(formData);

  if (!contactId || !organizationId) {
    redirect(`${redirectTo}?error=missing_fields`);
  }

  const { data: existing } = await supabase
    .from("contacts")
    .select("id, organization_id")
    .eq("id", contactId)
    .eq("workspace_id", workspace.id)
    .single();

  if (!existing) {
    redirect(`${redirectTo}?error=contact_not_found`);
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("id", organizationId)
    .eq("workspace_id", workspace.id)
    .single();

  if (!organization) {
    redirect(`${redirectTo}?error=organization_not_found`);
  }

  const { error } = await supabase
    .from("contacts")
    .update({
      organization_id: organization.id,
      ...payload,
    })
    .eq("id", contactId)
    .eq("workspace_id", workspace.id);

  if (error) {
    redirect(`${redirectTo}?error=save_failed`);
  }

  await logActivity({
    workspace_id: workspace.id,
    organization_id: organization.id,
    contact_id: contactId,
    type: "contact_updated",
    summary: `Updated contact ${payload.full_name ?? "contact"} for ${organization.name}.`,
  });

  revalidateContactPaths(organization.id);
  if (existing.organization_id && existing.organization_id !== organization.id) {
    revalidateContactPaths(existing.organization_id);
  }
  redirect(redirectTo);
}
