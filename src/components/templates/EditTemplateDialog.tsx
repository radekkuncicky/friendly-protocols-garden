
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCustomizationPanel } from "./TemplateCustomizationPanel";
import { Plus, Trash2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Template } from "@/types/template";
import type { Json } from "@/integrations/supabase/types";

interface EditTemplateDialogProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TemplateItem {
  name: string;
  quantity: string;
  unit: string;
}

const EditTemplateDialog = ({
  template,
  open,
  onOpenChange
}: EditTemplateDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.content.description || "");
  const [category, setCategory] = useState(template.category || "Obecné");
  const [activeTab, setActiveTab] = useState<"basic" | "customize">("basic");
  const [items, setItems] = useState<TemplateItem[]>(
    (template.content.items as TemplateItem[]) || []
  );

  useEffect(() => {
    setName(template.name);
    setDescription(template.content.description || "");
    setCategory(template.category || "Obecné");
    setItems((template.content.items as TemplateItem[]) || []);
  }, [template]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      // Convert items to a format compatible with Json type
      const jsonItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit
      })) as Json[];

      const { error } = await supabase
        .from("user_templates")
        .update({
          name,
          content: {
            ...template.content,
            description,
            items: jsonItems
          },
          category
        })
        .eq("id", template.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona aktualizována",
        description: "Šablona byla úspěšně aktualizována."
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Při aktualizaci šablony došlo k chybě.",
        variant: "destructive"
      });
      console.error("Error updating template:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Chyba",
        description: "Název šablony je povinný.",
        variant: "destructive"
      });
      return;
    }
    updateMutation.mutate();
  };

  const addItem = () => {
    setItems([...items, {
      name: "",
      quantity: "",
      unit: "ks"
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof TemplateItem, value: string) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upravit šablonu</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "basic" | "customize")}>
          <TabsList>
            <TabsTrigger value="basic">Základní informace</TabsTrigger>
            <TabsTrigger value="customize">Přizpůsobit šablonu</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Název šablony</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Zadejte název šablony"
                />
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Zadejte popis šablony"
                />
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="items">
                  <AccordionTrigger className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <span>Položky</span>
                      <span className="text-sm text-muted-foreground">({items.length})</span>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={e => {
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
                              onChange={e => updateItem(index, "name", e.target.value)} 
                              placeholder="Název položky" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Množství</Label>
                            <Input 
                              type="number" 
                              value={item.quantity} 
                              onChange={e => updateItem(index, "quantity", e.target.value)} 
                              placeholder="Množství" 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Jednotka</Label>
                            <Select 
                              value={item.unit} 
                              onValueChange={value => updateItem(index, "unit", value)}
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

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Zrušit
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Ukládám..." : "Uložit změny"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="customize">
            <TemplateCustomizationPanel
              template={template}
              onClose={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;
