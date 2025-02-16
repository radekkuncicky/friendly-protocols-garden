
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateTemplateBasicInfo } from "./CreateTemplateBasicInfo";
import { CreateTemplateItems } from "./CreateTemplateItems";
import { useTemplates } from "@/hooks/useTemplates";

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
  const { createTemplateMutation } = useTemplates();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Obecné");
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [signatureRequired, setSignatureRequired] = useState(true);

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
      return;
    }

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

    createTemplateMutation.mutate({
      name,
      description,
      content: templateContent,
      category,
      signature_required: signatureRequired,
      status: 'draft',
      is_locked: false,
    });

    onOpenChange(false);
    resetForm();
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
