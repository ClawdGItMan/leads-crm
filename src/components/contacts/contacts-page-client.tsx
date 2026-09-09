"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { CONTACT_ROLES } from "@/lib/constants";
import type { Contact, Organization } from "@/lib/supabase/types";
import { ContactDialog } from "@/components/contacts/contact-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 16;

type ContactRow = Contact & {
  organization_name?: string;
};

export function ContactsPageClient({
  contacts,
  organizations,
  openComposer = false,
}: {
  contacts: ContactRow[];
  organizations: Pick<Organization, "id" | "name">[];
  openComposer?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredContacts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return contacts.filter((contact) => {
      if (companyFilter !== "all" && contact.organization_id !== companyFilter) {
        return false;
      }

      if (roleFilter !== "all" && contact.role !== roleFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        (contact.full_name?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (contact.first_name?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (contact.last_name?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (contact.organization_name?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (contact.email?.toLowerCase().includes(normalizedSearch) ?? false)
      );
    });
  }, [companyFilter, contacts, roleFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedContacts = filteredContacts.slice(
    (visiblePage - 1) * PAGE_SIZE,
    visiblePage * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Keep the right people attached to the right companies so follow-up stays effortless."
      >
        <ContactDialog
          organizations={organizations}
          redirectTo="/contacts"
          defaultOpen={openComposer}
        />
      </PageHeader>

      <div className="rounded-3xl border border-border/70 bg-card/85 p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <Input
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, or company"
            className="h-11 rounded-xl"
          />
          <select
            value={companyFilter}
            onChange={(event) => {
              setCompanyFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="flex h-11 rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
          >
            <option value="all">All companies</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="flex h-11 rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
          >
            <option value="all">All roles</option>
            {CONTACT_ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {paginatedContacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts yet"
          description="Add a few strong contacts so every active company has someone to reach out to."
        >
          <ContactDialog organizations={organizations} redirectTo="/contacts" />
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {contact.full_name ??
                          [contact.first_name, contact.last_name].filter(Boolean).join(" ") ??
                          "Unknown contact"}
                      </div>
                      {contact.notes ? (
                        <p className="max-w-xs truncate text-sm text-muted-foreground">
                          {contact.notes}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contact.organization_id ? (
                      <Link
                        href={`/leads/${contact.organization_id}`}
                        className="font-medium text-foreground transition-colors hover:text-primary"
                      >
                        {contact.organization_name ?? "Unknown company"}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Unlinked</span>
                    )}
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
                        <a href={`mailto:${contact.email}`} className="block text-primary hover:underline">
                          {contact.email}
                        </a>
                      ) : (
                        <span className="block text-muted-foreground">No email</span>
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                        {contact.phone ? <span>{contact.phone}</span> : null}
                        {contact.linkedin_url ? (
                          <a
                            href={contact.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 hover:text-foreground"
                          >
                            LinkedIn
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(contact.updated_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <ContactDialog
                      organizations={organizations}
                      contact={contact}
                      redirectTo="/contacts"
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

          <div className="flex items-center justify-between border-t border-border/70 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {visiblePage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={visiblePage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={visiblePage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
