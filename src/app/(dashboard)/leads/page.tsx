import { createClient } from "@/lib/supabase/server";
import { requireWorkspaceContext } from "@/lib/workspace";
import type { Organization } from "@/lib/supabase/types";
import { LeadsPageClient } from "@/components/leads/leads-page-client";

export default async function LeadsPage() {
  const { workspace } = await requireWorkspaceContext();
  const supabase = await createClient();

  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("updated_at", { ascending: false });

  return <LeadsPageClient organizations={(data as Organization[]) ?? []} />;
}
