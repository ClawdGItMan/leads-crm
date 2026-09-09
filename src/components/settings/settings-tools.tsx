"use client";

import { Download } from "lucide-react";
import type { Organization } from "@/lib/supabase/types";
import { stringifyCsv } from "@/lib/csv";
import { CsvImportButton } from "@/components/shared/csv-import-button";
import { Button } from "@/components/ui/button";

export function SettingsTools({
  organizations,
}: {
  organizations: Organization[];
}) {
  function download(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function downloadTemplate() {
    const csv = stringifyCsv([
      {
        name: "Northstar Labs",
        website: "https://northstarlabs.com",
        description: "Mid-market revenue operations platform",
        status: "researching",
        priority_score: 72,
        source: "csv_import",
        tags: "outbound, q2-target",
        notes: "Warm introduction from a former client",
      },
    ]);
    download("leads-import-template.csv", csv);
  }

  function exportLeads() {
    const csv = stringifyCsv(
      organizations.map((organization) => ({
        name: organization.name,
        website: organization.website ?? "",
        description: organization.description ?? "",
        status: organization.lead_status,
        priority_score: organization.priority_score,
        source: organization.source ?? "",
        tags: organization.tags.join(", "),
        notes: organization.notes ?? "",
        created_at: organization.created_at,
        updated_at: organization.updated_at,
      }))
    );
    download("leads-export.csv", csv);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <CsvImportButton />
      <Button type="button" variant="outline" onClick={downloadTemplate}>
        <Download className="h-4 w-4" />
        Download CSV Template
      </Button>
      <Button type="button" variant="outline" onClick={exportLeads}>
        <Download className="h-4 w-4" />
        Export Leads
      </Button>
    </div>
  );
}
