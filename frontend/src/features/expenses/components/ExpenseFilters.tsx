import { Search, X } from "lucide-react";
import { Input } from "@ui/components/forms/Input/input";
import { Button } from "@ui/components/actions/Button/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/forms/Select/select";
import { categories } from "../data/expenses.mock";

export type ExpenseFilterState = {
  search: string;
  status: string;
  category: string;
  date: string;
};
export const emptyFilters: ExpenseFilterState = {
  search: "",
  status: "all",
  category: "all",
  date: "",
};
export function ExpenseFilters({
  filters,
  onChange,
}: {
  filters: ExpenseFilterState;
  onChange: (next: ExpenseFilterState) => void;
}) {
  const update = (key: keyof ExpenseFilterState, value: string) =>
    onChange({ ...filters, [key]: value });
  return (
    <div className="filter-bar">
      <div className="relative search-field">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Search expenses"
          placeholder="Search expenses..."
          className="pl-9"
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
        />
      </div>
      <Select
        value={filters.status}
        onValueChange={(value) => update("status", value)}
      >
        <SelectTrigger className="filter-select" aria-label="Filter by status">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          {[
            "all",
            "Draft",
            "Pending",
            "Approved",
            "Rejected",
            "Reimbursed",
          ].map((value) => (
            <SelectItem key={value} value={value}>
              {value === "all" ? "All statuses" : value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.category}
        onValueChange={(value) => update("category", value)}
      >
        <SelectTrigger
          className="filter-select"
          aria-label="Filter by category"
        >
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          {["all", ...categories].map((value) => (
            <SelectItem key={value} value={value}>
              {value === "all" ? "All categories" : value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        aria-label="Filter by date"
        className="w-40"
        value={filters.date}
        onChange={(event) => update("date", event.target.value)}
      />
      <Button variant="ghost" size="sm" onClick={() => onChange(emptyFilters)}>
        <X size={14} />
        Clear filters
      </Button>
    </div>
  );
}
