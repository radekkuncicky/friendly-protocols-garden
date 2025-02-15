
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Download,
  Send,
  Edit,
  MoreVertical,
  FileText,
  File,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProtocolActionButtonsProps {
  protocol: any;
  onEdit?: () => void;
  onDelete?: () => void;
  onSend?: () => void;
  onView?: () => void;
  userRole?: string | null;
  status?: string;
  clientSignature?: string | null;
}

export function ProtocolActionButtons({
  protocol,
  onEdit,
  onDelete,
  onSend,
  onView,
  userRole,
  status,
  clientSignature
}: ProtocolActionButtonsProps) {
  const { toast } = useToast();

  const handleDownload = async (format: 'docx' | 'pdf') => {
    try {
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: { protocolId: protocol.id, format }
      });

      if (error) throw error;

      // Create a download link for the returned blob
      const blob = new Blob([data], { 
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `protocol-${protocol.protocol_number}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Chyba při stahování dokumentu",
        description: "Nepodařilo se stáhnout protokol. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Stáhnout
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleDownload('docx')}>
            <FileText className="h-4 w-4 mr-2" />
            Stáhnout jako DOCX
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload('pdf')}>
            <File className="h-4 w-4 mr-2" />
            Stáhnout jako PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {onSend && (
        <Button variant="outline" size="sm" onClick={onSend}>
          <Send className="h-4 w-4 mr-2" />
          Odeslat
        </Button>
      )}

      {(onEdit || onDelete || onView) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={onView}>
                <FileText className="h-4 w-4 mr-2" />
                Zobrazit
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Upravit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Smazat
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
