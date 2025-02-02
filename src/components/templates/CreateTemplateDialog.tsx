import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TemplateItem {
  name: string;
  quantity: string;
  unit: string;
}

const CreateTemplateDialog = ({ open, onOpenChange }: CreateTemplateDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Obecné");
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [signatureRequired, setSignatureRequired] = useState(true);

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) throw new Error("No user session");
      
      const templateContent = {
        description,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unit: item.unit
        })),
        header: {
          show_logo: true,
          show_title: true,
          show_page_numbers: true
        },
        footer: {
          show_contact: true,
          show_disclaimer: false
        }
      };
      
      const { error } = await supabase.from("templates").insert({
        name,
        content: templateContent,
        category,
        signature_required: signatureRequired,
        status: 'draft',
        created_by: sessionData.session.user.id,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona vytvořena",
        description: "Nová šablona byla úspěšně vytvořena.",
      });
      onOpenChange(false);
      setName("");
      setDescription("");
      setCategory("Obecné");
      setItems([]);
      setSignatureRequired(true);
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Při vytváření šablony došlo k chybě.",
        variant: "destructive",
      });
      console.error("Error creating template:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Chyba",
        description: "Název šablony je povinný.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate();
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: "", unit: "ks" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof TemplateItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Vytvořit novou šablonu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Název šablony</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Zadejte název šablony"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Kategorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte kategorii" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Obecné">Obecné</SelectItem>
                  <SelectItem value="Stavební">Stavební</SelectItem>
                  <SelectItem value="Údržba">Údržba</SelectItem>
                  <SelectItem value="Kontrola">Kontrola</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="description">Popis</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Zadejte popis šablony"
            />
          </div>

          <div className="flex items-center space-x-2 py-1">
            <Switch
              id="signature-required"
              checked={signatureRequired}
              onCheckedChange={setSignatureRequired}
            />
            <Label htmlFor="signature-required">Vyžadovat podpis</Label>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="items">
              <AccordionTrigger className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                  <span>Položky</span>
                  <span className="text-sm text-muted-foreground">({items.length})</span>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem();
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Přidat položku
                </Button>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 items-end">
                      <div className="space-y-1.5">
                        <Label>Název</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(index, "name", e.target.value)}
                          placeholder="Název položky"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Množství</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", e.target.value)}
                          placeholder="Množství"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Jednotka</Label>
                        <Select
                          value={item.unit}
                          onValueChange={(value) => updateItem(index, "unit", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ks">ks</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="h-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Zrušit
            </Button>
            <Button type="submit">Vytvořit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateDialog;