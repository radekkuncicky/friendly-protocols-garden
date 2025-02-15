
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
import { Template } from "@/types/template";

interface EditTemplateDialogProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

  useEffect(() => {
    setName(template.name);
    setDescription(template.content.description || "");
    setCategory(template.category || "Obecné");
  }, [template]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("templates")
        .update({
          name,
          content: {
            ...template.content,
            description
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

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Zrušit
                </Button>
                <Button type="submit">Uložit změny</Button>
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
