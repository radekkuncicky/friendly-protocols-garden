import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CompanyInfoSettingsProps {
  settings: any;
  onUpdate: (values: any) => void;
}

export function CompanyInfoSettings({ settings, onUpdate }: CompanyInfoSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Pozice informací o společnosti</Label>
        <Select
          value={settings?.document_company_info_position}
          onValueChange={(value) => onUpdate({ document_company_info_position: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Vyberte pozici informací o společnosti" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="header">V hlavičce</SelectItem>
            <SelectItem value="left">Vlevo</SelectItem>
            <SelectItem value="right">Vpravo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Pozice informací o klientovi</Label>
        <Select
          value={settings?.document_client_info_position}
          onValueChange={(value) => onUpdate({ document_client_info_position: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Vyberte pozici informací o klientovi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="below-company">Pod informacemi o společnosti</SelectItem>
            <SelectItem value="body">V těle dokumentu</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}