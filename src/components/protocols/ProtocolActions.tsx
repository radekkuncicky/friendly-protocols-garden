import { Eye, Send, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProtocolActionsProps {
  userRole: string | null;
  protocolId: string;
  status: string;
}

export const ProtocolActions = ({ userRole, protocolId, status }: ProtocolActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    },
    onError: (error) => {
      console.error('Error deleting protocol:', error);
      toast({
        title: "Error",
        description: "Failed to delete protocol. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('protocols')
        .update({ 
          status: 'sent',
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
    // TODO: Implement view functionality
    toast({
      title: "View protocol",
      description: "Viewing protocol details (to be implemented)",
    });
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    toast({
      title: "Download protocol",
      description: "Downloading protocol (to be implemented)",
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this protocol?')) {
      deleteMutation.mutate();
    }
  };

  const handleSend = () => {
    if (window.confirm('Are you sure you want to send this protocol?')) {
      sendMutation.mutate();
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="icon" onClick={handleView}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleSend}
        disabled={status === 'sent'}
      >
        <Send className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={handleDownload}>
        <Download className="h-4 w-4" />
      </Button>
      {(userRole === "admin" || userRole === "manager") && (
        <Button variant="destructive" size="icon" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};