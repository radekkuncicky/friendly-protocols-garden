import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyInfoForm, type CompanyInfoFormValues } from "@/components/settings/CompanyInfoForm";
import { LogoUpload } from "@/components/settings/LogoUpload";
import { UserRolesTab } from "@/components/settings/users/UserRolesTab";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
              <CompanyInfoForm />
              <LogoUpload />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserRolesTab />
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