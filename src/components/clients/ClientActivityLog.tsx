import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface ClientActivityLogProps {
  clientId: string;
}

export const ClientActivityLog = ({ clientId }: ClientActivityLogProps) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["client-activities", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_activity_logs")
        .select(`
          *,
          profiles!client_activity_logs_user_id_fkey(full_name)
        `)
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Načítání...</div>;
  }

  if (!activities?.length) {
    return (
      <div className="text-sm text-muted-foreground">
        Zatím zde není žádná aktivita
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-4 rounded-lg border p-4"
        >
          <div className="flex-1">
            <p className="text-sm">{activity.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {activity.profiles?.full_name} •{" "}
              {format(new Date(activity.created_at || ''), "Pp", { locale: cs })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};