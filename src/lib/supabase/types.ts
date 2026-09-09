// Database row types for the Leads MVP.

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

export type WorkspaceMembership = {
  id: string;
  workspace_id: string;
  user_id: string;
  role: "owner" | "member";
  created_at: string;
};

export type Organization = {
  id: string;
  workspace_id: string;
  name: string;
  slug: string | null;
  website: string | null;
  description: string | null;
  lead_status: string;
  priority_score: number;
  source: string | null;
  owner_user_id: string | null;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type Contact = {
  id: string;
  workspace_id: string;
  organization_id: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  title: string | null;
  role: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityLog = {
  id: string;
  workspace_id: string;
  organization_id: string | null;
  contact_id: string | null;
  type: string;
  summary: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type DailySummary = {
  id: string;
  workspace_id: string;
  summary_date: string;
  executive_summary: string | null;
  lead_changes_summary: string | null;
  contact_changes_summary: string | null;
  action_items: string | null;
  raw_data: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      workspaces: {
        Row: Workspace;
        Insert: Partial<Workspace> & { name: string; slug: string };
        Update: Partial<Workspace>;
        Relationships: [];
      };
      workspace_memberships: {
        Row: WorkspaceMembership;
        Insert: Partial<WorkspaceMembership> & {
          workspace_id: string;
          user_id: string;
        };
        Update: Partial<WorkspaceMembership>;
        Relationships: [
          {
            foreignKeyName: "workspace_memberships_workspace_id_fkey";
            columns: ["workspace_id"];
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      organizations: {
        Row: Organization;
        Insert: Partial<Organization> & { workspace_id: string; name: string };
        Update: Partial<Organization>;
        Relationships: [
          {
            foreignKeyName: "organizations_workspace_id_fkey";
            columns: ["workspace_id"];
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
      contacts: {
        Row: Contact;
        Insert: Partial<Contact> & {
          workspace_id: string;
          organization_id: string;
        };
        Update: Partial<Contact>;
        Relationships: [
          {
            foreignKeyName: "contacts_workspace_id_fkey";
            columns: ["workspace_id"];
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contacts_organization_id_fkey";
            columns: ["organization_id"];
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: Partial<ActivityLog> & {
          workspace_id: string;
          type: string;
          summary: string;
        };
        Update: Partial<ActivityLog>;
        Relationships: [
          {
            foreignKeyName: "activity_logs_workspace_id_fkey";
            columns: ["workspace_id"];
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activity_logs_organization_id_fkey";
            columns: ["organization_id"];
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activity_logs_contact_id_fkey";
            columns: ["contact_id"];
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          }
        ];
      };
      daily_summaries: {
        Row: DailySummary;
        Insert: Partial<DailySummary> & { workspace_id: string };
        Update: Partial<DailySummary>;
        Relationships: [
          {
            foreignKeyName: "daily_summaries_workspace_id_fkey";
            columns: ["workspace_id"];
            referencedRelation: "workspaces";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
