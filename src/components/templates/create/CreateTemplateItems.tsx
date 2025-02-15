
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateItem {
  name: string;
  quantity: string;
  unit: string;
}

interface CreateTemplateItemsProps {
  items: TemplateItem[];
  setItems: (items: TemplateItem[]) => void;
}

export const CreateTemplateItems = ({ items, setItems }: CreateTemplateItemsProps) => {
  const addItem = () => {
    setItems([...items, { name: "", quantity: "", unit: "ks" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof TemplateItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label>Položky</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" />
          Přidat položku
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-4 gap-2 items-end">
          <div className="space-y-1.5">
            <Label>Název</Label>
            <Input
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              placeholder="Název položky"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Množství</Label>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(index, "quantity", e.target.value)}
              placeholder="Množství"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Jednotka</Label>
            <Select
              value={item.unit}
              onValueChange={(value) => updateItem(index, "unit", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ks">ks</SelectItem>
                <SelectItem value="m">m</SelectItem>
                <SelectItem value="g">g</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="h-10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
