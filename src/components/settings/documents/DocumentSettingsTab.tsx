import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateManagementTable } from "./TemplateManagementTable";
import { TemplateUploadSection } from "./TemplateUploadSection";
import { setupInitialTemplates } from "@/lib/initialTemplates";

export function DocumentSettingsTab() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const setupTemplates = async () => {
      await setupInitialTemplates();
      queryClient.invalidateQueries({ queryKey: ['predefined-templates'] });
    };
    
    setupTemplates();
  }, [queryClient]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nastavení dokumentů</CardTitle>
          <CardDescription>
            Správa šablon dokumentů a jejich výchozích hodnot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="templates" className="space-y-4">
            <TabsList>
              <TabsTrigger value="templates">Šablony</TabsTrigger>
              {/* <TabsTrigger value="defaults">Výchozí hodnoty</TabsTrigger> */}
            </TabsList>

            <TabsContent value="templates" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Šablony dokumentů</h3>
                    <p className="text-sm text-gray-500">
                      Spravujte šablony dokumentů, které používáte pro generování protokolů.
                    </p>
                  </div>
                </div>
                <TemplateUploadSection />
                <TemplateManagementTable />
              </div>
            </TabsContent>

            {/* <TabsContent value="defaults" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h3 className="text-lg font-medium">Výchozí hodnoty</h3>
                  <p className="text-sm text-gray-500">
                    Nastavte výchozí hodnoty pro nové šablony
                  </p>
                </div>
              </div>
            </TabsContent> */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
