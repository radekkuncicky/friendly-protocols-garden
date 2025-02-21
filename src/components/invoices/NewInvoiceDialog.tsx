
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewInvoiceForm } from "./NewInvoiceForm";

interface NewInvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewInvoiceDialog = ({ isOpen, onOpenChange }: NewInvoiceDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Button className="bg-amber-500 hover:bg-amber-400 text-gray-950">
        <PlusCircle className="mr-2 h-4 w-4" />
        Nová faktura
      </Button>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vytvořit novou fakturu</DialogTitle>
        </DialogHeader>
        <NewInvoiceForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
