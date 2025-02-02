import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TemplateItem {
  name: string;
  quantity: string;
  unit: string;
}

interface TemplateItemsListProps {
  items: TemplateItem[];
  setItems: (items: TemplateItem[]) => void;
}

export const TemplateItemsList = ({ items, setItems }: TemplateItemsListProps) => {
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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="items">
        <AccordionTrigger className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <span>Položky</span>
            <span className="text-sm text-muted-foreground">({items.length})</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Přidat položku
          </Button>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};