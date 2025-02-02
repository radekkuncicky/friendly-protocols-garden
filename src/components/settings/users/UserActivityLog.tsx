import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, Download, Filter, History, Search, User, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { Database } from "@/integrations/supabase/types";

type ActivityLog = {
  id: string;
  created_at: string;
  action_type: string;
  action_description: string;
  affected_object_type: string;
  ip_address: string | null;
  device_info: string | null;
  details: any;
  user_id: string | null;
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
}

export const UserActivityLog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  const { data: logs, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["activity-logs", searchQuery, selectedAction, selectedUser, dateRange],
    queryFn: async () => {
      let query = supabase
        .from("activity_logs")
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`action_description.ilike.%${searchQuery}%,affected_object_type.ilike.%${searchQuery}%`);
      }

      if (selectedAction) {
        query = query.eq("action_type", selectedAction);
      }

      if (selectedUser) {
        query = query.eq("user_id", selectedUser);
      }

      if (dateRange?.from) {
        query = query.gte("created_at", dateRange.from.toISOString());
        if (dateRange.to) {
          query = query.lte("created_at", dateRange.to.toISOString());
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data as any[]).map(item => ({
        ...item,
        profiles: item.profiles || null
      })) as ActivityLog[];
    },
  });

  const getActionBadgeColor = (actionType: string) => {
    switch (actionType) {
      case "create":
        return "bg-green-500";
      case "update":
        return "bg-blue-500";
      case "delete":
        return "bg-red-500";
      case "role_change":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleExport = () => {
    if (!logs) return;
    
    const csvContent = logs.map(log => ({
      date: format(new Date(log.created_at), "dd.MM.yyyy HH:mm:ss"),
      user: log.profiles?.full_name || log.profiles?.email,
      action: log.action_type,
      description: log.action_description,
      object: log.affected_object_type,
      ip: log.ip_address,
      device: log.device_info
    }));

    const csvString = [
      ["Datum", "Uživatel", "Akce", "Popis", "Objekt", "IP Adresa", "Zařízení"],
      ...csvContent.map(row => Object.values(row))
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `activity-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1">
          <History className="text-muted-foreground" />
          <Input
            placeholder="Vyhledat v historii..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DatePickerWithRange
            value={dateRange}
            onChange={(newDateRange: DateRange | null) => setDateRange(newDateRange)}
          />
          <Select value={selectedAction || "all"} onValueChange={(value) => setSelectedAction(value === "all" ? null : value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrovat dle akce" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všechny akce</SelectItem>
              <SelectItem value="create">Vytvoření</SelectItem>
              <SelectItem value="update">Úprava</SelectItem>
              <SelectItem value="delete">Smazání</SelectItem>
              <SelectItem value="role_change">Změna role</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[600px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum a čas</TableHead>
              <TableHead>Uživatel</TableHead>
              <TableHead>Akce</TableHead>
              <TableHead>Popis</TableHead>
              <TableHead>Objekt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log) => (
              <TableRow
                key={log.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedLog(log)}
              >
                <TableCell>
                  {format(new Date(log.created_at), "dd.MM.yyyy HH:mm:ss")}
                </TableCell>
                <TableCell>{log.profiles?.full_name || log.profiles?.email}</TableCell>
                <TableCell>
                  <Badge className={getActionBadgeColor(log.action_type)}>
                    {log.action_type}
                  </Badge>
                </TableCell>
                <TableCell>{log.action_description}</TableCell>
                <TableCell>{log.affected_object_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <Sheet open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detail aktivity</SheetTitle>
            <SheetDescription>
              Podrobnosti o vybrané aktivitě
            </SheetDescription>
          </SheetHeader>
          {selectedLog && (
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Časové razítko</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedLog.created_at), "dd.MM.yyyy HH:mm:ss")}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Uživatel</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedLog.profiles?.full_name || selectedLog.profiles?.email}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">IP Adresa</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedLog.ip_address || "Není k dispozici"}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Zařízení</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedLog.device_info || "Není k dispozici"}
                </p>
              </div>
              {selectedLog.details && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Detaily změn</h4>
                  <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};