
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TemplateTable } from "./template-table/TemplateTable";
import { DeleteTemplateDialog } from "./template-table/DeleteTemplateDialog";

interface Template {
  id: string;
  filename: string;
  file_type: string;
  file_url: string;
  upload_date: string;
  is_default: boolean;
}

export function TemplateManagementTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      console.log("Fetching templates");
      const { data, error } = await supabase
        .from("settings_templates")
        .select("*")
        .order("upload_date", { ascending: false });

      if (error) {
        console.error("Error fetching templates:", error);
        throw error;
      }
      console.log("Templates fetched:", data);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const template = templates?.find((t) => t.id === id);
      if (!template) return;

      console.log("Starting template deletion process for:", template);

      // Delete file from storage
      const filePath = new URL(template.file_url).pathname.split("/").pop();
      if (filePath) {
        console.log("Deleting file from storage:", filePath);
        const { error: storageError } = await supabase.storage
          .from("document-templates")
          .remove([filePath]);
        if (storageError) {
          console.error("Storage deletion error:", storageError);
          throw storageError;
        }
      }

      // Delete record from database
      console.log("Deleting template record from database");
      const { error: dbError } = await supabase
        .from("settings_templates")
        .delete()
        .eq("id", id);
      if (dbError) {
        console.error("Database deletion error:", dbError);
        throw dbError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona odstraněna",
        description: "Šablona byla úspěšně odstraněna.",
      });
    },
    onError: (error) => {
      console.error("Delete mutation error:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se odstranit šablonu: " + error.message,
        variant: "destructive",
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async ({ id, isDefault }: { id: string; isDefault: boolean }) => {
      const { error } = await supabase
        .from("settings_templates")
        .update({ is_default: isDefault })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Výchozí šablona nastavena",
        description: "Změna byla úspěšně uložena.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se nastavit výchozí šablonu: " + error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Načítání...</div>;
  }

  if (error) {
    console.error("Template table error:", error);
    return (
      <div className="text-red-500">
        Chyba při načítání šablon: {error.message}
      </div>
    );
  }

  const handleSetDefault = (id: string, isDefault: boolean) => {
    setDefaultMutation.mutate({ id, isDefault });
  };

  const handleDelete = (id: string) => {
    setDeleteTemplateId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTemplateId) {
      deleteMutation.mutate(deleteTemplateId);
      setDeleteTemplateId(null);
    }
  };

  return (
    <div>
      <TemplateTable
        templates={templates || []}
        onSetDefault={handleSetDefault}
        onDelete={handleDelete}
      />

      <DeleteTemplateDialog
        isOpen={!!deleteTemplateId}
        onClose={() => setDeleteTemplateId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
