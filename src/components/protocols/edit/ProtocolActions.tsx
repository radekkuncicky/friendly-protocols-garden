import { Button } from "@/components/ui/button";
import { X, Download, Send, Save } from "lucide-react";
import { generatePDF } from "@/lib/pdfGenerator";
import { supabase } from "@/integrations/supabase/client";

interface ProtocolActionsProps {
  onClose: () => void;
  onSubmit: () => void;
  protocol: any;
}

export const ProtocolActions = ({ onClose, onSubmit, protocol }: ProtocolActionsProps) => {
  const handleDownloadPDF = async () => {
    const pdfBlob = await generatePDF(protocol);
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `protocol-${protocol.protocol_number}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleSendToClient = async () => {
    const { error } = await supabase.functions.invoke('send-protocol', {
      body: { protocolId: protocol.id }
    });
    
    if (error) {
      console.error('Error sending protocol:', error);
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
        Stáhnout PDF
      </Button>
      <Button type="button" variant="secondary" onClick={handleSendToClient}>
        <Send className="h-4 w-4 mr-2" />
        Odeslat klientovi
      </Button>
      <Button onClick={onSubmit}>
        <Save className="h-4 w-4 mr-2" />
        Uložit změny
      </Button>
    </div>
  );
};