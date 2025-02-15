import { Template } from "@/types/template";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateGrid } from "./TemplateGrid";

interface TemplateTabsProps {
  categories: string[];
  templates: Template[];
  userRole: string | null;
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onToggleLock: (template: Template) => void;
  onDelete: (template: Template) => void;
  onStatusChange: (template: Template, newStatus: 'draft' | 'published') => void;
}

export const TemplateTabs = ({
  categories,
  templates,
  userRole,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleLock,
  onDelete,
  onStatusChange,
}: TemplateTabsProps) => {
  return (
    <Tabs defaultValue={categories[0]} className="w-full">
      <ScrollArea className="w-full">
        <TabsList className="w-full justify-start">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>

      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <TemplateGrid
            templates={templates.filter((t) => (t.category || "Obecné") === category)}
            userRole={userRole}
            onPreview={onPreview}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onToggleLock={onToggleLock}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};