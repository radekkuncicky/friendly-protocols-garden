
import { useState } from "react";
import { Eye, Link2, Trash2 } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientDetailSheet } from "./ClientDetailSheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Client, ClientContact } from "@/types/client";

interface ClientsTableProps {
  clients: Client[];
}

export const ClientsTable = ({ clients }: ClientsTableProps) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getPrimaryContact = (contacts: ClientContact[], type: string) => {
    return contacts?.find(contact => contact.contact_type === type && contact.is_primary)?.contact_value;
  };

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      // First delete related contacts
      const { error: contactsError } = await supabase
        .from('client_contacts')
        .delete()
        .eq('client_id', clientId);

      if (contactsError) throw contactsError;

      // Then delete the client
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Klient smazán",
        description: "Klient byl úspěšně odstraněn",
      });
      setClientToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat klienta: " + error.message,
        variant: "destructive",
      });
      setClientToDelete(null);
    },
  });

  const handleDeleteClient = (clientId: string) => {
    deleteClientMutation.mutate(clientId);
  };

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
            {clients.map(client => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {getPrimaryContact(client.contacts, 'email') && (
                      <div className="text-sm">
                        {getPrimaryContact(client.contacts, 'email')}
                      </div>
                    )}
                    {getPrimaryContact(client.contacts, 'phone') && (
                      <div className="text-sm text-muted-foreground">
                        {getPrimaryContact(client.contacts, 'phone')}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {client.ico && <div className="text-sm">IČO: {client.ico}</div>}
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
                    className="bg-lime-500 hover:bg-lime-400"
                  >
                    {client.status === "active" ? "Aktivní" : "Neaktivní"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(client.created_at).toLocaleDateString("cs-CZ")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {client.protocols && client.protocols[0]
                      ? client.protocols[0].count
                      : 0}
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
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => setClientToDelete(client.id)}
                    >
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

      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu chcete smazat tohoto klienta?</AlertDialogTitle>
            <AlertDialogDescription>
              Tato akce je nevratná. Klient bude trvale odstraněn ze systému včetně všech jeho kontaktů.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clientToDelete && handleDeleteClient(clientToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
