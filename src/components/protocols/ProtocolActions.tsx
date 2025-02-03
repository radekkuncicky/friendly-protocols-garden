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
}

export const ProtocolActions = ({ 
  userRole, 
  protocolId, 
  status, 
  protocol 
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
        title: "Protocol deleted",
        description: "Protocol has been deleted successfully.",
      });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      console.error('Error deleting protocol:', error);
      toast({
        title: "Error",
        description: "Failed to delete protocol. Please try again.",
        variant: "destructive",
      });
      setShowDeleteDialog(false);
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('protocols')
        .update({ 
          status: 'sent' as const,
          sent_at: new Date().toISOString()
        })
        .eq('id', protocolId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: "Protocol sent",
        description: "Protocol has been sent successfully.",
      });
    },
    onError: (error) => {
      console.error('Error sending protocol:', error);
      toast({
        title: "Error",
        description: "Failed to send protocol. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleView = () => {
    toast({
      title: "View protocol",
      description: "Viewing protocol details (to be implemented)",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download protocol",
      description: "Downloading protocol (to be implemented)",
    });
  };

  const handleSend = () => {
    if (window.confirm('Are you sure you want to send this protocol?')) {
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