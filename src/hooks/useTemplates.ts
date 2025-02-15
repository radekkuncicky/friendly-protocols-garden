import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Template } from "@/types/template";

export const useTemplates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      console.log("Fetching templates");
      const { data: predefinedTemplates, error: predefinedError } = await supabase
        .from("predefined_templates")
        .select("*")
        .order("created_at", { ascending: true });

      if (predefinedError) throw predefinedError;

      // Transform predefined templates to match Template type
      const transformedTemplates = predefinedTemplates.map(pt => ({
        id: pt.id,
        name: pt.name,
        content: {
          description: "Přednastavená šablona protokolu",
          category: "Obecné",
        },
        category: "Obecné",
        is_locked: false,
        status: 'published',
        signature_required: true,
        created_at: pt.created_at,
        template_type: pt.type,
        template_path: pt.file_path
      })) as Template[];

      console.log("Transformed templates:", transformedTemplates);
      return transformedTemplates;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ template, newStatus }: { template: Template; newStatus: 'draft' | 'published' }) => {
      const { data, error } = await supabase
        .from("templates")
        .update({ status: newStatus })
        .eq("id", template.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Status šablony byl změněn",
        description: "Změna byla úspěšně uložena.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba při změně statusu",
        description: "Nepodařilo se změnit status šablony: " + error.message,
        variant: "destructive",
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (template: Template) => {
      const duplicatedTemplate = {
        ...template,
        id: undefined,
        name: `${template.name} (kopie)`,
        created_at: new Date().toISOString(),
      };
      delete duplicatedTemplate.id;

      const { data, error } = await supabase
        .from("templates")
        .insert([duplicatedTemplate])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona byla úspěšně zkopírována",
        description: "Nová šablona byla vytvořena jako kopie.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba při kopírování šablony",
        description: "Zkuste to prosím později.",
        variant: "destructive",
      });
    },
  });

  const toggleLockMutation = useMutation({
    mutationFn: async ({ id, isLocked }: { id: string; isLocked: boolean }) => {
      const { data, error } = await supabase
        .from("templates")
        .update({ is_locked: !isLocked })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Stav šablony byl změněn",
        description: "Změna byla úspěšně uložena.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba při změně stavu šablony",
        description: "Zkuste to prosím později.",
        variant: "destructive",
      });
    },
  });

  const deleteTemplate = async (template: Template) => {
    const { error } = await supabase
      .from("templates")
      .delete()
      .eq("id", template.id);

    if (error) {
      toast({
        title: "Chyba při mazání šablony",
        description: "Zkuste to prosím později.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["templates"] });
    toast({
      title: "Šablona byla smazána",
      description: "Šablona byla úspěšně odstraněna.",
    });
  };

  return {
    templates,
    isLoading,
    error,
    statusMutation,
    duplicateMutation,
    toggleLockMutation,
    deleteTemplate,
  };
};
