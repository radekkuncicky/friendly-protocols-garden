
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";

interface TemplateItem {
  name: string;
  quantity: string;
  unit: string;
}

interface EditTemplateItemsProps {
  items: TemplateItem[];
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, field: keyof TemplateItem, value: string) => void;
}

export const EditTemplateItems = ({
  items,
  addItem,
  removeItem,
  updateItem
}: EditTemplateItemsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="items">
        <AccordionTrigger className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <span>Položky</span>
            <span className="text-sm text-muted-foreground">({items.length})</span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            addItem();
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Přidat položku
          </Button>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-2">
            {items.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <Label>Název</Label>
                </div>
                <div>
                  <Label>Množství</Label>
                </div>
                <div>
                  <Label>Jednotka</Label>
                </div>
              </div>
            )}
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2">
                <Input 
                  value={item.name} 
                  onChange={e => updateItem(index, "name", e.target.value)} 
                  placeholder="Název položky" 
                />
                <Input 
                  type="number" 
                  value={item.quantity} 
                  onChange={e => updateItem(index, "quantity", e.target.value)} 
                  placeholder="Množství" 
                />
                <Select 
                  value={item.unit} 
                  onValueChange={value => updateItem(index, "unit", value)}
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
