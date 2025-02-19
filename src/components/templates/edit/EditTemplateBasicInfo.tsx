
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditTemplateBasicInfoProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

export const EditTemplateBasicInfo = ({
  name,
  setName,
  description,
  setDescription,
  category,
  setCategory
}: EditTemplateBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Název šablony</Label>
        <Input
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Zadejte název šablony"
        />
      </div>

      <div className="space-y-2">
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

      <div className="space-y-2">
        <Label htmlFor="description">Popis</Label>
        <Textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Zadejte popis šablony"
        />
      </div>
    </div>
  );
};
