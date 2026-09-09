import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { APP_ACCESS_MODE, DEFAULT_WORKSPACE_NAME } from "@/lib/constants";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { Workspace, WorkspaceMembership } from "@/lib/supabase/types";

type WorkspaceContext = {
  user: User | null;
  workspace: Workspace;
  membership: WorkspaceMembership;
};

type WorkspaceSelection = {
  workspace: Workspace;
  membership: WorkspaceMembership;
};

function slugifyWorkspaceName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function isPreferredWorkspace(workspace: Workspace) {
  const defaultSlug = slugifyWorkspaceName(DEFAULT_WORKSPACE_NAME);

  return (
    workspace.name === DEFAULT_WORKSPACE_NAME ||
    workspace.slug === defaultSlug ||
    workspace.slug.startsWith(`${defaultSlug}-`)
  );
}

function buildOpenAccessMembership(workspace: Workspace): WorkspaceMembership {
  return {
    id: `open-${workspace.id}`,
    workspace_id: workspace.id,
    user_id: "00000000-0000-0000-0000-000000000000",
    role: "owner",
    created_at: workspace.created_at,
  };
}

async function createDefaultWorkspaceForUser(user: User | null) {
  const admin = createServiceClient();
  const slugBase =
    slugifyWorkspaceName(DEFAULT_WORKSPACE_NAME) ||
    (user ? `workspace-${user.id.slice(0, 8)}` : "workspace");
  const slug = user ? `${slugBase}-${user.id.slice(0, 6)}` : slugBase;

  const { data: workspaceData, error: workspaceError } = await admin
    .from("workspaces")
    .insert({
      name: DEFAULT_WORKSPACE_NAME,
      slug,
    })
    .select("*")
    .single();
  const workspace = workspaceData as Workspace | null;

  if (workspaceError || !workspace) {
    throw workspaceError ?? new Error("Unable to create workspace");
  }

  if (!user) {
    return {
      workspace,
      membership: buildOpenAccessMembership(workspace),
    };
  }

  const { data: membershipData, error: membershipError } = await admin
    .from("workspace_memberships")
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "owner",
    })
    .select("*")
    .single();
  const membership = membershipData as WorkspaceMembership | null;

  if (membershipError || !membership) {
    throw membershipError ?? new Error("Unable to create workspace membership");
  }

  return {
    workspace,
    membership,
  };
}

export const getWorkspaceContext = cache(async (): Promise<WorkspaceContext | null> => {
  if (APP_ACCESS_MODE === "protected_preview") {
    const admin = createServiceClient();
    const { data: workspacesData } = await admin
      .from("workspaces")
      .select("*")
      .order("created_at", { ascending: false });

    const workspaces = (workspacesData as Workspace[] | null) ?? [];
    const workspace =
      workspaces.find((entry) => isPreferredWorkspace(entry)) ??
      (await createDefaultWorkspaceForUser(null)).workspace;

    return {
      user: null,
      workspace,
      membership: buildOpenAccessMembership(workspace),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const admin = createServiceClient();
  const { data: membershipsData } = await admin
    .from("workspace_memberships")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const memberships = (membershipsData as WorkspaceMembership[] | null) ?? [];

  let selection: WorkspaceSelection | null = null;

  if (memberships.length === 0) {
    const created = await createDefaultWorkspaceForUser(user);
    selection = created;
  } else {
    const workspaceIds = memberships.map((membership) => membership.workspace_id);
    const { data: workspacesData } = await admin
      .from("workspaces")
      .select("*")
      .in("id", workspaceIds);

    const workspaceMap = new Map(
      ((workspacesData as Workspace[] | null) ?? []).map((workspace) => [workspace.id, workspace])
    );

    const availableSelections = memberships
      .map((membership) => {
        const workspace = workspaceMap.get(membership.workspace_id);
        if (!workspace) return null;

        return { membership, workspace };
      })
      .filter((entry): entry is WorkspaceSelection => entry !== null);

    const preferredSelection = availableSelections.find((entry) =>
      isPreferredWorkspace(entry.workspace)
    );

    if (preferredSelection) {
      selection = preferredSelection;
    } else {
      selection = await createDefaultWorkspaceForUser(user);
    }
  }

  if (!selection) {
    return null;
  }

  return {
    user,
    workspace: selection.workspace,
    membership: selection.membership,
  };
});

export async function requireWorkspaceContext() {
  const context = await getWorkspaceContext();
  if (!context) {
    redirect("/login");
  }

  return context;
}
