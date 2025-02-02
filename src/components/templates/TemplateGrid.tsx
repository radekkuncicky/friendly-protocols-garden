import { Template } from "@/types/template";
import { TemplateCard } from "./TemplateCard";

interface TemplateGridProps {
  templates: Template[];
  userRole: string | null;
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onToggleLock: (template: Template) => void;
  onDelete: (template: Template) => void;
  onStatusChange: (template: Template, newStatus: 'draft' | 'published') => void;
}

export const TemplateGrid = ({
  templates,
  userRole,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleLock,
  onDelete,
  onStatusChange,
}: TemplateGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          userRole={userRole}
          onPreview={() => onPreview(template)}
          onEdit={() => onEdit(template)}
          onDuplicate={() => onDuplicate(template)}
          onToggleLock={() => onToggleLock(template)}
          onDelete={() => onDelete(template)}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};