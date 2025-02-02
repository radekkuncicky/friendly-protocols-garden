import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface HeaderFooterSettingsProps {
  settings: any;
  onUpdate: (values: any) => void;
}

export function HeaderFooterSettings({ settings, onUpdate }: HeaderFooterSettingsProps) {
  const headerConfig = settings?.document_header_config || {};
  const footerConfig = settings?.document_footer_config || {};

  const updateHeaderConfig = (key: string, value: boolean) => {
    onUpdate({
      document_header_config: {
        ...headerConfig,
        [key]: value,
      },
    });
  };

  const updateFooterConfig = (key: string, value: boolean) => {
    onUpdate({
      document_footer_config: {
        ...footerConfig,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Hlavička</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-logo">Zobrazit logo</Label>
            <Switch
              id="show-logo"
              checked={headerConfig.show_logo}
              onCheckedChange={(checked) => updateHeaderConfig("show_logo", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-page-numbers">Zobrazit čísla stránek</Label>
            <Switch
              id="show-page-numbers"
              checked={headerConfig.show_page_numbers}
              onCheckedChange={(checked) => updateHeaderConfig("show_page_numbers", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-title">Zobrazit název dokumentu</Label>
            <Switch
              id="show-title"
              checked={headerConfig.show_title}
              onCheckedChange={(checked) => updateHeaderConfig("show_title", checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Patička</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-contact">Zobrazit kontaktní údaje</Label>
            <Switch
              id="show-contact"
              checked={footerConfig.show_contact}
              onCheckedChange={(checked) => updateFooterConfig("show_contact", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-disclaimer">Zobrazit právní doložku</Label>
            <Switch
              id="show-disclaimer"
              checked={footerConfig.show_disclaimer}
              onCheckedChange={(checked) => updateFooterConfig("show_disclaimer", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-version">Zobrazit verzi dokumentu</Label>
            <Switch
              id="show-version"
              checked={footerConfig.show_version}
              onCheckedChange={(checked) => updateFooterConfig("show_version", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}