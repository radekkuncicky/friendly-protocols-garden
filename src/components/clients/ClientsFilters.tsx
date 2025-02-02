import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const ClientsFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  statusFilter,
  setStatusFilter,
}: ClientsFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Hledat klienty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Všechny statusy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Všechny statusy</SelectItem>
          <SelectItem value="active">Aktivní</SelectItem>
          <SelectItem value="inactive">Neaktivní</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Nejnovější</SelectItem>
          <SelectItem value="name">Podle názvu</SelectItem>
          <SelectItem value="protocols">Podle protokolů</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};