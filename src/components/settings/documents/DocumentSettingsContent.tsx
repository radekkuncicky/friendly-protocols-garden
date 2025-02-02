import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateSelection } from "./TemplateSelection";
import { LogoBrandingSettings } from "./LogoBrandingSettings";
import { CompanyInfoSettings } from "./CompanyInfoSettings";
import { HeaderFooterSettings } from "./HeaderFooterSettings";
import { BodySettings } from "./BodySettings";

interface DocumentSettingsContentProps {
  settings: any;
  onUpdate: (values: any) => void;
}

export function DocumentSettingsContent({ settings, onUpdate }: DocumentSettingsContentProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Výběr šablony</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateSelection
            value={settings?.document_template_type}
            onChange={(value) =>
              onUpdate({ document_template_type: value })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logo a branding</CardTitle>
        </CardHeader>
        <CardContent>
          <LogoBrandingSettings
            settings={settings}
            onUpdate={onUpdate}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informace o společnosti a klientovi</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyInfoSettings
            settings={settings}
            onUpdate={onUpdate}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rozvržení dokumentu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <HeaderFooterSettings
            settings={settings}
            onUpdate={onUpdate}
          />
          <BodySettings
            settings={settings}
            onUpdate={onUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
}