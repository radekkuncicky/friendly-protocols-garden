import { Eye, Send, Download, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Protocol } from "@/types/protocol";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const isEditable = !clientSignature && status !== 'completed';
  const canBeSent = status !== 'completed' && status !== 'sent';

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
            <p>Zobrazit protokol</p>
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
              : isEditable 
                ? 'Upravit protokol' 
                : 'Protokol nelze upravit - je již dokončen'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onSend}
              disabled={!canBeSent}
            >
              <Send className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {status === 'sent' 
              ? 'Protokol již byl odeslán'
              : status === 'completed'
                ? 'Dokončený protokol nelze odeslat'
                : 'Odeslat protokol'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isEditable ? 'Stáhnout upravitelný protokol' : 'Stáhnout finální protokol'}
          </TooltipContent>
        </Tooltip>

        {(userRole === "admin" || userRole === "manager") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="destructive" 
                size="icon" 
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Smazat protokol</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};