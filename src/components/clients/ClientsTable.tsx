
import { useState } from "react";
import { Eye, Link2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientDetailSheet } from "./ClientDetailSheet";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  ico: string | null;
  dic: string | null;
  created_at: string;
  status: string;
  protocols: { count: number }[] | null;
}

interface ClientsTableProps {
  clients: Client[];
}

export const ClientsTable = ({ clients }: ClientsTableProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Název klienta</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>IČO / DIČ</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vytvořeno</TableHead>
              <TableHead>Protokoly</TableHead>
              <TableHead className="text-right">Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {client.email && (
                      <div className="text-sm">{client.email}</div>
                    )}
                    {client.phone && (
                      <div className="text-sm text-muted-foreground">
                        {client.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {client.ico && (
                      <div className="text-sm">IČO: {client.ico}</div>
                    )}
                    {client.dic && (
                      <div className="text-sm text-muted-foreground">
                        DIČ: {client.dic}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={client.status === "active" ? "default" : "secondary"}
                  >
                    {client.status === "active" ? "Aktivní" : "Neaktivní"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(client.created_at).toLocaleDateString("cs-CZ")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {client.protocols && client.protocols[0] ? client.protocols[0].count : 0}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedClientId(client.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Link2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nebyly nalezeny žádní klienti
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ClientDetailSheet
        clientId={selectedClientId}
        open={!!selectedClientId}
        onOpenChange={(open) => !open && setSelectedClientId(null)}
      />
    </>
  );
};
