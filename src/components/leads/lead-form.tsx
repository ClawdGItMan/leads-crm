import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/constants";
import type { Organization } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function LeadForm({
  title,
  description,
  submitLabel,
  action,
  organization,
  backHref = "/leads",
}: {
  title: string;
  description: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  organization?: Organization;
  backHref?: string;
}) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl tracking-tight">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="ghost" asChild>
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-8">
          {organization ? (
            <>
              <input type="hidden" name="lead_id" value={organization.id} />
              <input type="hidden" name="redirect_to" value={`/leads/${organization.id}`} />
            </>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Company name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={organization?.name}
                    placeholder="Northstar Labs"
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    defaultValue={organization?.website ?? ""}
                    placeholder="northstarlabs.com"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={organization?.slug ?? ""}
                    placeholder="northstar-labs"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={organization?.description ?? ""}
                  placeholder="What makes this company relevant to your pipeline?"
                  className="min-h-28 rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={organization?.notes ?? ""}
                  placeholder="Capture context, blockers, or the next move."
                  className="min-h-36 rounded-2xl"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="space-y-2">
                  <Label htmlFor="lead_status">Status</Label>
                  <select
                    id="lead_status"
                    name="lead_status"
                    defaultValue={organization?.lead_status ?? "new"}
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                  >
                    {LEAD_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <select
                    id="source"
                    name="source"
                    defaultValue={organization?.source ?? "manual"}
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
                  >
                    {LEAD_SOURCES.map((source) => (
                      <option key={source.value} value={source.value}>
                        {source.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority_score">Priority score</Label>
                <Input
                  id="priority_score"
                  name="priority_score"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={organization?.priority_score ?? 50}
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  Use a 0-100 score to reflect urgency and fit.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={organization?.tags?.join(", ") ?? ""}
                  placeholder="Enterprise, warm intro, Q2 target"
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button variant="ghost" asChild>
              <Link href={backHref}>Cancel</Link>
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
