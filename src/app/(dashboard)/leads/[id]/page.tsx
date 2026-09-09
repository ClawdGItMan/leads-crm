import { notFound } from "next/navigation";
import Link from "next/link";
import { Archive, BadgeCheck, Ban, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LEAD_STATUSES } from "@/lib/constants";
import { getPriorityColor, getPriorityLabel } from "@/lib/priority";
import { requireWorkspaceContext } from "@/lib/workspace";
import type { ActivityLog, Contact, DailySummary, Organization } from "@/lib/supabase/types";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateLeadStatusAction } from "@/app/(dashboard)/leads/actions";
import { LeadDetailTabs } from "./lead-detail-tabs";

function getStatusInfo(value: string) {
  return (
    LEAD_STATUSES.find((status) => status.value === value) ?? {
      value,
      label: value,
      color: "bg-slate-100 text-slate-700 border-slate-200",
    }
  );
}

function summaryMentionsLead(summary: DailySummary, organizationName: string) {
  const haystack = [
    summary.executive_summary,
    summary.lead_changes_summary,
    summary.contact_changes_summary,
    summary.action_items,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(organizationName.toLowerCase());
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { workspace } = await requireWorkspaceContext();
  const { id } = await params;
  const supabase = await createClient();

  const [organizationResult, contactsResult, activityResult, summariesResult] = await Promise.all([
    supabase
      .from("organizations")
      .select("*")
      .eq("id", id)
      .eq("workspace_id", workspace.id)
      .single(),
    supabase
      .from("contacts")
      .select("*")
      .eq("workspace_id", workspace.id)
      .eq("organization_id", id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("workspace_id", workspace.id)
      .eq("organization_id", id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("daily_summaries")
      .select("*")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  if (!organizationResult.data) {
    notFound();
  }

  const organization = organizationResult.data as Organization;
  const contacts = (contactsResult.data as Contact[]) ?? [];
  const activities = (activityResult.data as ActivityLog[]) ?? [];
  const summaryMentions =
    ((summariesResult.data as DailySummary[] | null) ?? []).filter((summary) =>
      summaryMentionsLead(summary, organization.name)
    ) ?? [];

  const status = getStatusInfo(organization.lead_status);

  return (
    <div className="space-y-6">
      <PageHeader
        title={organization.name}
        description="Lead detail combines company context, linked contacts, activity, and the latest notes in one place."
      >
        <Badge variant="outline" className={status.color}>
          {status.label}
        </Badge>
        <Badge variant="outline" className={getPriorityColor(organization.priority_score)}>
          {organization.priority_score} · {getPriorityLabel(organization.priority_score)}
        </Badge>
        <Button variant="outline" asChild>
          <Link href={`/leads/${organization.id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit Lead
          </Link>
        </Button>
        {organization.lead_status !== "qualified" ? (
          <form action={updateLeadStatusAction}>
            <input type="hidden" name="lead_id" value={organization.id} />
            <input type="hidden" name="lead_status" value="qualified" />
            <input type="hidden" name="redirect_to" value={`/leads/${organization.id}`} />
            <Button type="submit" variant="outline">
              <BadgeCheck className="h-4 w-4" />
              Mark Qualified
            </Button>
          </form>
        ) : null}
        {organization.lead_status !== "unqualified" ? (
          <form action={updateLeadStatusAction}>
            <input type="hidden" name="lead_id" value={organization.id} />
            <input type="hidden" name="lead_status" value="unqualified" />
            <input type="hidden" name="redirect_to" value={`/leads/${organization.id}`} />
            <Button type="submit" variant="outline">
              <Ban className="h-4 w-4" />
              Mark Unqualified
            </Button>
          </form>
        ) : null}
        {organization.lead_status !== "archived" ? (
          <form action={updateLeadStatusAction}>
            <input type="hidden" name="lead_id" value={organization.id} />
            <input type="hidden" name="lead_status" value="archived" />
            <input type="hidden" name="redirect_to" value={`/leads/${organization.id}`} />
            <Button type="submit" variant="outline">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </form>
        ) : null}
      </PageHeader>

      <LeadDetailTabs
        organization={organization}
        contacts={contacts}
        activities={activities}
        summaryMentions={summaryMentions}
      />
    </div>
  );
}
