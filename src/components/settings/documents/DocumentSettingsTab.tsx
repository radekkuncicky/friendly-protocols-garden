
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DocumentSettingsContent } from "./DocumentSettingsContent";
import { DocumentPreview } from "./DocumentPreview";
import { useState } from "react";

export function DocumentSettingsTab() {
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<any>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

      if (error) throw error;
      setLocalSettings(data);
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

  const handleUpdate = (values: any) => {
    setLocalSettings((prev: any) => ({ ...prev, ...values }));
  };

  const handleSave = () => {
    if (localSettings) {
      updateMutation.mutate(localSettings);
    }
  };

  const handleReset = () => {
    setLocalSettings(settings);
    toast({
      title: "Nastavení obnoveno",
      description: "Všechny změny byly vráceny do výchozího stavu.",
    });
  };

  const handleDragEnd = (result: any) => {
    // Implement drag end logic here
    console.log("Drag ended:", result);
  };

  if (isLoading) {
    return <div>Načítání...</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <DocumentSettingsContent 
        settings={localSettings} 
        onUpdate={handleUpdate}
        onSave={handleSave}
        onReset={handleReset}
      />
      <DocumentPreview 
        settings={localSettings}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
}
