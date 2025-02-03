import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProtocolsHeader } from "@/components/protocols/ProtocolsHeader";
import { ProtocolsFilters } from "@/components/protocols/ProtocolsFilters";
import { ProtocolsTable } from "@/components/protocols/ProtocolsTable";
import { Protocol, ProtocolContent } from "@/types/protocol";

const Protocols = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        if (roles) {
          setUserRole(roles.role);
        }
      }
    };
    fetchUserRole();
  }, []);

  // Fetch protocols with client information
  const { data: protocols, isLoading } = useQuery({
    queryKey: ["protocols"],
    queryFn: async () => {
      const { data: protocolsData, error: protocolsError } = await supabase
        .from("protocols")
        .select(`
          *,
          clients (
            name
          )
        `)
        .order("created_at", { ascending: sortOrder === "asc" });

      if (protocolsError) {
        console.error("Error fetching protocols:", protocolsError);
        throw protocolsError;
      }

      // Transform the data to match Protocol type
      const transformedData: Protocol[] = protocolsData.map(protocol => ({
        ...protocol,
        content: protocol.content as ProtocolContent,
        status: protocol.status as Protocol['status']
      }));

      return transformedData;
    },
  });

  const filteredProtocols = protocols?.filter((protocol) => {
    const matchesStatus = statusFilter === "all" || protocol.status === statusFilter;
    const matchesSearch = searchQuery.toLowerCase() === "" ||
      protocol.protocol_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.clients?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Protokoly</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-md" />
          <div className="h-64 bg-gray-200 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProtocolsHeader />
      <ProtocolsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <ProtocolsTable
        protocols={filteredProtocols}
        userRole={userRole}
      />
    </div>
  );
};

export default Protocols;