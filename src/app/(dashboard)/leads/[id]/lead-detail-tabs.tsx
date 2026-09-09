"use client";

import Link from "next/link";
import { Clock3, ExternalLink, FileText, StickyNote, Users } from "lucide-react";
import { CONTACT_ROLES, LEAD_STATUSES } from "@/lib/constants";
import { getPriorityColor, getPriorityLabel } from "@/lib/priority";
import type { ActivityLog, Contact, DailySummary, Organization } from "@/lib/supabase/types";
import { updateLeadNotesAction } from "@/app/(dashboard)/leads/actions";
import { ContactDialog } from "@/components/contacts/contact-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

function getStatusInfo(value: string) {
  return (
    LEAD_STATUSES.find((status) => status.value === value) ?? {
      value,
      label: value,
      color: "bg-slate-100 text-slate-700 border-slate-200",
    }
  );
}

export function LeadDetailTabs({
  organization,
  contacts,
  activities,
  summaryMentions,
}: {
  organization: Organization;
  contacts: Contact[];
  activities: ActivityLog[];
  summaryMentions: DailySummary[];
}) {
  const status = getStatusInfo(organization.lead_status);

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
        <TabsTrigger value="activity">Activity ({activities.length})</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Company Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {organization.description ?? "No company summary has been added yet."}
              </p>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Status
                  </dt>
                  <dd className="mt-2">
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Priority
                  </dt>
                  <dd className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-semibold">{organization.priority_score}</span>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(organization.priority_score)}
                    >
                      {getPriorityLabel(organization.priority_score)}
                    </Badge>
                  </dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Source
                  </dt>
                  <dd className="mt-2 text-sm font-medium">
                    {organization.source ?? "Manual"}
                  </dd>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Website
                  </dt>
                  <dd className="mt-2 text-sm font-medium">
                    {organization.website ? (
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {organization.website.replace(/^https?:\/\//, "")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              {organization.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {organization.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No tags yet. Use tags to make the pipeline easier to scan.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Summary Mentions</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryMentions.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No summary mentions yet"
                  description="Once this company is referenced in a generated summary, it will show up here."
                />
              ) : (
                <div className="space-y-3">
                  {summaryMentions.map((summary) => (
                    <Link
                      key={summary.id}
                      href={`/summaries/${summary.id}`}
                      className="block rounded-2xl border border-border/70 bg-background/70 p-4 transition-colors hover:border-primary/30"
                    >
                      <div className="font-medium">
                        {new Date(summary.summary_date).toLocaleDateString()}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {(summary.executive_summary ?? summary.lead_changes_summary ?? "").slice(0, 180)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="contacts">
        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Linked Contacts</CardTitle>
            <ContactDialog
              organizations={[{ id: organization.id, name: organization.name }]}
              selectedOrganizationId={organization.id}
              redirectTo={`/leads/${organization.id}`}
            />
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No contacts linked yet"
                description="Add at least one strong contact so the next outreach step is obvious."
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.full_name ??
                          [contact.first_name, contact.last_name].filter(Boolean).join(" ") ??
                          "Unknown contact"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {contact.title ?? "N/A"}
                      </TableCell>
                      <TableCell>
                        {contact.role ? (
                          <Badge variant="outline">
                            {CONTACT_ROLES.find((role) => role.value === contact.role)?.label ??
                              contact.role}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {contact.email ? (
                            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                              {contact.email}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">No email</span>
                          )}
                          {contact.phone ? (
                            <p className="text-muted-foreground">{contact.phone}</p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <ContactDialog
                          organizations={[{ id: organization.id, name: organization.name }]}
                          contact={contact}
                          redirectTo={`/leads/${organization.id}`}
                          trigger={
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="activity">
        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <EmptyState
                icon={Clock3}
                title="No activity yet"
                description="Activity logs will appear as soon as someone updates this lead or its contacts."
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
                      <Badge variant="outline">{activity.type.replace(/_/g, " ")}</Badge>
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
      </TabsContent>

      <TabsContent value="notes">
        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Lead Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateLeadNotesAction} className="space-y-4">
              <input type="hidden" name="lead_id" value={organization.id} />
              <input type="hidden" name="redirect_to" value={`/leads/${organization.id}`} />
              <Textarea
                name="notes"
                defaultValue={organization.notes ?? ""}
                className="min-h-48 rounded-2xl"
                placeholder="Capture context, blockers, timing notes, or the strongest reason this lead matters."
              />
              <div className="flex justify-end">
                <Button type="submit">
                  <StickyNote className="h-4 w-4" />
                  Save Notes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
