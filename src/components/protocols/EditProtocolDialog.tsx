import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ProtocolHeader } from "./edit/ProtocolHeader";
import { ClientProjectDetails } from "./edit/ClientProjectDetails";
import { ProtocolItems } from "./edit/ProtocolItems";
import { SignatureCanvas } from "./edit/SignatureCanvas";
import { ProtocolActions } from "./edit/ProtocolActions";

interface EditProtocolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocol: {
    id: string;
    protocol_number: string;
    client_id: string | null;
    content: any;
    status: string;
    updated_at: string;
    manager_signature?: string;
    client_signature?: string;
  };
}

export const EditProtocolDialog = ({
  open,
  onOpenChange,
  protocol,
}: EditProtocolDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [content, setContent] = useState(protocol.content || {});

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<typeof protocol>) => {
      const { error } = await supabase
        .from('protocols')
        .update(data)
        .eq('id', protocol.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: "Protokol aktualizován",
        description: "Protokol byl úspěšně aktualizován.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error updating protocol:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se aktualizovat protokol. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ 
      content,
      updated_at: new Date().toISOString()
    });
  };

  const handleManagerSignature = (signature: string) => {
    updateMutation.mutate({
      manager_signature: signature,
    });
  };

  const handleClientSignature = (signature: string) => {
    updateMutation.mutate({
      client_signature: signature,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <ProtocolHeader
          protocolNumber={protocol.protocol_number}
          status={protocol.status}
          updatedAt={protocol.updated_at}
        />

        <ScrollArea className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <ClientProjectDetails
              content={content}
              date={date}
              setDate={setDate}
              setContent={setContent}
            />

            <Separator />

            <ProtocolItems
              content={content}
              setContent={setContent}
            />

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Poznámky</h3>
              <Textarea
                value={content.notes || ""}
                onChange={(e) => setContent({ ...content, notes: e.target.value })}
                rows={4}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Podpisy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SignatureCanvas
                  label="Podpis manažera"
                  onSave={handleManagerSignature}
                />
                <SignatureCanvas
                  label="Podpis klienta"
                  onSave={handleClientSignature}
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <ProtocolActions
          onClose={() => onOpenChange(false)}
          onSubmit={handleSubmit}
          protocol={protocol}
        />
      </DialogContent>
    </Dialog>
  );
};