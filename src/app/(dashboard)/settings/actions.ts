"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activity";
import { requireWorkspaceContext } from "@/lib/workspace";
import { createClient } from "@/lib/supabase/server";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function updateWorkspaceAction(formData: FormData) {
  const { workspace, membership } = await requireWorkspaceContext();
  const supabase = await createClient();

  if (membership.role !== "owner") {
    redirect("/settings?error=owner_required");
  }

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "");
  const slug = slugify(slugInput || name);

  if (!name || !slug) {
    redirect("/settings?error=invalid_workspace");
  }

  const { error } = await supabase
    .from("workspaces")
    .update({ name, slug })
    .eq("id", workspace.id);

  if (error) {
    redirect("/settings?error=save_failed");
  }

  await logActivity({
    workspace_id: workspace.id,
    type: "workspace_updated",
    summary: `Updated workspace profile for ${name}.`,
  });

  revalidatePath("/");
  revalidatePath("/settings");
  redirect("/settings?saved=workspace");
}

export async function resetWorkspaceDataAction() {
  const { workspace, membership } = await requireWorkspaceContext();
  const supabase = await createClient();

  if (membership.role !== "owner") {
    redirect("/settings?error=owner_required");
  }

  const [summariesResult, activityResult, contactsResult, organizationsResult] = await Promise.all([
    supabase.from("daily_summaries").delete().eq("workspace_id", workspace.id),
    supabase.from("activity_logs").delete().eq("workspace_id", workspace.id),
    supabase.from("contacts").delete().eq("workspace_id", workspace.id),
    supabase.from("organizations").delete().eq("workspace_id", workspace.id),
  ]);

  const hasError =
    summariesResult.error || activityResult.error || contactsResult.error || organizationsResult.error;

  if (hasError) {
    redirect("/settings?error=reset_failed");
  }

  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/contacts");
  revalidatePath("/summaries");
  revalidatePath("/settings");
  redirect("/settings?saved=reset");
}
