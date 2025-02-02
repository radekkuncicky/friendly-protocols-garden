import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLogoUpload = (settings: any) => {
  const { toast } = useToast();
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.company_logo) {
      setCurrentLogo(settings.company_logo);
    }
  }, [settings?.company_logo]);

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

  return { currentLogo, handleLogoUpload };
};