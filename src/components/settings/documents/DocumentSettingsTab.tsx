import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateSelection } from "./TemplateSelection";
import { LogoBrandingSettings } from "./LogoBrandingSettings";
import { CompanyInfoSettings } from "./CompanyInfoSettings";
import { HeaderFooterSettings } from "./HeaderFooterSettings";
import { BodySettings } from "./BodySettings";
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="template" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="template" className="flex-1">Šablona</TabsTrigger>
              <TabsTrigger value="logo" className="flex-1">Logo</TabsTrigger>
              <TabsTrigger value="company" className="flex-1">Informace</TabsTrigger>
              <TabsTrigger value="layout" className="flex-1">Rozvržení</TabsTrigger>
            </TabsList>

            <TabsContent value="template">
              <Card>
                <CardHeader>
                  <CardTitle>Výběr šablony</CardTitle>
                </CardHeader>
                <CardContent>
                  <TemplateSelection
                    value={settings?.document_template_type}
                    onChange={(value) =>
                      updateMutation.mutate({ document_template_type: value })
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logo">
              <Card>
                <CardHeader>
                  <CardTitle>Logo a branding</CardTitle>
                </CardHeader>
                <CardContent>
                  <LogoBrandingSettings
                    settings={settings}
                    onUpdate={(values) => updateMutation.mutate(values)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Informace o společnosti a klientovi</CardTitle>
                </CardHeader>
                <CardContent>
                  <CompanyInfoSettings
                    settings={settings}
                    onUpdate={(values) => updateMutation.mutate(values)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout">
              <Card>
                <CardHeader>
                  <CardTitle>Rozvržení dokumentu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <HeaderFooterSettings
                    settings={settings}
                    onUpdate={(values) => updateMutation.mutate(values)}
                  />
                  <BodySettings
                    settings={settings}
                    onUpdate={(values) => updateMutation.mutate(values)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle>Náhled dokumentu</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentPreview settings={settings} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}