"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/constants";
import { getPriorityColor, getPriorityLabel } from "@/lib/priority";
import type { Organization } from "@/lib/supabase/types";
import { PageHeader } from "@/components/layout/page-header";
import { CsvImportButton } from "@/components/shared/csv-import-button";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortField = "priority_score" | "name" | "created_at" | "updated_at";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 16;

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function getStatusInfo(value: string) {
  return (
    LEAD_STATUSES.find((status) => status.value === value) ?? {
      value,
      label: value,
      color: "bg-slate-100 text-slate-700 border-slate-200",
    }
  );
}

export function LeadsPageClient({ organizations }: { organizations: Organization[] }) {
  const isHydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrganizations = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filtered = organizations.filter((organization) => {
      if (statusFilter !== "all" && organization.lead_status !== statusFilter) {
        return false;
      }

      if (sourceFilter !== "all" && organization.source !== sourceFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return (
        organization.name.toLowerCase().includes(normalizedSearch) ||
        (organization.website?.toLowerCase().includes(normalizedSearch) ?? false) ||
        (organization.description?.toLowerCase().includes(normalizedSearch) ?? false) ||
        organization.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch))
      );
    });

    filtered.sort((left, right) => {
      let comparison = 0;
      switch (sortField) {
        case "priority_score":
          comparison = left.priority_score - right.priority_score;
          break;
        case "name":
          comparison = left.name.localeCompare(right.name);
          break;
        case "created_at":
          comparison = new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
          break;
        case "updated_at":
          comparison = new Date(left.updated_at).getTime() - new Date(right.updated_at).getTime();
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [organizations, searchQuery, sourceFilter, sortDirection, sortField, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrganizations.length / PAGE_SIZE));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedOrganizations = filteredOrganizations.slice(
    (visiblePage - 1) * PAGE_SIZE,
    visiblePage * PAGE_SIZE
  );

  function handleSort(field: SortField) {
    setCurrentPage(1);

    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection(field === "name" ? "asc" : "desc");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Review, prioritize, and refine the companies that matter most in your pipeline."
      >
        <CsvImportButton />
        <Button asChild>
          <Link href="/leads/new">
            <Plus className="h-4 w-4" />
            Add Lead
          </Link>
        </Button>
      </PageHeader>

      <div className="rounded-3xl border border-border/70 bg-card/85 p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by company, website, description, or tag"
              className="h-11 rounded-xl sm:col-span-2"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="flex h-11 rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
              >
                <option value="all">All statuses</option>
                {LEAD_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <select
                value={sourceFilter}
                onChange={(event) => {
                  setSourceFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="flex h-11 rounded-xl border border-input bg-background px-3 text-sm shadow-xs"
              >
                <option value="all">All sources</option>
                {LEAD_SOURCES.map((source) => (
                  <option key={source.value} value={source.value}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {filteredOrganizations.length} lead{filteredOrganizations.length === 1 ? "" : "s"} found
          </p>
        </div>
      </div>

      {!isHydrated ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      ) : paginatedOrganizations.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No leads yet"
          description="Start with a clean list of target companies, then refine the pipeline as new context comes in."
        >
          <Button asChild>
            <Link href="/leads/new">Create your first lead</Link>
          </Button>
          <CsvImportButton label="Import lead CSV" />
        </EmptyState>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => handleSort("priority_score")}
                  >
                    Priority
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </TableHead>
                <TableHead>Source</TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1"
                    onClick={() => handleSort("updated_at")}
                  >
                    Updated
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrganizations.map((organization) => {
                const status = getStatusInfo(organization.lead_status);
                return (
                  <TableRow key={organization.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          href={`/leads/${organization.id}`}
                          className="font-medium text-foreground transition-colors hover:text-primary"
                        >
                          {organization.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          {organization.website ? (
                            <a
                              href={organization.website}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 hover:text-foreground"
                            >
                              {organization.website.replace(/^https?:\/\//, "")}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span>No website</span>
                          )}
                          {organization.tags.length > 0 ? (
                            <span>• {organization.tags.slice(0, 2).join(", ")}</span>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{organization.priority_score}</span>
                        <Badge
                          variant="outline"
                          className={`w-fit ${getPriorityColor(organization.priority_score)}`}
                        >
                          {getPriorityLabel(organization.priority_score)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {organization.source ?? "Manual"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(organization.updated_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/leads/${organization.id}`}>Open</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/leads/${organization.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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
