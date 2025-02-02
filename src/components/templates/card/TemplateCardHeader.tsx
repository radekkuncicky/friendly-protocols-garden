import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Template } from "@/types/template";
import { TemplateStatusBadge } from "./TemplateStatusBadge";

interface TemplateCardHeaderProps {
  template: Template;
  canChangeStatus: boolean;
  onStatusChange?: (template: Template, newStatus: 'draft' | 'published') => void;
}

export const TemplateCardHeader = ({
  template,
  canChangeStatus,
  onStatusChange,
}: TemplateCardHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription>
          Vytvořeno: {new Date(template.created_at).toLocaleDateString("cs-CZ")}
        </CardDescription>
      </div>
      <div className="flex gap-2">
        {template.is_locked && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Uzamčeno
          </Badge>
        )}
        <TemplateStatusBadge
          template={template}
          canChangeStatus={canChangeStatus}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
};