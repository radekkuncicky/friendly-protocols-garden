
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, GripVertical } from "lucide-react";
import { TemplateSelection } from "./TemplateSelection";
import { LogoBrandingSettings } from "./LogoBrandingSettings";
import { CompanyInfoSettings } from "./CompanyInfoSettings";
import { HeaderFooterSettings } from "./HeaderFooterSettings";
import { BodySettings } from "./BodySettings";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DocumentSettingsContentProps {
  settings: any;
  onUpdate: (values: any) => void;
  onReset: () => void;
  onSave: () => void;
}

export function DocumentSettingsContent({ 
  settings, 
  onUpdate,
  onReset,
  onSave 
}: DocumentSettingsContentProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="space-y-6 pr-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Nastavení dokumentu</h2>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Obnovit výchozí
            </Button>
            <Button
              size="sm"
              onClick={onSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Uložit změny
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Výběr šablony</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateSelection
              value={settings?.document_template_type}
              onChange={(value) => onUpdate({ document_template_type: value })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Logo a branding</CardTitle>
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
          </CardHeader>
          <CardContent>
            <LogoBrandingSettings
              settings={settings}
              onUpdate={onUpdate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informace o společnosti a klientovi</CardTitle>
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
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
    </ScrollArea>
  );
}
