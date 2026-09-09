import { createClient } from "@/lib/supabase/server";

type ActivityInput = {
  workspace_id: string;
  organization_id?: string | null;
  contact_id?: string | null;
  type: string;
  summary: string;
  metadata?: Record<string, unknown>;
};

export async function logActivity(input: ActivityInput) {
  try {
    const supabase = await createClient();
    await supabase.from("activity_logs").insert({
      workspace_id: input.workspace_id,
      organization_id: input.organization_id ?? null,
      contact_id: input.contact_id ?? null,
      type: input.type,
      summary: input.summary,
      metadata: input.metadata ?? {},
    });
  } catch {
    // Activity logs should never block the primary mutation path.
  }
}
