import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type CompanyInfoFormValues } from "@/components/settings/CompanyInfoForm";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);

  const { data: settings } = useQuery({
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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !settings?.id) return;

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('settings')
        .update({ company_logo: publicUrl })
        .eq('id', settings.id);

      if (updateError) throw updateError;

      setCurrentLogo(publicUrl);
      toast({
        title: "Logo nahráno",
        description: "Logo bylo úspěšně nahráno.",
      });
    } catch (error: any) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se nahrát logo: " + error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (settings?.company_logo) {
      setCurrentLogo(settings.company_logo);
    }
  }, [settings?.company_logo]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Nastavení</h1>
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