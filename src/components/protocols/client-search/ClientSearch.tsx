
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ClientSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (clientId: string, clientName: string) => void;
}

export const ClientSearch = ({ open, onOpenChange, onSelect }: ClientSearchProps) => {
  const [searchValue, setSearchValue] = useState("");

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("status", "active");
      if (error) throw error;
      return data || [];
    }
  });

  const renderContent = () => {
    if (isLoadingClients) {
      return (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2">Načítání klientů...</span>
        </div>
      );
    }

    const filteredClients = clients?.filter((client) =>
      client.name.toLowerCase().includes(searchValue.toLowerCase())
    ) || [];

    return (
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Vyhledat klienta..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>Žádný klient nenalezen.</CommandEmpty>
          <CommandGroup>
            {filteredClients.map((client) => (
              <CommandItem
                key={client.id}
                onSelect={() => onSelect(client.id, client.name)}
              >
                {client.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vyhledat klienta</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
