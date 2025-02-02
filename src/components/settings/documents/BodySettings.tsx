import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BodySettingsProps {
  settings: any;
  onUpdate: (values: any) => void;
}

export function BodySettings({ settings, onUpdate }: BodySettingsProps) {
  const bodyConfig = settings?.document_body_config || {};

  const updateBodyConfig = (key: string, value: string) => {
    onUpdate({
      document_body_config: {
        ...bodyConfig,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Rozvržení obsahu</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Rozvržení sloupců</Label>
            <Select
              value={bodyConfig.layout}
              onValueChange={(value) => updateBodyConfig("layout", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte rozvržení" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-column">Jeden sloupec</SelectItem>
                <SelectItem value="two-columns">Dva sloupce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Řádkování</Label>
            <Select
              value={bodyConfig.line_spacing}
              onValueChange={(value) => updateBodyConfig("line_spacing", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte řádkování" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Kompaktní</SelectItem>
                <SelectItem value="normal">Normální</SelectItem>
                <SelectItem value="relaxed">Volné</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Velikost písma</Label>
            <Select
              value={bodyConfig.font_size}
              onValueChange={(value) => updateBodyConfig("font_size", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte velikost písma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Malé</SelectItem>
                <SelectItem value="medium">Střední</SelectItem>
                <SelectItem value="large">Velké</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}