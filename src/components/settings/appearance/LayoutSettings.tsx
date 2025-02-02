import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export const LayoutSettings = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>Pozice postranního panelu</Label>
        <RadioGroup defaultValue="left" className="grid gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="left" />
            <Label htmlFor="left">Vlevo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="right" />
            <Label htmlFor="right">Vpravo</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>Styl tlačítek</Label>
        <RadioGroup defaultValue="rounded" className="grid gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rounded" id="rounded" />
            <Label htmlFor="rounded">Zaoblené</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="square" id="square" />
            <Label htmlFor="square">Hranaté</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="elevated" id="elevated" />
            <Label htmlFor="elevated">S vyvýšením</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="animations">Animace</Label>
        <Switch id="animations" defaultChecked />
      </div>
    </div>
  );
};