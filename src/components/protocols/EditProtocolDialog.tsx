
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Protocol, ProtocolContent } from "@/types/protocol";
import { EditProtocolForm } from "./edit/EditProtocolForm";

interface EditProtocolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocol: Protocol;
}

export const EditProtocolDialog = ({
  open,
  onOpenChange,
  protocol,
}: EditProtocolDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState<ProtocolContent>(protocol.content || {});

  // Initialize form data when dialog opens
  useEffect(() => {
    if (open && protocol) {
      // Initialize content from protocol
      setContent(protocol.content || {});
      
      // If protocol has a date in content, parse and set it
      if (protocol.content?.date) {
        setDate(new Date(protocol.content.date));
      } else {
        setDate(new Date());
      }
    }
  }, [open, protocol]);

  const updateMutation = useMutation({
    mutationFn: async (data: { content?: ProtocolContent; manager_signature?: string; client_signature?: string; updated_at?: string }) => {
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
      content: {
        ...content,
        date: date?.toISOString(), // Include the date in content
      },
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
        <ScrollArea className="flex-1">
          <EditProtocolForm
            protocol={protocol}
            content={content}
            date={date}
            setDate={setDate}
            setContent={setContent}
            onSubmit={handleSubmit}
            onClose={() => onOpenChange(false)}
            onManagerSignature={handleManagerSignature}
            onClientSignature={handleClientSignature}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
