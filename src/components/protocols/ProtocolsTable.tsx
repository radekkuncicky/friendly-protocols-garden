import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { ProtocolActions } from "./ProtocolActions";
import { Protocol } from "@/types/protocol";

interface ProtocolsTableProps {
  protocols: Protocol[] | null;
  userRole: string | null;
}

export const ProtocolsTable = ({ protocols, userRole }: ProtocolsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Číslo protokolu</TableHead>
            <TableHead>Klient</TableHead>
            <TableHead>Stav</TableHead>
            <TableHead>Vytvořeno</TableHead>
            <TableHead>Upraveno</TableHead>
            <TableHead className="text-right">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {protocols?.map((protocol) => (
            <TableRow key={protocol.id}>
              <TableCell className="font-medium">
                {protocol.protocol_number}
              </TableCell>
              <TableCell>{protocol.clients?.name || "—"}</TableCell>
              <TableCell>
                <StatusBadge status={protocol.status} />
              </TableCell>
              <TableCell>
                {new Date(protocol.created_at).toLocaleDateString("cs-CZ")}
              </TableCell>
              <TableCell>
                {new Date(protocol.updated_at).toLocaleDateString("cs-CZ")}
              </TableCell>
              <TableCell>
                <ProtocolActions 
                  userRole={userRole} 
                  protocolId={protocol.id}
                  status={protocol.status}
                  protocol={protocol}
                />
              </TableCell>
            </TableRow>
          ))}
          {(!protocols || protocols.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p className="text-muted-foreground">
                  Nebyly nalezeny žádné protokoly
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};