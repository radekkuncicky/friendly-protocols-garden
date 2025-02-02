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
    </div>
  );
};