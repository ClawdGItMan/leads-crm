"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { CONTACT_ROLES } from "@/lib/constants";
import type { Contact, Organization } from "@/lib/supabase/types";
import { createContactAction, updateContactAction } from "@/app/(dashboard)/contacts/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ContactDialog({
  organizations,
  contact,
  selectedOrganizationId,
  redirectTo,
  defaultOpen = false,
  trigger,
}: {
  organizations: Pick<Organization, "id" | "name">[];
  contact?: Contact | null;
  selectedOrganizationId?: string;
  redirectTo: string;
  defaultOpen?: boolean;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isEditing = Boolean(contact);

  const organizationId = contact?.organization_id ?? selectedOrganizationId ?? organizations[0]?.id ?? "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit contact" : "Add contact"}</DialogTitle>
          <DialogDescription>
            Keep contact coverage clean so the next outreach step is obvious.
          </DialogDescription>
        </DialogHeader>

        <form
          key={contact?.id ?? `new-${organizationId}`}
          action={isEditing ? updateContactAction : createContactAction}
          className="space-y-5"
        >
          {isEditing ? <input type="hidden" name="contact_id" value={contact?.id} /> : null}
          <input type="hidden" name="redirect_to" value={redirectTo} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                name="first_name"
                defaultValue={contact?.first_name ?? ""}
                placeholder="Jordan"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                name="last_name"
                defaultValue={contact?.last_name ?? ""}
                placeholder="Lee"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={contact?.title ?? ""}
                placeholder="VP of Partnerships"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                defaultValue={contact?.role ?? ""}
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
              >
                <option value="">Select role</option>
                {CONTACT_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_id">Company</Label>
            <select
              id="organization_id"
              name="organization_id"
              defaultValue={organizationId}
              className="flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
              required
            >
              <option value="" disabled>
                Select company
              </option>
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={contact?.email ?? ""}
                placeholder="jordan@northstar.com"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={contact?.phone ?? ""}
                placeholder="+1 (555) 555-0100"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              name="linkedin_url"
              defaultValue={contact?.linkedin_url ?? ""}
              placeholder="https://linkedin.com/in/jordanlee"
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={contact?.notes ?? ""}
              placeholder="Capture context, responsiveness, or the strongest angle for outreach."
              className="min-h-28 rounded-2xl"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isEditing ? "Save Contact" : "Create Contact"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
