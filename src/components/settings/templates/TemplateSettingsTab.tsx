
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemTemplateSettings } from "./SystemTemplateSettings";
import { Separator } from "@/components/ui/separator";

export function TemplateSettingsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Styly dokumentů</CardTitle>
          <CardDescription>
            Správa systémových šablon a jejich výchozích hodnot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SystemTemplateSettings />
          <Separator className="my-6" />
          {/* Add other template settings components here */}
        </CardContent>
      </Card>
    </div>
  );
}
