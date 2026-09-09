import Link from "next/link";
import { subDays } from "date-fns";
import { Building2, Clock3, Sparkles, UserPlus, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_LEAD_STATUSES, RECENT_WINDOW_OPTIONS } from "@/lib/constants";
import { getPriorityLabel } from "@/lib/priority";
import { requireWorkspaceContext } from "@/lib/workspace";
import type { ActivityLog, Organization } from "@/lib/supabase/types";
import { PageHeader } from "@/components/layout/page-header";
import { CsvImportButton } from "@/components/shared/csv-import-button";
import { EmptyState } from "@/components/shared/empty-state";
import { GenerateSummaryButton } from "@/components/shared/generate-summary-button";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatRelativeDate(value: string) {
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round((new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day"
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ window?: string }>;
}) {
  const { workspace } = await requireWorkspaceContext();
  const supabase = await createClient();
  const params = await searchParams;
  const windowValue = params.window === "7d" ? "7d" : "30d";
  const recentWindow =
    RECENT_WINDOW_OPTIONS.find((option) => option.value === windowValue) ?? RECENT_WINDOW_OPTIONS[1];
  const windowStart = subDays(new Date(), recentWindow.days).toISOString();

  const [
    totalLeadsResult,
    contactsResult,
    newLeadsResult,
    organizationsResult,
    activityResult,
  ] = await Promise.all([
    supabase
      .from("organizations")
      .select("id, lead_status", { count: "exact" })
      .eq("workspace_id", workspace.id),
    supabase
      .from("contacts")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id),
    supabase
      .from("organizations")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .gte("created_at", windowStart),
    supabase
      .from("organizations")
      .select("id, name, lead_status, priority_score, website, updated_at, created_at")
      .eq("workspace_id", workspace.id)
      .order("updated_at", { ascending: false })
      .limit(8),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const organizations = (organizationsResult.data as Organization[] | null) ?? [];
  const activities = (activityResult.data as ActivityLog[] | null) ?? [];
  const totalLeads = totalLeadsResult.count ?? 0;
  const activeLeads =
    totalLeadsResult.data?.filter((organization) => ACTIVE_LEAD_STATUSES.has(organization.lead_status))
      .length ?? 0;
  const totalContacts = contactsResult.count ?? 0;
  const newLeads = newLeadsResult.count ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A calm view of the pipeline so you can spot priority work, new activity, and the next best move at a glance."
      >
        <Button asChild variant="outline">
          <Link href="/contacts?new=1">
            <UserPlus className="h-4 w-4" />
            Add Contact
          </Link>
        </Button>
        <CsvImportButton />
        <GenerateSummaryButton />
        <Button asChild>
          <Link href="/leads/new">
            <Sparkles className="h-4 w-4" />
            Add Lead
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Leads" value={totalLeads.toLocaleString()} icon={Building2} />
        <StatCard title="Active Leads" value={activeLeads.toLocaleString()} icon={Sparkles} />
        <StatCard title="Contacts" value={totalContacts.toLocaleString()} icon={Users} />
        <StatCard
          title={recentWindow.label}
          value={newLeads.toLocaleString()}
          change={windowValue === "7d" ? "7-day view" : "30-day view"}
          icon={Clock3}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {RECENT_WINDOW_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={option.value === windowValue ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={`/?window=${option.value}`}>{option.label}</Link>
          </Button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recently Updated Leads</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                The companies with the freshest movement in the workspace.
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/leads">Open leads</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No pipeline activity yet"
                description="Add a few leads or import a CSV to start shaping the workspace."
              />
            ) : (
              <div className="space-y-3">
                {organizations.map((organization) => (
                  <Link
                    key={organization.id}
                    href={`/leads/${organization.id}`}
                    className="flex items-start justify-between rounded-2xl border border-border/70 bg-background/70 p-4 transition-colors hover:border-primary/30 hover:bg-background"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{organization.name}</div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{organization.website?.replace(/^https?:\/\//, "") ?? "No website"}</span>
                        <span>•</span>
                        <span>
                          {organization.lead_status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline">{getPriorityLabel(organization.priority_score)}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(organization.updated_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Every create, update, import, and summary keeps this feed current.
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/summaries">Open summaries</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <EmptyState
                icon={Clock3}
                title="No activity logged yet"
                description="Once someone adds or updates a lead or contact, the feed will start filling in."
              />
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-2xl border border-border/70 bg-background/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{activity.summary}</p>
                      <Badge variant="outline" className="capitalize">
                        {activity.type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
