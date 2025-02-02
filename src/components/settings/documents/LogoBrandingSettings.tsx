import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LogoBrandingSettingsProps {
  settings: any;
  onUpdate: (values: any) => void;
}

export function LogoBrandingSettings({ settings, onUpdate }: LogoBrandingSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pozice loga</Label>
        <Select
          value={settings?.document_logo_position}
          onValueChange={(value) => onUpdate({ document_logo_position: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Vyberte pozici loga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top-left">Vlevo nahoře</SelectItem>
            <SelectItem value="top-center">Uprostřed nahoře</SelectItem>
            <SelectItem value="top-right">Vpravo nahoře</SelectItem>
            <SelectItem value="footer">V patičce</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}