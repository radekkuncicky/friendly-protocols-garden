import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Template {
  id: string;
  name: string;
  content: any;
  category?: string;
}

interface PreviewTemplateDialogProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PreviewTemplateDialog = ({
  template,
  open,
  onOpenChange,
}: PreviewTemplateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Náhled šablony: {template.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-4 p-4">
            <div className="prose prose-sm max-w-none">
              <h2>{template.name}</h2>
              <p>{template.content.description}</p>
              {/* Additional preview content will be implemented in the next iteration */}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewTemplateDialog;