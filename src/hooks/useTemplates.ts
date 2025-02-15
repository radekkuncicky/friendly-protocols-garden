
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
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Template[];
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const duplicatedTemplate = {
        ...template,
        id: undefined,
        name: `${template.name} (kopie)`,
        created_at: new Date().toISOString(),
        created_by: user.id
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
