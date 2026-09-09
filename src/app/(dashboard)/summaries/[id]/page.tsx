import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspaceContext } from "@/lib/workspace";
import type { DailySummary } from "@/lib/supabase/types";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SummaryStats = {
  totalLeads?: number;
  activeLeads?: number;
  newLeads?: number;
  updatedLeads?: number;
  newContacts?: number;
};

function buildSections(summary: DailySummary) {
  return [
    { title: "Executive Summary", content: summary.executive_summary },
    { title: "Lead Changes", content: summary.lead_changes_summary },
    { title: "Contact Changes", content: summary.contact_changes_summary },
    { title: "Action Items", content: summary.action_items },
  ].filter((section) => section.content);
}

export default async function SummaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { workspace } = await requireWorkspaceContext();
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("daily_summaries")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .single();

  if (!data) {
    notFound();
  }

  const summary = data as DailySummary;
  const stats = ((summary.raw_data?.stats as SummaryStats | undefined) ?? {}) as SummaryStats;
  const sections = buildSections(summary);

  return (
    <div className="space-y-6">
      <PageHeader
        title={format(new Date(summary.summary_date), "EEEE, MMMM d, yyyy")}
        description="A generated pipeline recap of recent lead changes, contact coverage, and the next recommended actions."
      >
        <Button variant="outline" asChild>
          <Link href="/summaries">
            <ArrowLeft className="h-4 w-4" />
            Back to Summaries
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-2">
        {typeof stats.totalLeads === "number" ? (
          <Badge variant="outline">{stats.totalLeads} total leads</Badge>
        ) : null}
        {typeof stats.activeLeads === "number" ? (
          <Badge variant="outline">{stats.activeLeads} active leads</Badge>
        ) : null}
        {typeof stats.newLeads === "number" ? (
          <Badge variant="outline">{stats.newLeads} new leads</Badge>
        ) : null}
        {typeof stats.updatedLeads === "number" ? (
          <Badge variant="outline">{stats.updatedLeads} updated leads</Badge>
        ) : null}
        {typeof stats.newContacts === "number" ? (
          <Badge variant="outline">{stats.newContacts} new contacts</Badge>
        ) : null}
      </div>

      {sections.length === 0 ? (
        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardContent className="py-8 text-sm text-muted-foreground">
            This summary does not contain any generated sections yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.title} className="border-border/70 bg-card/90 shadow-sm">
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm leading-7 text-muted-foreground">
                  {section.content!.split("\n").map((paragraph, index) => (
                    <p key={`${section.title}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
