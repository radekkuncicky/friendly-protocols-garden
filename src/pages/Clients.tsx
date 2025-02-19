
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { CreateClientSheet } from "@/components/clients/CreateClientSheet";
import type { Client } from "@/types/client";

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select(`
          *,
          contacts:client_contacts (
            id,
            contact_type,
            contact_value,
            is_primary
          ),
          protocols:protocols!protocols_client_id_fkey (
            count
          )
        `)
        .order(sortBy, { ascending: false });

      if (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }

      // Transform the data to match the Client type
      const transformedData: Client[] = data?.map(client => ({
        ...client,
        contacts: client.contacts || [],
        protocols: client.protocols || []
      })) || [];

      return transformedData;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded-md" />
        <div className="h-64 bg-gray-200 rounded-md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Klienti</h1>
        <CreateClientSheet 
          open={isCreateSheetOpen} 
          onOpenChange={setIsCreateSheetOpen}
        />
      </div>
      <ClientsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <ClientsTable clients={clients || []} />
    </div>
  );
};

export default Clients;
