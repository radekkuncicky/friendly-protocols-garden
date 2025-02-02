import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    protocols: 0,
    clients: 0,
    templates: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const [protocols, clients, templates] = await Promise.all([
        supabase.from("protocols").select("id", { count: "exact" }),
        supabase.from("clients").select("id", { count: "exact" }),
        supabase.from("templates").select("id", { count: "exact" }),
      ]);

      setCounts({
        protocols: protocols.count || 0,
        clients: clients.count || 0,
        templates: templates.count || 0,
      });
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Protokoly</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts.protocols}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Klienti</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts.clients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Šablony</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts.templates}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;