
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type CompanyInfoFormValues } from "@/components/settings/CompanyInfoForm";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { useSettingsData } from "@/hooks/useSettingsData";
import { useLogoUpload } from "@/hooks/useLogoUpload";

const Settings = () => {
  const { toast } = useToast();
  const { settings, isLoading } = useSettingsData();
  const { currentLogo, handleLogoUpload } = useLogoUpload(settings);

  const updateMutation = useMutation({
    mutationFn: async (values: CompanyInfoFormValues) => {
      if (!settings?.id) return;
      
      const { error } = await supabase
        .from("settings")
        .update(values)
        .eq('id', settings.id);

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
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-10">Nastavení</h1>
      <SettingsTabs
        settings={settings}
        currentLogo={currentLogo}
        onLogoUpload={handleLogoUpload}
        onCompanyInfoSubmit={(values) => updateMutation.mutate(values)}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
};

export default Settings;

