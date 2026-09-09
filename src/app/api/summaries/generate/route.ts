import { NextResponse } from "next/server";
import { subDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { generatePipelineSummary } from "@/lib/ai/summaries";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_LEAD_STATUSES } from "@/lib/constants";
import { getWorkspaceContext } from "@/lib/workspace";
import { logActivity } from "@/lib/activity";

export async function POST() {
  const context = await getWorkspaceContext();
  if (!context) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const reviewWindowStart = subDays(new Date(), 7).toISOString();

  const [
    organizationsResult,
    recentLeadsResult,
    contactsResult,
    recentContactsResult,
    activityResult,
  ] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, lead_status, created_at, updated_at")
      .eq("workspace_id", context.workspace.id),
    supabase
      .from("organizations")
      .select("name, lead_status, source, priority_score, updated_at")
      .eq("workspace_id", context.workspace.id)
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("contacts")
      .select("id, created_at")
      .eq("workspace_id", context.workspace.id),
    supabase
      .from("contacts")
      .select("full_name, title, email, created_at, organizations(name)")
      .eq("workspace_id", context.workspace.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("activity_logs")
      .select("type, summary, created_at")
      .eq("workspace_id", context.workspace.id)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const organizations = organizationsResult.data ?? [];
  const contacts = contactsResult.data ?? [];
  const recentLeads =
    recentLeadsResult.data?.map((lead) => ({
      name: lead.name,
      status: lead.lead_status,
      source: lead.source,
      priority_score: lead.priority_score,
      updated_at: lead.updated_at,
    })) ?? [];
  const recentContacts =
    recentContactsResult.data?.map((contact: Record<string, unknown>) => ({
      full_name: (contact.full_name as string | null) ?? "Unknown contact",
      title: (contact.title as string | null) ?? null,
      organization:
        ((contact.organizations as { name?: string } | null)?.name as string | undefined) ??
        "Unknown organization",
      email: (contact.email as string | null) ?? null,
      created_at: contact.created_at as string,
    })) ?? [];
  const recentActivities = activityResult.data ?? [];

  const summaryInput = {
    workspaceName: context.workspace.name,
    summaryDate: new Date().toISOString(),
    stats: {
      totalLeads: organizations.length,
      activeLeads: organizations.filter((organization) =>
        ACTIVE_LEAD_STATUSES.has(organization.lead_status)
      ).length,
      newLeads: organizations.filter(
        (organization) => new Date(organization.created_at) >= new Date(reviewWindowStart)
      ).length,
      updatedLeads: organizations.filter(
        (organization) => new Date(organization.updated_at) >= new Date(reviewWindowStart)
      ).length,
      newContacts: contacts.filter(
        (contact) => new Date(contact.created_at) >= new Date(reviewWindowStart)
      ).length,
    },
    recentLeads,
    recentContacts,
    recentActivities,
  };

  const summary = await generatePipelineSummary(summaryInput);

  const { data, error } = await supabase
    .from("daily_summaries")
    .insert({
      workspace_id: context.workspace.id,
      summary_date: new Date().toISOString().slice(0, 10),
      executive_summary: summary.executive_summary,
      lead_changes_summary: summary.lead_changes_summary,
      contact_changes_summary: summary.contact_changes_summary,
      action_items: summary.action_items,
      raw_data: summaryInput,
      created_by: context.user?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: "Could not generate summary" },
      { status: 500 }
    );
  }

  await logActivity({
    workspace_id: context.workspace.id,
    type: "summary_generated",
    summary: "Generated a new pipeline summary.",
    metadata: { summary_id: data.id },
  });

  revalidatePath("/");
  revalidatePath("/summaries");
  revalidatePath("/leads");
  revalidatePath("/contacts");

  return NextResponse.json({ success: true, summaryId: data.id });
}
