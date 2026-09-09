export const APP_NAME = "Leads";
export const APP_ACCESS_MODE = "protected_preview" as const;

export const LEAD_STATUSES = [
  { value: "new", label: "New", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { value: "researching", label: "Researching", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "ready_to_contact", label: "Ready to Contact", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "contacted", label: "Contacted", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "follow_up", label: "Follow Up", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "qualified", label: "Qualified", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "unqualified", label: "Unqualified", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { value: "archived", label: "Archived", color: "bg-zinc-100 text-zinc-600 border-zinc-200" },
] as const;

export const CONTACT_ROLES = [
  { value: "executive", label: "Executive" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "product", label: "Product" },
  { value: "engineering", label: "Engineering" },
  { value: "other", label: "Other" },
] as const;

export const LEAD_SOURCES = [
  { value: "manual", label: "Manual" },
  { value: "csv_import", label: "CSV Import" },
  { value: "research", label: "Research" },
  { value: "referral", label: "Referral" },
  { value: "website", label: "Website" },
  { value: "event", label: "Event" },
] as const;

export const ACTIVE_LEAD_STATUSES = new Set([
  "new",
  "researching",
  "ready_to_contact",
  "contacted",
  "follow_up",
  "qualified",
]);

export const RECENT_WINDOW_OPTIONS = [
  { value: "7d", label: "Last 7 days", days: 7 },
  { value: "30d", label: "Last 30 days", days: 30 },
] as const;

export const DEFAULT_WORKSPACE_NAME = "Leads";
