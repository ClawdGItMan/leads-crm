import { KeyRound, Settings2, ShieldCheck, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspaceContext } from "@/lib/workspace";
import type { Organization } from "@/lib/supabase/types";
import {
  resetWorkspaceDataAction,
  updateWorkspaceAction,
} from "@/app/(dashboard)/settings/actions";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsTools } from "@/components/settings/settings-tools";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
  const context = await requireWorkspaceContext();
  const supabase = await createClient();

  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("workspace_id", context.workspace.id)
    .order("updated_at", { ascending: false });

  const organizations = (data as Organization[] | null) ?? [];

  const apiHealth = [
    {
      name: "Supabase",
      configured: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ),
    },
    {
      name: "Anthropic",
      configured: Boolean(process.env.ANTHROPIC_API_KEY),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Keep the workspace profile clean, confirm the AI stack is healthy, and manage CSV-based data movement."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Workspace Profile
            </CardTitle>
            <CardDescription>
              One workspace is visible in v1, but the schema is already ready for future multi-team expansion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateWorkspaceAction} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Workspace name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={context.workspace.name}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Workspace slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={context.workspace.slug}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {context.membership.role}
                </Badge>
                <Badge variant="outline">{organizations.length} leads in workspace</Badge>
              </div>

              <div className="flex justify-end">
                <Button type="submit">Save Workspace</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              API Health
            </CardTitle>
            <CardDescription>
              Keep the data layer and AI summary provider healthy so the workspace stays dependable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {apiHealth.map((api) => (
              <div
                key={api.name}
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
              >
                <span className="text-sm font-medium">{api.name}</span>
                <Badge variant="outline" className={api.configured ? "text-emerald-700" : "text-amber-700"}>
                  {api.configured ? "Configured" : "Needs setup"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            CSV Tools
          </CardTitle>
          <CardDescription>
            Import lead lists, download a clean CSV template, and export the current workspace when you need to move data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsTools organizations={organizations} />
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Blank Slate
          </CardTitle>
          <CardDescription>
            This CRM is meant to stay generic and reusable. If you want to start over, you can clear the current workspace back to zero leads, contacts, activities, and summaries.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>The current workspace should stay plain and easy to tailor.</p>
            <p>Use this if you want a completely empty base model.</p>
          </div>
          <form action={resetWorkspaceDataAction}>
            <Button type="submit" variant="destructive">
              Clear Workspace Data
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
