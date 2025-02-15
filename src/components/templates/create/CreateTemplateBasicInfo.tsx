
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTemplateBasicInfoProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  signatureRequired: boolean;
  setSignatureRequired: (required: boolean) => void;
}

export const CreateTemplateBasicInfo = ({
  name,
  setName,
  description,
  setDescription,
  category,
  setCategory,
  signatureRequired,
  setSignatureRequired,
}: CreateTemplateBasicInfoProps) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Název šablony</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Zadejte název šablony"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Kategorie</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte kategorii" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Obecné">Obecné</SelectItem>
              <SelectItem value="Stavební">Stavební</SelectItem>
              <SelectItem value="Údržba">Údržba</SelectItem>
              <SelectItem value="Kontrola">Kontrola</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="description">Popis</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Zadejte popis šablony"
        />
      </div>

      <div className="flex items-center space-x-2 py-1">
        <Switch
          id="signature-required"
          checked={signatureRequired}
          onCheckedChange={setSignatureRequired}
        />
        <Label htmlFor="signature-required">Vyžadovat podpis</Label>
      </div>
    </div>
  );
};
