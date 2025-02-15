import { CompanyTab } from "@/components/settings/CompanyTab";
import { UserRolesTab } from "@/components/settings/UserRolesTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentSettingsTab } from "@/components/settings/documents/DocumentSettingsTab";
import { TemplateSettingsTab } from "@/components/settings/templates/TemplateSettingsTab";

export default function Settings() {
  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Nastavení</h1>
          <p className="text-gray-500">
            Správa nastavení aplikace a uživatelských účtů
          </p>
        </div>

        <Tabs defaultValue="company" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="company">Firma</TabsTrigger>
            <TabsTrigger value="documents">Dokumenty</TabsTrigger>
            <TabsTrigger value="templates">Šablony</TabsTrigger>
            <TabsTrigger value="users">Uživatelé</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <CompanyTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentSettingsTab />
          </TabsContent>

          <TabsContent value="templates">
            <TemplateSettingsTab />
          </TabsContent>

          <TabsContent value="users">
            <UserRolesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
