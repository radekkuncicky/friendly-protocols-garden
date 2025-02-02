import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClientStatusSelectProps {
  client: {
    id: string;
    status: string;
  };
}

export const ClientStatusSelect = ({ client }: ClientStatusSelectProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async (status: string) => {
      const { data, error } = await supabase
        .from("clients")
        .update({ status })
        .eq("id", client.id)
        .select()
        .single();

      if (error) throw error;

      // Log the status change
      await supabase.from("client_activity_logs").insert({
        client_id: client.id,
        action_type: "status_change",
        description: `Status klienta byl změněn na ${
          status === "active" ? "aktivní" : "neaktivní"
        }`,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", client.id] });
      queryClient.invalidateQueries({
        queryKey: ["client-activities", client.id],
      });
      toast({
        title: "Status aktualizován",
        description: "Status klienta byl úspěšně změněn.",
      });
    },
    onError: () => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se změnit status klienta.",
        variant: "destructive",
      });
    },
  });

  return (
    <Select
      defaultValue={client.status}
      onValueChange={(value) => updateStatus.mutate(value)}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">Aktivní</SelectItem>
        <SelectItem value="inactive">Neaktivní</SelectItem>
      </SelectContent>
    </Select>
  );
};