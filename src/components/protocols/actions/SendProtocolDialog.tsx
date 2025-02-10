
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
import { Loader2 } from "lucide-react";

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
  const [subject, setSubject] = useState(`Předávací protokol ${protocol.protocol_number}`);
  const [message, setMessage] = useState(`Vážený zákazníku,\n\nv příloze Vám zasíláme předávací protokol ${protocol.protocol_number}.\n\nS pozdravem`);

  const sendMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase.functions.invoke('process-and-send-protocol', {
        body: {
          protocolId: protocol.id,
          emailSubject: subject,
          emailBody: message.replace(/\n/g, '<br>'),
        },
        headers: {
          'x-user-id': session.user.id,
        },
      });

      if (error) throw error;
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
      <DialogContent className="max-w-2xl">
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
            <Label htmlFor="subject">Předmět</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="message">Text emailu</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zrušit
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={sendMutation.isPending}
          >
            {sendMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Odesílání...
              </>
            ) : (
              "Odeslat"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
