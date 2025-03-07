
import { Lock, Unlock, Edit, Copy, Trash2, FileText } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Template {
  id: string;
  name: string;
  content: any;
  category?: string;
  is_locked?: boolean;
  status: 'draft' | 'published';
  signature_required: boolean;
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant={template.status === 'published' ? "default" : "secondary"}
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      if (canChangeStatus && onStatusChange) {
                        onStatusChange(
                          template, 
                          template.status === 'published' ? 'draft' : 'published'
                        );
                      }
                    }}
                  >
                    <FileText className="h-3 w-3" />
                    {template.status === 'published' ? 'Publikováno' : 'Koncept'}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {canChangeStatus 
                    ? 'Kliknutím změníte stav šablony'
                    : 'Nemáte oprávnění měnit stav šablony'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
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
      <CardFooter className="flex justify-between mt-auto">
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onPreview(template)}
            className="bg-amber-500 hover:bg-amber-400 text-gray-950"
          >
            Vybrat šablonu
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
