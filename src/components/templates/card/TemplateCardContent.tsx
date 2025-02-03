import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Template } from "@/types/template";

interface TemplateCardContentProps {
  template: Template;
}

export const TemplateCardContent = ({ template }: TemplateCardContentProps) => {
  return (
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
  );
};