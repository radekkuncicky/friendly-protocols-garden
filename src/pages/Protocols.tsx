import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Eye,
  Send,
  Download,
  Trash2,
  PlusCircle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type Protocol = {
  id: string;
  protocol_number: string;
  client_id: string | null;
  content: any;
  status: string;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
};

type Client = {
  id: string;
  name: string;
};

const Protocols = () => {
  const { toast } = useToast();
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

      return protocolsData;
    },
  });

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Protokoly</h1>
        <Button onClick={() => console.log("Create new protocol")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nový protokol
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Hledat protokoly..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrovat dle stavu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny stavy</SelectItem>
              <SelectItem value="draft">Rozpracované</SelectItem>
              <SelectItem value="sent">Odeslané</SelectItem>
              <SelectItem value="completed">Dokončené</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Protocols Table */}
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
            {filteredProtocols?.map((protocol) => (
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
            {(!filteredProtocols || filteredProtocols.length === 0) && (
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
    </div>
  );
};

export default Protocols;