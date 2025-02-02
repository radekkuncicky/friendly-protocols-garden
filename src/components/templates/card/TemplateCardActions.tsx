import { Eye, Edit, Copy, Lock, Unlock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Template } from "@/types/template";

interface TemplateCardActionsProps {
  template: Template;
  userRole: string | null;
  onPreview: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
}

export const TemplateCardActions = ({
  template,
  userRole,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleLock,
  onDelete,
}: TemplateCardActionsProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={onPreview}>
          <Eye className="h-4 w-4" />
        </Button>
        {(userRole === "admin" ||
          (userRole === "manager" && !template.is_locked)) && (
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {(userRole === "admin" || userRole === "manager") && (
          <Button variant="outline" size="icon" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
      {userRole === "admin" && (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onToggleLock}>
            {template.is_locked ? (
              <Unlock className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </Button>
          <Button variant="destructive" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};