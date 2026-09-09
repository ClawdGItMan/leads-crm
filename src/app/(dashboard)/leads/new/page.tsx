import { PageHeader } from "@/components/layout/page-header";
import { LeadForm } from "@/components/leads/lead-form";
import { createLeadAction } from "@/app/(dashboard)/leads/actions";

export default function NewLeadPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Lead"
        description="Capture a company cleanly so the rest of the team can immediately understand the opportunity."
      />
      <LeadForm
        title="New lead"
        description="Start with the essentials. You can add richer context after the first save."
        submitLabel="Create Lead"
        action={createLeadAction}
      />
    </div>
  );
}
