
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateTemplateBasicInfo } from "./CreateTemplateBasicInfo";
import { CreateTemplateItems } from "./CreateTemplateItems";

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
      
      const { error } = await supabase.from("user_templates").insert({
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
      resetForm();
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

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("Obecné");
    setItems([]);
    setSignatureRequired(true);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Vytvořit novou šablonu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CreateTemplateBasicInfo
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            signatureRequired={signatureRequired}
            setSignatureRequired={setSignatureRequired}
          />
          
          <CreateTemplateItems
            items={items}
            setItems={setItems}
          />

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
