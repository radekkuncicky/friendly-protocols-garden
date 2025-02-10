
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Protocol } from "@/types/protocol";
import { ProtocolActionButtons } from "./actions/ProtocolActionButtons";
import { DeleteProtocolDialog } from "./actions/DeleteProtocolDialog";
import { EditProtocolDialog } from "./EditProtocolDialog";
import { SendProtocolDialog } from "./actions/SendProtocolDialog";
import { ViewProtocolDialog } from "./actions/ViewProtocolDialog";

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
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

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

  const handleDownload = async () => {
    try {
      // Implementation for download functionality will be added here
      toast({
        title: "Stahování protokolu",
        description: clientSignature 
          ? "Stahování podepsaného PDF protokolu"
          : "Stahování protokolu",
      });
    } catch (error) {
      console.error('Error downloading protocol:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se stáhnout protokol. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ProtocolActionButtons
        userRole={userRole}
        status={status}
        onView={() => setShowViewDialog(true)}
        onEdit={() => setShowEditDialog(true)}
        onSend={() => setShowSendDialog(true)}
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

      <SendProtocolDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        protocol={protocol}
      />

      <ViewProtocolDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        protocol={protocol}
      />
    </>
  );
};
