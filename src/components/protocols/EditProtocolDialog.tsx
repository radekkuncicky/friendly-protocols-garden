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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Save, Send, Download, X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
    mutationFn: async () => {
      const { error } = await supabase
        .from('protocols')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
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
    updateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <DialogTitle>Upravit protokol</DialogTitle>
            <StatusBadge status={protocol.status} />
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Protokol č. {protocol.protocol_number}
            <br />
            Poslední úprava: {format(new Date(protocol.updated_at), "d. MMMM yyyy HH:mm", { locale: cs })}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Client & Project Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Klient a projekt</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client_name">Jméno klienta</Label>
                  <Input
                    id="client_name"
                    value={content.client_name || ""}
                    onChange={(e) => setContent({ ...content, client_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Název společnosti</Label>
                  <Input
                    id="company_name"
                    value={content.company_name || ""}
                    onChange={(e) => setContent({ ...content, company_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_name">Název projektu</Label>
                  <Input
                    id="project_name"
                    value={content.project_name || ""}
                    onChange={(e) => setContent({ ...content, project_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Datum protokolu</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: cs }) : <span>Vybrat datum</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={cs}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <Separator />

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Položky</h3>
                <Button type="button" size="sm" onClick={() => {
                  const newItems = [...(content.items || []), { description: "", quantity: 1, unit: "ks" }];
                  setContent({ ...content, items: newItems });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Přidat položku
                </Button>
              </div>
              
              <div className="space-y-4">
                {(content.items || []).map((item: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                    <div className="md:col-span-2">
                      <Label>Popis</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...(content.items || [])];
                          newItems[index].description = e.target.value;
                          setContent({ ...content, items: newItems });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Množství</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...(content.items || [])];
                          newItems[index].quantity = e.target.value;
                          setContent({ ...content, items: newItems });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Jednotka</Label>
                      <Input
                        value={item.unit}
                        onChange={(e) => {
                          const newItems = [...(content.items || [])];
                          newItems[index].unit = e.target.value;
                          setContent({ ...content, items: newItems });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Notes Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Poznámky</h3>
              <Textarea
                value={content.notes || ""}
                onChange={(e) => setContent({ ...content, notes: e.target.value })}
                rows={4}
              />
            </div>
          </form>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="border-t p-4 bg-background flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Zrušit
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // TODO: Implement PDF download
              toast({
                title: "Stažení PDF",
                description: "Funkce bude brzy k dispozici.",
              });
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Stáhnout PDF
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              // TODO: Implement send to client
              toast({
                title: "Odeslání protokolu",
                description: "Funkce bude brzy k dispozici.",
              });
            }}
          >
            <Send className="h-4 w-4 mr-2" />
            Odeslat klientovi
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Uložit změny
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};