
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { CreateClientSheet } from "@/components/clients/CreateClientSheet";

const Clients = () => {
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select(`
          *,
          contacts (
            id,
            contact_type,
            contact_value,
            is_primary
          ),
          protocols:protocols!fk_client (
            count
          )
        `);

      if (error) throw error;
      return data || [];
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
        <CreateClientSheet />
      </div>
      <ClientsFilters />
      <ClientsTable clients={clients} />
    </div>
  );
};

export default Clients;
