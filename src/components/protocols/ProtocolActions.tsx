import { Eye, Send, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtocolActionsProps {
  userRole: string | null;
}

export const ProtocolActions = ({ userRole }: ProtocolActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="icon">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Send className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Download className="h-4 w-4" />
      </Button>
      {(userRole === "admin" || userRole === "manager") && (
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};