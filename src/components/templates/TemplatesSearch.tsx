import { Search, Filter, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TemplatesSearchProps {
  onSearch: (value: string) => void;
  userRole: string | null;
  onCreateClick: () => void;
}

export const TemplatesSearch = ({ onSearch, userRole, onCreateClick }: TemplatesSearchProps) => {
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
      {(userRole === "admin" || userRole === "manager") && (
        <Button onClick={onCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nová šablona
        </Button>
      )}
    </div>
  );
};