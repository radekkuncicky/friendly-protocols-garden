import { Eye, Send, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

interface Protocol {
  id: string;
  protocol_number: string;
  client_id: string | null;
  content: any;
  status: string;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  clients?: {
    name: string;
  };
}

interface ProtocolsTableProps {
  protocols: Protocol[] | null;
  userRole: string | null;
}

export const ProtocolsTable = ({ protocols, userRole }: ProtocolsTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Rozpracováno
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Odesláno
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Dokončeno
          </Badge>
        );
      default:
        return null;
    }
  };

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
              <TableCell>{getStatusBadge(protocol.status)}</TableCell>
              <TableCell>
                {new Date(protocol.created_at).toLocaleDateString("cs-CZ")}
              </TableCell>
              <TableCell>
                {new Date(protocol.updated_at).toLocaleDateString("cs-CZ")}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  {(userRole === "admin" || userRole === "manager") && (
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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