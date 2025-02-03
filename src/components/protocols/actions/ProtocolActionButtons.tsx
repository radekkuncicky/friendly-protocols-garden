import { Eye, Send, Download, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Protocol } from "@/types/protocol";

interface ProtocolActionButtonsProps {
  userRole: string | null;
  status: Protocol['status'];
  onView: () => void;
  onEdit: () => void;
  onSend: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const ProtocolActionButtons = ({
  userRole,
  status,
  onView,
  onEdit,
  onSend,
  onDownload,
  onDelete,
}: ProtocolActionButtonsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="icon" onClick={onView}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onSend}
        disabled={status === 'sent'}
      >
        <Send className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={onDownload}>
        <Download className="h-4 w-4" />
      </Button>
      {(userRole === "admin" || userRole === "manager") && (
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};