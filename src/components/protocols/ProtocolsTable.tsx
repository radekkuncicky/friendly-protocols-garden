
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
  ResizableHandle,
} from "@/components/ui/resizable";

interface ProtocolsTableProps {
  protocols: Protocol[] | null;
  userRole: string | null;
}

export const ProtocolsTable = ({ protocols, userRole }: ProtocolsTableProps) => {
  return (
    <div className="rounded-md border">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Číslo protokolu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols?.map((protocol) => (
                <TableRow key={protocol.id}>
                  <TableCell className="font-medium">
                    {protocol.protocol_number}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={15}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Klient</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols?.map((protocol) => (
                <TableRow key={protocol.id}>
                  <TableCell>{protocol.clients?.name || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={15} minSize={10}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stav</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols?.map((protocol) => (
                <TableRow key={protocol.id}>
                  <TableCell>
                    <StatusBadge status={protocol.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={15} minSize={10}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vytvořeno</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols?.map((protocol) => (
                <TableRow key={protocol.id}>
                  <TableCell>
                    {new Date(protocol.created_at).toLocaleDateString("cs-CZ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={15} minSize={10}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Upraveno</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols?.map((protocol) => (
                <TableRow key={protocol.id}>
                  <TableCell>
                    {new Date(protocol.updated_at).toLocaleDateString("cs-CZ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={15} minSize={10}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {protocols?.map((protocol) => (
                <TableRow key={protocol.id}>
                  <TableCell>
                    <ProtocolActions 
                      userRole={userRole} 
                      protocolId={protocol.id}
                      status={protocol.status}
                      protocol={protocol}
                      clientSignature={protocol.client_signature}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
      </ResizablePanelGroup>
      {(!protocols || protocols.length === 0) && (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            <p className="text-muted-foreground">
              Nebyly nalezeny žádné protokoly
            </p>
          </TableCell>
        </TableRow>
      )}
    </div>
  );
};
