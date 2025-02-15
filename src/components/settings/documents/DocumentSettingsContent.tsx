
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import { TemplateSelection } from "./TemplateSelection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TemplateManagementTable } from "./TemplateManagementTable";

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
          <CardHeader>
            <CardTitle>Předdefinované šablony</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateManagementTable />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
