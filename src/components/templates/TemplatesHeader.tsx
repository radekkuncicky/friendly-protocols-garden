import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplatesHeaderProps {
  userRole: string | null;
  onCreateClick: () => void;
}

export const TemplatesHeader = ({ userRole, onCreateClick }: TemplatesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Šablony</h1>
      {(userRole === "admin" || userRole === "manager") && (
        <Button onClick={onCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nová šablona
        </Button>
      )}
    </div>
  );
};