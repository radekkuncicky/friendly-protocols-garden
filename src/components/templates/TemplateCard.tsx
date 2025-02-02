import { Lock, Unlock, Edit, Eye, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Template {
  id: string;
  name: string;
  content: any;
  category?: string;
  is_locked?: boolean;
  created_at: string;
}

interface TemplateCardProps {
  template: Template;
  userRole: string | null;
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onToggleLock: (template: Template) => void;
  onDelete: (template: Template) => void;
}

export const TemplateCard = ({
  template,
  userRole,
  onPreview,
  onEdit,
  onDuplicate,
  onToggleLock,
  onDelete,
}: TemplateCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription>
              Vytvořeno: {new Date(template.created_at).toLocaleDateString("cs-CZ")}
            </CardDescription>
          </div>
          {template.is_locked && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Uzamčeno
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {template.content.description || "Bez popisu"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPreview(template)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {(userRole === "admin" ||
            (userRole === "manager" && !template.is_locked)) && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(template)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {(userRole === "admin" || userRole === "manager") && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDuplicate(template)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
        </div>
        {userRole === "admin" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onToggleLock(template)}
            >
              {template.is_locked ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(template)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};