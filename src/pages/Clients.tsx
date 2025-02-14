import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsFilters } from "@/components/clients/ClientsFilters";
import { CreateClientSheet } from "@/components/clients/CreateClientSheet";
const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateClient, setShowCreateClient] = useState(false);
  const {
    data: clients,
    isLoading
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("clients").select(`
          *,
          protocols:protocols(count)
        `).order("created_at", {
        ascending: false
      });
      if (error) throw error;

      // Ensure protocols is always an array with at least one item containing count
      return data.map(client => ({
        ...client,
        protocols: client.protocols || [{
          count: 0
        }]
      }));
    }
  });
  const filteredClients = clients?.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || client.email?.toLowerCase().includes(searchQuery.toLowerCase()) || client.ico?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const sortedClients = filteredClients?.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "protocols":
        return (b.protocols[0]?.count || 0) - (a.protocols[0]?.count || 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  if (isLoading) {
    return <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Klienti</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-md" />
          <div className="h-64 bg-gray-200 rounded-md" />
        </div>
      </div>;
  }
  return <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Klienti</h1>
        <Button onClick={() => setShowCreateClient(true)} className="bg-amber-500 hover:bg-amber-400 text-slate-950">
          <Plus className="mr-2 h-4 w-4" />
          Přidat nového klienta
        </Button>
      </div>

      <ClientsFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} sortBy={sortBy} setSortBy={setSortBy} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <ClientsTable clients={sortedClients || []} />

      <CreateClientSheet open={showCreateClient} onOpenChange={setShowCreateClient} />
    </div>;
};
export default Clients;