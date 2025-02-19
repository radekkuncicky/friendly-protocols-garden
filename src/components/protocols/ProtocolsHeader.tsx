
import { useState } from "react";
import { Template } from "@/types/template";
import { NewProtocolDialog } from "./NewProtocolDialog";
import { TemplateDialog } from "./TemplateDialog";

export const ProtocolsHeader = () => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isNewProtocolOpen, setIsNewProtocolOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleTemplateSelect = (template: Template) => {
    const templateItems = template.content.items?.map(item => ({
      name: item.name || "",
      quantity: item.quantity || "1",
      unit: item.unit || "ks"
    })) || [];

    setSelectedTemplate(template);
    setIsTemplateDialogOpen(false);
    setIsNewProtocolOpen(true);
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Protokoly</h1>
      <div className="flex gap-2">
        <TemplateDialog
          isOpen={isTemplateDialogOpen}
          onOpenChange={setIsTemplateDialogOpen}
          onTemplateSelect={handleTemplateSelect}
        />

        <NewProtocolDialog
          isOpen={isNewProtocolOpen}
          onOpenChange={setIsNewProtocolOpen}
        />
      </div>
    </div>
  );
};
