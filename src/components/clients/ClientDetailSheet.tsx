import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ClientActivityLog } from "./ClientActivityLog";
import { ClientStatusSelect } from "./ClientStatusSelect";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientDetailSheetProps {
  clientId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientDetailSheet = ({
  clientId,
  open,
  onOpenChange,
}: ClientDetailSheetProps) => {
  const { data: client, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      if (!clientId) return null;
      const { data, error } = await supabase
        .from("clients")
        .select(`
          *,
          protocols:protocols(count),
          profiles!clients_created_by_fkey(full_name)
        `)
        .eq("id", clientId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  if (!open || !clientId) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{client?.name}</SheetTitle>
            {client && <ClientStatusSelect client={client} />}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Vytvořeno: {format(new Date(client?.created_at || ''), "Pp", { locale: cs })}</span>
            <span>•</span>
            <span>Vytvořil: {client?.profiles?.full_name}</span>
          </div>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-8">
          <TabsList>
            <TabsTrigger value="details">Detaily</TabsTrigger>
            <TabsTrigger value="activity">Aktivita</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium">Kontaktní údaje</h3>
                {client?.email && <p className="text-sm">{client.email}</p>}
                {client?.phone && (
                  <p className="text-sm text-muted-foreground">{client.phone}</p>
                )}
                {client?.address && (
                  <p className="text-sm text-muted-foreground">{client.address}</p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-sm font-medium">Firemní údaje</h3>
                {client?.ico && (
                  <p className="text-sm">
                    IČO: <span className="text-muted-foreground">{client.ico}</span>
                  </p>
                )}
                {client?.dic && (
                  <p className="text-sm">
                    DIČ: <span className="text-muted-foreground">{client.dic}</span>
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-sm font-medium">Statistiky</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    Počet protokolů:{" "}
                    <Badge variant="secondary">
                      {client?.protocols[0]?.count || 0}
                    </Badge>
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={
                        client?.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {client?.status === "active" ? (
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Aktivní
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          Neaktivní
                        </span>
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            {client && <ClientActivityLog clientId={client.id} />}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};