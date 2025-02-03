import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "../StatusBadge";

interface ProtocolHeaderProps {
  protocolNumber: string;
  status: string;
  updatedAt: string;
}

export const ProtocolHeader = ({ protocolNumber, status, updatedAt }: ProtocolHeaderProps) => (
  <DialogHeader className="border-b pb-4">
    <div className="flex justify-between items-center">
      <DialogTitle>Upravit protokol</DialogTitle>
      <StatusBadge status={status} />
    </div>
    <div className="text-sm text-muted-foreground mt-2">
      Protokol č. {protocolNumber}
      <br />
      Poslední úprava: {format(new Date(updatedAt), "d. MMMM yyyy HH:mm", { locale: cs })}
    </div>
  </DialogHeader>
);