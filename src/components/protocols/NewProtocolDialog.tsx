
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewProtocolForm } from "./NewProtocolForm";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewProtocolDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewProtocolDialog = ({ isOpen, onOpenChange }: NewProtocolDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Button className="bg-amber-500 hover:bg-amber-400 text-gray-950">
        <PlusCircle className="mr-2 h-4 w-4" />
        Nový protokol
      </Button>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vytvořit nový protokol</DialogTitle>
        </DialogHeader>
        <NewProtocolForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
