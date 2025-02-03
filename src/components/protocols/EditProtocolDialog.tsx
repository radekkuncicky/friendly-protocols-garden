import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditProtocolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocol: {
    id: string;
    protocol_number: string;
    client_id: string | null;
    content: any;
  };
}

export const EditProtocolDialog = ({
  open,
  onOpenChange,
  protocol,
}: EditProtocolDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [protocolNumber, setProtocolNumber] = useState(protocol.protocol_number);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('protocols')
        .update({ 
          protocol_number: protocolNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', protocol.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: "Protocol updated",
        description: "Protocol has been updated successfully.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error updating protocol:', error);
      toast({
        title: "Error",
        description: "Failed to update protocol. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Protocol</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="protocol_number">Protocol Number</Label>
            <Input
              id="protocol_number"
              value={protocolNumber}
              onChange={(e) => setProtocolNumber(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};