import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export const ClientsFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}: ClientsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hledat podle jména, emailu nebo IČO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Řadit podle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Datum vytvoření</SelectItem>
            <SelectItem value="name">Název</SelectItem>
            <SelectItem value="protocols">Počet protokolů</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};