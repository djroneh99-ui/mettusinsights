import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EMPLOYEES, type Employee } from "@/lib/dashboard-data";
import type { BU } from "@/lib/role-context";

type SortKey = "id" | "name" | "bu" | "subBU" | "job" | "location" | "grade";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "id", label: "Employee ID" },
  { key: "name", label: "Name" },
  { key: "bu", label: "Business Unit" },
  { key: "subBU", label: "Department" },
  { key: "job", label: "Role" },
  { key: "location", label: "Location" },
  { key: "grade", label: "Grade" },
];

export function EmployeeTable({ bus }: { bus: BU[] }) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = EMPLOYEES.filter(
      (e) =>
        bus.includes(e.bu as BU) &&
        (!term ||
          e.id.toLowerCase().includes(term) ||
          e.name.toLowerCase().includes(term) ||
          e.job.toLowerCase().includes(term) ||
          e.bu.toLowerCase().includes(term) ||
          e.subBU.toLowerCase().includes(term) ||
          e.location.toLowerCase().includes(term) ||
          e.grade.toLowerCase().includes(term))
    );
    const sorted = [...filtered].sort((a, b) => {
      const va = (a[sortKey] ?? "") as string;
      const vb = (b[sortKey] ?? "") as string;
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return sorted;
  }, [q, sortKey, sortDir, bus]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const exportCsv = () => {
    const header = COLUMNS.map((c) => c.label).join(",");
    const lines = rows.map((r) =>
      COLUMNS.map((c) => `"${String(r[c.key] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "employees.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ID, name, role, BU, location…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-9 pl-8"
          />
        </div>
        <Badge variant="secondary" className="tabular-nums">{rows.length} of {EMPLOYEES.length}</Badge>
        <Button variant="outline" size="sm" onClick={exportCsv} className="ml-auto h-9">
          <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key} className="px-3 py-2.5 font-medium">
                  <button
                    onClick={() => toggleSort(c.key)}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    {c.label}
                    {sortKey === c.key ? (
                      sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                    )}
                  </button>
                </th>
              ))}
              <th className="px-3 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 200).map((e) => (
              <Row key={e.id} e={e} />
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-sm text-muted-foreground">No employees match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {rows.length > 200 && (
        <p className="mt-2 text-xs text-muted-foreground">Showing first 200 of {rows.length}. Refine search to narrow.</p>
      )}
    </div>
  );
}

function Row({ e }: { e: Employee }) {
  return (
    <tr className="border-t hover:bg-muted/30">
      <td className="px-3 py-2 font-mono text-xs tabular-nums">{e.id}</td>
      <td className="px-3 py-2 font-medium">{e.name}</td>
      <td className="px-3 py-2"><Badge variant="outline">{e.bu}</Badge></td>
      <td className="px-3 py-2 text-muted-foreground">{e.subBU}</td>
      <td className="px-3 py-2">{e.job}</td>
      <td className="px-3 py-2 text-muted-foreground">{e.location}</td>
      <td className="px-3 py-2">
        <Badge variant="secondary" className={cn(
          e.grade === "Executive" && "bg-primary/10 text-primary",
        )}>{e.grade}</Badge>
      </td>
      <td className="px-3 py-2">
        {e.terminated ? (
          <span className="text-xs text-destructive">{e.reason}</span>
        ) : (
          <span className="text-xs text-[color:var(--success)]">Active</span>
        )}
      </td>
    </tr>
  );
}
