import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DocumentSettingsContent } from "./DocumentSettingsContent";
import { DocumentPreview } from "./DocumentPreview";

export function DocumentSettingsTab() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from("settings")
        .update(values)
        .eq("id", settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Nastavení uloženo",
        description: "Změny byly úspěšně uloženy.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit změny: " + error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Načítání...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <DocumentSettingsContent 
        settings={settings} 
        onUpdate={(values) => updateMutation.mutate(values)} 
      />
      <div className="sticky top-6">
        <DocumentPreview settings={settings} />
      </div>
    </div>
  );
}