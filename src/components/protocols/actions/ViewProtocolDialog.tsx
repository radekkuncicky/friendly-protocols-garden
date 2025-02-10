
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Protocol } from "@/types/protocol";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil } from "lucide-react";

interface ViewProtocolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocol: Protocol;
}

export const ViewProtocolDialog = ({
  open,
  onOpenChange,
  protocol,
}: ViewProtocolDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Protokol č. {protocol.protocol_number}</span>
            {!protocol.client_signature && protocol.status !== 'completed' && (
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Upravit
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Informace o klientovi</h3>
              <p>Název: {protocol.clients?.name}</p>
              {/* Add more client details here */}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Obsah protokolu</h3>
              {/* Add protocol content here */}
            </div>

            {protocol.client_signature && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Podpisy</h3>
                <p>Protokol byl podepsán klientem</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
