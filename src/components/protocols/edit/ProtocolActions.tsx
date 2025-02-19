
import { Button } from "@/components/ui/button";
import { X, Download, Send, Save } from "lucide-react";
import { generatePDF } from "@/lib/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";
import { Protocol } from "@/types/protocol";
import { useToast } from "@/hooks/use-toast";

interface ProtocolActionsProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  protocol: Protocol;
}

export const ProtocolActions = ({ onClose, onSubmit, protocol }: ProtocolActionsProps) => {
  const { toast } = useToast();
  const isEditable = protocol.status === 'draft';

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = await generatePDF(protocol);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `protocol-${protocol.protocol_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se vygenerovat PDF. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    }
  };

  const handleSendToClient = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-protocol', {
        body: { protocolId: protocol.id }
      });
      
      if (error) throw error;

      toast({
        title: "Protokol odeslán",
        description: "Protokol byl úspěšně odeslán klientovi.",
      });
    } catch (error) {
      console.error('Error sending protocol:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se odeslat protokol. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border-t p-4 bg-background flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose}>
        <X className="h-4 w-4 mr-2" />
        Zrušit
      </Button>
      <Button type="button" variant="outline" onClick={handleDownloadPDF}>
        <Download className="h-4 w-4 mr-2" />
        {isEditable ? 'Stáhnout upravitelný PDF' : 'Stáhnout finální PDF'}
      </Button>
      {isEditable && (
        <>
          <Button type="button" variant="secondary" onClick={handleSendToClient}>
            <Send className="h-4 w-4 mr-2" />
            Odeslat klientovi
          </Button>
          <Button onClick={onSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Uložit změny
          </Button>
        </>
      )}
    </div>
  );
};
