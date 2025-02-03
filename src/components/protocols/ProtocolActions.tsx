import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Protocol } from "@/types/protocol";
import { ProtocolActionButtons } from "./actions/ProtocolActionButtons";
import { DeleteProtocolDialog } from "./actions/DeleteProtocolDialog";
import { EditProtocolDialog } from "./EditProtocolDialog";

interface ProtocolActionsProps {
  userRole: string | null;
  protocolId: string;
  status: Protocol['status'];
  protocol: Protocol;
  clientSignature?: string | null;
}

export const ProtocolActions = ({ 
  userRole, 
  protocolId, 
  status, 
  protocol,
  clientSignature
}: ProtocolActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('protocols')
        .delete()
        .eq('id', protocolId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: "Protokol smazán",
        description: "Protokol byl úspěšně smazán.",
      });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      console.error('Error deleting protocol:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat protokol. Zkuste to prosím znovu.",
        variant: "destructive",
      });
      setShowDeleteDialog(false);
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      // First, check the current status of the protocol
      const { data: currentProtocol, error: fetchError } = await supabase
        .from('protocols')
        .select('status')
        .eq('id', protocolId)
        .single();

      if (fetchError) throw fetchError;

      // If protocol is already sent or completed, prevent sending
      if (currentProtocol?.status === 'sent' || currentProtocol?.status === 'completed') {
        throw new Error('Protocol has already been sent');
      }

      // If checks pass, proceed with sending
      const { error: updateError } = await supabase
        .from('protocols')
        .update({ 
          status: 'sent' as const,
          sent_at: new Date().toISOString()
        })
        .eq('id', protocolId);
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: "Protokol odeslán",
        description: "Protokol byl úspěšně odeslán.",
      });
    },
    onError: (error) => {
      console.error('Error sending protocol:', error);
      const errorMessage = error instanceof Error && error.message === 'Protocol has already been sent'
        ? "Protokol již byl odeslán a nelze jej odeslat znovu."
        : "Nepodařilo se odeslat protokol. Zkuste to prosím znovu.";
      
      toast({
        title: "Chyba",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleView = () => {
    toast({
      title: "Zobrazit protokol",
      description: "Zobrazení detailů protokolu (bude implementováno)",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Stáhnout protokol",
      description: "Stahování protokolu (bude implementováno)",
    });
  };

  const handleSend = () => {
    if (window.confirm('Opravdu chcete odeslat tento protokol? Po odeslání již nebude možné protokol znovu odeslat.')) {
      sendMutation.mutate();
    }
  };

  return (
    <>
      <ProtocolActionButtons
        userRole={userRole}
        status={status}
        onView={handleView}
        onEdit={() => setShowEditDialog(true)}
        onSend={handleSend}
        onDownload={handleDownload}
        onDelete={() => setShowDeleteDialog(true)}
        clientSignature={clientSignature}
      />

      <DeleteProtocolDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => deleteMutation.mutate()}
      />

      <EditProtocolDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        protocol={protocol}
      />
    </>
  );
};