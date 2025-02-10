
import { Eye, Send, Download, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Protocol } from "@/types/protocol";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ProtocolActionButtonsProps {
  userRole: string | null;
  status: Protocol['status'];
  onView: () => void;
  onEdit: () => void;
  onSend: () => void;
  onDownload: () => void;
  onDelete: () => void;
  clientSignature?: string | null;
}

export const ProtocolActionButtons = ({
  userRole,
  status,
  onView,
  onEdit,
  onSend,
  onDownload,
  onDelete,
  clientSignature,
}: ProtocolActionButtonsProps) => {
  const { toast } = useToast();
  const isEditable = !clientSignature && status !== 'completed';
  const isDeletable = status === 'draft' && (userRole === 'admin' || userRole === 'manager');

  const handleDelete = () => {
    if (!isDeletable) {
      toast({
        title: "Smazání není možné",
        description: "Protokol nelze smazat, protože byl již odeslán nebo podepsán.",
        variant: "destructive",
      });
      return;
    }
    onDelete();
  };

  return (
    <div className="flex justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zobrazit protokol{clientSignature && " (pouze pro čtení)"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onEdit}
              disabled={!isEditable}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {clientSignature 
              ? 'Protokol nelze upravit - je již podepsán klientem'
              : status === 'completed'
                ? 'Protokol nelze upravit - je již dokončen'
                : 'Upravit protokol'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onSend}
              disabled={status === 'completed'}
            >
              <Send className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {status === 'completed' 
              ? 'Protokol je již dokončen'
              : status === 'sent'
                ? 'Znovu odeslat protokol'
                : 'Odeslat protokol'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {clientSignature 
              ? 'Stáhnout podepsaný protokol (PDF)'
              : isEditable 
                ? 'Stáhnout upravitelný protokol'
                : 'Stáhnout finální protokol'}
          </TooltipContent>
        </Tooltip>

        {(userRole === "admin" || userRole === "manager") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={handleDelete}
                disabled={!isDeletable}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isDeletable 
                ? 'Smazat protokol'
                : 'Protokol nelze smazat - je již odeslán nebo podepsán'}
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};
