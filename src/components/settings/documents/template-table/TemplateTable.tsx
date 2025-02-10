
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TemplateTableRow } from "./TemplateTableRow";

interface Template {
  id: string;
  filename: string;
  file_type: string;
  file_url: string;
  upload_date: string;
  is_default: boolean;
}

interface TemplateTableProps {
  templates: Template[];
  onSetDefault: (id: string, isDefault: boolean) => void;
  onDelete: (id: string) => void;
}

export function TemplateTable({
  templates,
  onSetDefault,
  onDelete,
}: TemplateTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Název souboru</TableHead>
          <TableHead>Formát</TableHead>
          <TableHead>Datum nahrání</TableHead>
          <TableHead>Výchozí</TableHead>
          <TableHead className="text-right">Akce</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates?.map((template) => (
          <TemplateTableRow
            key={template.id}
            template={template}
            onSetDefault={onSetDefault}
            onDelete={onDelete}
          />
        ))}
        {templates?.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground"
            >
              Žádné šablony nebyly nahrány
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
