
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Protocol } from "@/types/protocol";

interface SendProtocolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocol: Protocol;
}

export const SendProtocolDialog = ({
  open,
  onOpenChange,
  protocol,
}: SendProtocolDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(protocol.clients?.email || "");
  const [message, setMessage] = useState("");

  const sendMutation = useMutation({
    mutationFn: async () => {
      const { error: updateError } = await supabase
        .from('protocols')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', protocol.id);
      
      if (updateError) throw updateError;

      // Here we would typically call an edge function to send the email
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: "Protokol odeslán",
        description: "Protokol byl úspěšně odeslán na uvedený email.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error sending protocol:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se odeslat protokol. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!email) {
      toast({
        title: "Chybí email",
        description: "Prosím vyplňte emailovou adresu příjemce.",
        variant: "destructive",
      });
      return;
    }
    sendMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Odeslat protokol</DialogTitle>
          <DialogDescription>
            Protokol bude odeslán na uvedenou emailovou adresu.
            {protocol.status === 'sent' && (
              <p className="text-orange-500 mt-2">
                Tento protokol již byl odeslán {new Date(protocol.sent_at!).toLocaleDateString('cs-CZ')}
              </p>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email příjemce</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              type="email"
            />
          </div>

          <div>
            <Label htmlFor="message">Doprovodná zpráva (volitelné)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Zde můžete napsat doprovodnou zprávu..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zrušit
          </Button>
          <Button onClick={handleSend} disabled={sendMutation.isPending}>
            {sendMutation.isPending ? "Odesílání..." : "Odeslat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
