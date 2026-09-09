import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspaceContext } from "@/lib/workspace";
import type { DailySummary } from "@/lib/supabase/types";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { GenerateSummaryButton } from "@/components/shared/generate-summary-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryStats = {
  totalLeads?: number;
  activeLeads?: number;
  newLeads?: number;
  newContacts?: number;
};

function getSummaryStats(summary: DailySummary): SummaryStats {
  const rawStats = summary.raw_data?.stats;
  if (!rawStats || typeof rawStats !== "object") {
    return {};
  }

  return rawStats as SummaryStats;
}

export default async function SummariesPage() {
  const { workspace } = await requireWorkspaceContext();
  const supabase = await createClient();

  const { data } = await supabase
    .from("daily_summaries")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  const summaries = (data as DailySummary[] | null) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Summaries"
        description="Generate concise pipeline recaps whenever you need a fresh view of lead movement, contact additions, and next actions."
      >
        <GenerateSummaryButton />
      </PageHeader>

      {summaries.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No summaries yet"
          description="Generate your first summary when you want a clean recap of pipeline movement and the next actions to take."
        >
          <GenerateSummaryButton variant="default" />
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {summaries.map((summary) => {
            const stats = getSummaryStats(summary);
            return (
              <Card key={summary.id} className="border-border/70 bg-card/90 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle>{format(new Date(summary.summary_date), "EEEE, MMMM d, yyyy")}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {summary.executive_summary
                        ? `${summary.executive_summary.slice(0, 180)}${summary.executive_summary.length > 180 ? "..." : ""}`
                        : "A fresh pipeline summary is available."}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/summaries/${summary.id}`}>
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {typeof stats.totalLeads === "number" ? (
                    <Badge variant="outline">{stats.totalLeads} total leads</Badge>
                  ) : null}
                  {typeof stats.activeLeads === "number" ? (
                    <Badge variant="outline">{stats.activeLeads} active leads</Badge>
                  ) : null}
                  {typeof stats.newLeads === "number" ? (
                    <Badge variant="outline">{stats.newLeads} new in review window</Badge>
                  ) : null}
                  {typeof stats.newContacts === "number" ? (
                    <Badge variant="outline">{stats.newContacts} new contacts</Badge>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
