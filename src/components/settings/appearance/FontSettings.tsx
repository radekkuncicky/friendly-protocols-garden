import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const FontSettings = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>Velikost písma</Label>
        <Select defaultValue="medium">
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

      <div className="space-y-4">
        <Label>Hustota rozhraní</Label>
        <RadioGroup defaultValue="standard" className="grid gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="compact" />
            <Label htmlFor="compact">Kompaktní</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard">Standardní</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="comfortable" />
            <Label htmlFor="comfortable">Prostorné</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};