import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Template } from "@/types/template";

interface TemplateStatusBadgeProps {
  template: Template;
  canChangeStatus: boolean;
  onStatusChange?: (template: Template, newStatus: 'draft' | 'published') => void;
}

export const TemplateStatusBadge = ({
  template,
  canChangeStatus,
  onStatusChange,
}: TemplateStatusBadgeProps) => {
  return (
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
  );
};