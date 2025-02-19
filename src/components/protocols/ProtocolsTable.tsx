
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
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={20} minSize={15}>
                <TableHead>Číslo protokolu</TableHead>
              </ResizablePanel>
              <ResizablePanel defaultSize={20} minSize={15}>
                <TableHead>Klient</TableHead>
              </ResizablePanel>
              <ResizablePanel defaultSize={15} minSize={10}>
                <TableHead>Stav</TableHead>
              </ResizablePanel>
              <ResizablePanel defaultSize={15} minSize={10}>
                <TableHead>Vytvořeno</TableHead>
              </ResizablePanel>
              <ResizablePanel defaultSize={15} minSize={10}>
                <TableHead>Upraveno</TableHead>
              </ResizablePanel>
              <ResizablePanel defaultSize={15} minSize={10}>
                <TableHead className="text-right">Akce</TableHead>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TableRow>
        </TableHeader>
        <TableBody>
          {protocols?.map((protocol) => (
            <TableRow key={protocol.id}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={20} minSize={15}>
                  <TableCell className="font-medium">
                    {protocol.protocol_number}
                  </TableCell>
                </ResizablePanel>
                <ResizablePanel defaultSize={20} minSize={15}>
                  <TableCell>{protocol.clients?.name || "—"}</TableCell>
                </ResizablePanel>
                <ResizablePanel defaultSize={15} minSize={10}>
                  <TableCell>
                    <StatusBadge status={protocol.status} />
                  </TableCell>
                </ResizablePanel>
                <ResizablePanel defaultSize={15} minSize={10}>
                  <TableCell>
                    {new Date(protocol.created_at).toLocaleDateString("cs-CZ")}
                  </TableCell>
                </ResizablePanel>
                <ResizablePanel defaultSize={15} minSize={10}>
                  <TableCell>
                    {new Date(protocol.updated_at).toLocaleDateString("cs-CZ")}
                  </TableCell>
                </ResizablePanel>
                <ResizablePanel defaultSize={15} minSize={10}>
                  <TableCell>
                    <ProtocolActions 
                      userRole={userRole} 
                      protocolId={protocol.id}
                      status={protocol.status}
                      protocol={protocol}
                      clientSignature={protocol.client_signature}
                    />
                  </TableCell>
                </ResizablePanel>
              </ResizablePanelGroup>
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
