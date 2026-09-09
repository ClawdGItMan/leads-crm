import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspaceContext } from "@/lib/workspace";
import type { Organization } from "@/lib/supabase/types";
import { LeadForm } from "@/components/leads/lead-form";
import { PageHeader } from "@/components/layout/page-header";
import { updateLeadAction } from "@/app/(dashboard)/leads/actions";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { workspace } = await requireWorkspaceContext();
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspace.id)
    .single();
  const organization = data as Organization | null;

  if (!organization) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Lead"
        description="Refine the record so anyone on the team can pick up the thread with confidence."
      />
      <LeadForm
        title={`Edit ${organization.name}`}
        description="Keep the details tight, the status current, and the notes clear."
        submitLabel="Save Changes"
        action={updateLeadAction}
        organization={organization}
        backHref={`/leads/${id}`}
      />
    </div>
  );
}
