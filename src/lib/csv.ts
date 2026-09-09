export type CsvRow = Record<string, string>;

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

export function parseCsv(text: string): CsvRow[] {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? "";
    });
    return row;
  });
}

export function stringifyCsv(rows: Array<Record<string, string | number | null | undefined>>) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const serializedRows = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? "" : String(value);
        return `"${stringValue.replace(/"/g, '""')}"`;
      })
      .join(",")
  );

  return [headers.join(","), ...serializedRows].join("\n");
}

export function normalizeLeadSource(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return "manual";
  if (normalized === "csv" || normalized === "csv_import") return "csv_import";
  return normalized;
}

export function normalizeLeadStatus(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase().replace(/\s+/g, "_");
  if (!normalized) return "new";

  switch (normalized) {
    case "new":
    case "researching":
    case "ready_to_contact":
    case "contacted":
    case "follow_up":
    case "qualified":
    case "unqualified":
    case "archived":
      return normalized;
    default:
      return "new";
  }
}

export function parseTags(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function normalizeWebsite(value: string | null | undefined) {
  const input = value?.trim();
  if (!input) return null;

  try {
    const url = input.startsWith("http") ? new URL(input) : new URL(`https://${input}`);
    return url.toString().replace(/\/$/, "");
  } catch {
    return input;
  }
}
