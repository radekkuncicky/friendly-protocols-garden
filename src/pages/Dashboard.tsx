
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, FileText, CheckCircle, Send, FileCode2, Calendar } from "lucide-react";
import { differenceInDays, format, startOfMonth, subMonths } from "date-fns";
import { cs } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("30");
  const [stats, setStats] = useState({
    protocols: { total: 0, signed: 0, sent: 0, draft: 0 },
    clients: { total: 0, recent: 0 },
    templates: { total: 0, mostUsed: null as { name: string; usage_count: number } | null },
    monthlyProtocols: [] as { month: string; count: number }[],
    recentActivity: [] as any[]
  });

  useEffect(() => {
    const fetchStats = async () => {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - parseInt(timeRange));

      // Fetch various statistics
      const [
        protocolStats,
        clientStats,
        templateStats,
        monthlyData,
        recentActivity
      ] = await Promise.all([
        // Protocol statistics
        supabase.from("protocols")
        .select("status")
        .gte('created_at', fromDate.toISOString()),
        
        // Client statistics
        supabase.from("clients")
        .select("id, created_at"),
        
        // Template statistics with usage count
        supabase.from("templates")
        .select("name, usage_count")
        .order("usage_count", { ascending: false })
        .limit(1),
        
        // Monthly protocol creation data
        supabase.from("protocols")
        .select("created_at")
        .gte('created_at', subMonths(new Date(), 6).toISOString()),
        
        // Recent activity
        supabase.from("protocols")
        .select(`
          id,
          status,
          created_at,
          clients (
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5)
      ]);

      // Process protocol statistics
      const protocols = protocolStats.data || [];
      const signed = protocols.filter(p => p.status === "signed").length;
      const sent = protocols.filter(p => p.status === "sent").length;
      const draft = protocols.filter(p => p.status === "draft").length;

      // Process client statistics
      const clients = clientStats.data || [];
      const recentClients = clients.filter(
        c => differenceInDays(new Date(), new Date(c.created_at)) <= parseInt(timeRange)
      ).length;

      // Process monthly data
      const monthlyProtocols = Array.from({ length: 6 }, (_, i) => {
        const month = subMonths(new Date(), i);
        const monthStart = startOfMonth(month);
        const count = (monthlyData.data || []).filter(p => 
          new Date(p.created_at) >= monthStart &&
          new Date(p.created_at) < startOfMonth(subMonths(month, -1))
        ).length;
        return {
          month: format(month, "LLLL", { locale: cs }),
          count
        };
      }).reverse();

      setStats({
        protocols: {
          total: protocols.length,
          signed,
          sent,
          draft
        },
        clients: {
          total: clients.length,
          recent: recentClients
        },
        templates: {
          total: (templateStats.data || []).length,
          mostUsed: templateStats.data?.[0] || null
        },
        monthlyProtocols,
        recentActivity: recentActivity.data || []
      });
    };

    fetchStats();
  }, [timeRange]);

  // Colors for pie chart
  const COLORS = ['#10B981', '#3B82F6', '#6B7280'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Nástěnka</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Vyberte období" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Posledních 7 dní</SelectItem>
            <SelectItem value="30">Posledních 30 dní</SelectItem>
            <SelectItem value="90">Posledních 90 dní</SelectItem>
            <SelectItem value="365">Poslední rok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkem protokolů</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.protocols.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Podepsané protokoly</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.protocols.signed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Odeslané protokoly</CardTitle>
            <Send className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.protocols.sent}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klienti</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clients.total}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.clients.recent} nových za vybrané období
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Protokoly za měsíc</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyProtocols}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>Rozdělení protokolů</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Podepsané', value: stats.protocols.signed },
                    { name: 'Odeslané', value: stats.protocols.sent },
                    { name: 'Rozpracované', value: stats.protocols.draft }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Nedávná aktivita</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-blue-100">
                  <FileText className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Protokol pro klienta {activity.clients?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), "d. MMMM yyyy", { locale: cs })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
