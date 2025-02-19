
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateCustomizationPanel } from "./TemplateCustomizationPanel";
import { Template } from "@/types/template";
import type { Json } from "@/integrations/supabase/types";
import { EditTemplateBasicInfo } from "./edit/EditTemplateBasicInfo";
import { EditTemplateItems } from "./edit/EditTemplateItems";

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
              <EditTemplateBasicInfo
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                category={category}
                setCategory={setCategory}
              />

              <EditTemplateItems
                items={items}
                addItem={addItem}
                removeItem={removeItem}
                updateItem={updateItem}
              />

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
