import { createClient } from "@/lib/supabase/server";
import { requireWorkspaceContext } from "@/lib/workspace";
import type { Contact, Organization } from "@/lib/supabase/types";
import { ContactsPageClient } from "@/components/contacts/contacts-page-client";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { workspace } = await requireWorkspaceContext();
  const params = await searchParams;
  const supabase = await createClient();

  const [contactsResult, organizationsResult] = await Promise.all([
    supabase
      .from("contacts")
      .select("*, organizations(name)")
      .eq("workspace_id", workspace.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("organizations")
      .select("id, name")
      .eq("workspace_id", workspace.id)
      .order("name", { ascending: true }),
  ]);

  const contacts =
    contactsResult.data?.map((contact: Record<string, unknown>) => ({
      ...(contact as Contact),
      organization_name:
        ((contact.organizations as { name?: string } | null)?.name as string | undefined) ??
        undefined,
    })) ?? [];

  return (
    <ContactsPageClient
      contacts={contacts}
      organizations={(organizationsResult.data as Pick<Organization, "id" | "name">[]) ?? []}
      openComposer={params.new === "1"}
    />
  );
}
