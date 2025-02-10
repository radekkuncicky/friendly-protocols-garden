
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Template {
  id: string;
  filename: string;
  file_type: string;
  file_url: string;
  upload_date: string;
  is_default: boolean;
}

interface TemplateTableRowProps {
  template: Template;
  onSetDefault: (id: string, isDefault: boolean) => void;
  onDelete: (id: string) => void;
}

export function TemplateTableRow({
  template,
  onSetDefault,
  onDelete,
}: TemplateTableRowProps) {
  return (
    <TableRow key={template.id}>
      <TableCell>{template.filename}</TableCell>
      <TableCell>{template.file_type}</TableCell>
      <TableCell>
        {new Date(template.upload_date).toLocaleDateString("cs-CZ")}
      </TableCell>
      <TableCell>
        <Checkbox
          checked={template.is_default}
          onCheckedChange={(checked) => {
            onSetDefault(template.id, checked === true);
          }}
        />
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(template.file_url, "_blank")}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(template.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
