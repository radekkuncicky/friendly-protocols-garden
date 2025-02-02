import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Template } from "@/types/template";
import { TemplateCardHeader } from "./TemplateCardHeader";
import { TemplateCardActions } from "./TemplateCardActions";

interface TemplateCardProps {
  template: Template;
  userRole: string | null;
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onToggleLock: (template: Template) => void;
  onDelete: (template: Template) => void;
  onStatusChange?: (template: Template, newStatus: 'draft' | 'published') => void;
}

export const TemplateCard = ({
  template,
  userRole,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleLock,
  onDelete,
  onStatusChange,
}: TemplateCardProps) => {
  const canChangeStatus = userRole === 'admin' || userRole === 'manager';

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <TemplateCardHeader
          template={template}
          canChangeStatus={canChangeStatus}
          onStatusChange={onStatusChange}
        />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {template.content.description || "Bez popisu"}
        </p>
        {template.signature_required && (
          <Badge variant="outline" className="mt-2">
            Vyžaduje podpis
          </Badge>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <TemplateCardActions
          template={template}
          userRole={userRole}
          onPreview={() => onPreview(template)}
          onEdit={() => onEdit(template)}
          onDuplicate={() => onDuplicate(template)}
          onToggleLock={() => onToggleLock(template)}
          onDelete={() => onDelete(template)}
        />
      </CardFooter>
    </Card>
  );
};