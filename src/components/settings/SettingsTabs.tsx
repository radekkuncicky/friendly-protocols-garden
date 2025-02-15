
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyInfoForm } from "./CompanyInfoForm";
import type { CompanyFormValues } from "@/types/company";
import { LogoUpload } from "./LogoUpload";
import { UserRolesTab } from "./users/UserRolesTab";
import { DocumentSettingsTab } from "./documents/DocumentSettingsTab";

interface SettingsTabsProps {
  settings: any;
  currentLogo: string | null;
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyInfoSubmit: (values: CompanyFormValues) => void;
  isSubmitting: boolean;
}

export function SettingsTabs({
  settings,
  currentLogo,
  onLogoUpload,
  onCompanyInfoSubmit,
  isSubmitting,
}: SettingsTabsProps) {
  return (
    <Tabs defaultValue="company" className="space-y-6">
      <TabsList>
        <TabsTrigger value="company">Firemní údaje</TabsTrigger>
        <TabsTrigger value="users">Uživatelé a role</TabsTrigger>
        <TabsTrigger value="documents">Nastavení dokumentů</TabsTrigger>
      </TabsList>

      <TabsContent value="company">
        <Card>
          <CardHeader>
            <CardTitle>Firemní údaje</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyInfoForm 
              defaultValues={settings}
              onSubmit={onCompanyInfoSubmit}
              isSubmitting={isSubmitting}
            />
            <LogoUpload 
              currentLogo={currentLogo}
              onUpload={onLogoUpload}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <UserRolesTab />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentSettingsTab />
      </TabsContent>
    </Tabs>
  );
}
