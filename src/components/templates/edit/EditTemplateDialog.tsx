import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TemplateBasicInfo } from "../create/TemplateBasicInfo";

interface Template {
  id: string;
  name: string;
  content: any;
  category?: string;
  is_locked?: boolean;
  signature_required: boolean;
}

interface EditTemplateDialogProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditTemplateDialog = ({
  template,
  open,
  onOpenChange,
}: EditTemplateDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.content.description || "");
  const [category, setCategory] = useState(template.category || "Obecné");
  const [signatureRequired, setSignatureRequired] = useState(template.signature_required);

  useEffect(() => {
    setName(template.name);
    setDescription(template.content.description || "");
    setCategory(template.category || "Obecné");
    setSignatureRequired(template.signature_required);
  }, [template]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("templates")
        .update({
          name,
          content: {
            ...template.content,
            description,
          },
          category,
          signature_required: signatureRequired,
        })
        .eq("id", template.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona aktualizována",
        description: "Šablona byla úspěšně aktualizována.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Při aktualizaci šablony došlo k chybě.",
        variant: "destructive",
      });
      console.error("Error updating template:", error);
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
    updateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upravit šablonu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <TemplateBasicInfo
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            signatureRequired={signatureRequired}
            setSignatureRequired={setSignatureRequired}
          />
          
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
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;