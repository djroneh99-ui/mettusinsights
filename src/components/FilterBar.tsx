import { format } from "date-fns";
import { Calendar as CalendarIcon, Briefcase, X, RotateCcw } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BU_LIST, useRole, type BU } from "@/lib/role-context";

type Props = {
  dateRange: DateRange | undefined;
  setDateRange: (r: DateRange | undefined) => void;
  selectedBUs: BU[];
  setSelectedBUs: (b: BU[]) => void;
  onReset: () => void;
};

export function FilterBar({ dateRange, setDateRange, selectedBUs, setSelectedBUs, onReset }: Props) {
  const { role, managedBU, can } = useRole();
  const canEdit = can("editFilters");

  const toggleBU = (b: BU) => {
    if (!canEdit) return;
    setSelectedBUs(
      selectedBUs.includes(b) ? selectedBUs.filter((x) => x !== b) : [...selectedBUs, b]
    );
  };

  return (
    <div className="sticky top-0 z-30 -mx-4 mb-6 border-b bg-background/80 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
      <div className="flex flex-wrap items-center gap-2">
        {/* Date range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" disabled={!canEdit} className="h-9">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from
                ? dateRange.to
                  ? `${format(dateRange.from, "MMM d, yyyy")} – ${format(dateRange.to, "MMM d, yyyy")}`
                  : format(dateRange.from, "MMM d, yyyy")
                : "Pick date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* BU multiselect */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" disabled={!canEdit} className="h-9">
              <Briefcase className="mr-2 h-4 w-4" />
              Business Units · {selectedBUs.length}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="space-y-1">
              {BU_LIST.map((b) => (
                <label key={b} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-muted">
                  <Checkbox checked={selectedBUs.includes(b)} onCheckedChange={() => toggleBU(b)} />
                  <span className="text-sm">{b}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Selected BU chips */}
        <div className="flex flex-wrap gap-1">
          {selectedBUs.map((b) => (
            <Badge key={b} variant="secondary" className="gap-1">
              {b}
              {canEdit && (
                <button onClick={() => toggleBU(b)} aria-label={`Remove ${b}`}>
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>

        {canEdit && (
          <Button variant="ghost" size="sm" onClick={onReset} className="ml-auto h-9">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
        )}
      </div>

      {!canEdit && (
        <p className="mt-2 text-xs text-muted-foreground">
          {role === "Executive"
            ? "Executive view — filters locked to organisation-wide scope."
            : `Manager view — filters locked to your business unit (${managedBU}).`}
        </p>
      )}
    </div>
  );
}
