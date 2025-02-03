import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ProtocolContent, ProtocolItem } from "@/types/protocol";

interface ProtocolItemsProps {
  content: ProtocolContent;
  setContent: (content: ProtocolContent) => void;
}

export const ProtocolItems = ({ content, setContent }: ProtocolItemsProps) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(content.items || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setContent({ ...content, items });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Položky</h3>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            const newItems = [...(content.items || []), { description: "", quantity: 1, unit: "ks" }];
            setContent({ ...content, items: newItems });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Přidat položku
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {(content.items || []).map((item: ProtocolItem, index: number) => (
                <Draggable key={index} draggableId={`item-${index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-white"
                    >
                      <div className="md:col-span-2">
                        <Label>Popis</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...(content.items || [])];
                            newItems[index].description = e.target.value;
                            setContent({ ...content, items: newItems });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Množství</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const newItems = [...(content.items || [])];
                            newItems[index].quantity = Number(e.target.value);
                            setContent({ ...content, items: newItems });
                          }}
                        />
                      </div>
                      <div>
                        <Label>Jednotka</Label>
                        <Input
                          value={item.unit}
                          onChange={(e) => {
                            const newItems = [...(content.items || [])];
                            newItems[index].unit = e.target.value;
                            setContent({ ...content, items: newItems });
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};