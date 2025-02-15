
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileCheck, FileX } from "lucide-react";

interface PredefinedTemplate {
  id: string;
  name: string;
  file_path: string;
  type: 'standard' | 'classic' | 'minimalist';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function TemplateManagementTable() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["predefined-templates"],
    queryFn: async () => {
      console.log("Fetching predefined templates");
      const { data, error } = await supabase
        .from("predefined_templates")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching templates:", error);
        throw error;
      }
      console.log("Templates fetched:", data);
      return data as PredefinedTemplate[];
    },
  });

  if (isLoading) {
    return <div>Načítání šablon...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Název šablony</TableHead>
          <TableHead>Typ</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Dostupnost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates?.map((template) => (
          <TableRow key={template.id}>
            <TableCell className="font-medium">{template.name}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {template.type === 'standard' ? 'Standardní' :
                 template.type === 'classic' ? 'Klasická' : 
                 'Minimalistická'}
              </Badge>
            </TableCell>
            <TableCell>
              {template.is_active ? (
                <Badge className="bg-green-500">
                  <FileCheck className="mr-1 h-3 w-3" />
                  Aktivní
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <FileX className="mr-1 h-3 w-3" />
                  Neaktivní
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {template.file_path ? (
                <Badge variant="outline" className="text-green-600">
                  <FileCheck className="mr-1 h-3 w-3" />
                  Šablona připravena
                </Badge>
              ) : (
                <Badge variant="outline" className="text-yellow-600">
                  <FileX className="mr-1 h-3 w-3" />
                  Čeká na nahrání
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
