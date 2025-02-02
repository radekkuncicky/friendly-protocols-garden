import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyInfoForm, type CompanyInfoFormValues } from "@/components/settings/CompanyInfoForm";
import { LogoUpload } from "@/components/settings/LogoUpload";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data?.role;
    },
  });

  useEffect(() => {
    if (userRole && userRole !== "admin") {
      navigate("/");
      toast({
        title: "Přístup odepřen",
        description: "Pouze administrátoři mají přístup k nastavení.",
        variant: "destructive",
      });
    }
  }, [userRole, navigate, toast]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('settings')
        .update({ company_logo: publicUrl })
        .eq('id', settings?.id)
        .single();

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['settings'] });

      toast({
        title: "Logo nahráno",
        description: "Logo společnosti bylo úspěšně aktualizováno.",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Chyba při nahrávání",
        description: "Nepodařilo se nahrát logo. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (values: CompanyInfoFormValues) => {
      if (!settings?.id) throw new Error("No settings record found");
      
      const { data, error } = await supabase
        .from("settings")
        .update(values)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Nastavení</h1>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company">Firemní údaje</TabsTrigger>
          <TabsTrigger value="users">Uživatelé a role</TabsTrigger>
          <TabsTrigger value="appearance">Vzhled</TabsTrigger>
          <TabsTrigger value="documents">Dokumenty</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Firemní údaje</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyInfoForm
                defaultValues={settings}
                onSubmit={updateMutation.mutate}
                isSubmitting={updateMutation.isPending}
              />
              <LogoUpload
                currentLogo={settings?.company_logo}
                onUpload={handleLogoUpload}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Uživatelé a role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Správa uživatelů a rolí bude implementována v další fázi.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Vzhled aplikace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nastavení vzhledu bude implementováno v další fázi.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Nastavení dokumentů</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nastavení dokumentů bude implementováno v další fázi.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;