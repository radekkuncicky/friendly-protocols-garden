import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TemplatesSearchProps {
  onSearch: (value: string) => void;
}

export const TemplatesSearch = ({ onSearch }: TemplatesSearchProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Hledat šablony..."
        className="w-64"
        type="search"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};