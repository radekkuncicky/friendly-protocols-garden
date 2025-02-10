
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  filename: string;
  file_type: string;
  file_url: string;
  upload_date: string;
}

export function TemplateManagementTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings_templates")
        .select("*")
        .order("upload_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const template = templates?.find((t) => t.id === id);
      if (!template) return;

      // Delete file from storage
      const filePath = new URL(template.file_url).pathname.split("/").pop();
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("document-templates")
          .remove([filePath]);
        if (storageError) throw storageError;
      }

      // Delete record from database
      const { error: dbError } = await supabase
        .from("settings_templates")
        .delete()
        .eq("id", id);
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona odstraněna",
        description: "Šablona byla úspěšně odstraněna.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se odstranit šablonu: " + error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Načítání...</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Název souboru</TableHead>
            <TableHead>Formát</TableHead>
            <TableHead>Datum nahrání</TableHead>
            <TableHead className="text-right">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates?.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.filename}</TableCell>
              <TableCell>{template.file_type}</TableCell>
              <TableCell>
                {new Date(template.upload_date).toLocaleDateString("cs-CZ")}
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
                  onClick={() => setDeleteTemplateId(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!deleteTemplateId}
        onOpenChange={() => setDeleteTemplateId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Odstranit šablonu</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete odstranit tuto šablonu? Tuto akci nelze vrátit zpět.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTemplateId) {
                  deleteMutation.mutate(deleteTemplateId);
                  setDeleteTemplateId(null);
                }
              }}
            >
              Odstranit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
