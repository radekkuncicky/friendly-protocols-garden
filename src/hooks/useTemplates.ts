
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
      console.log("Fetching templates...");
      
      // First, fetch user templates
      const { data: userTemplates, error: userTemplatesError } = await supabase
        .from("user_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (userTemplatesError) {
        console.error("Error fetching user templates:", userTemplatesError);
        throw userTemplatesError;
      }

      // Then fetch predefined templates
      const { data: predefinedTemplates, error: predefinedError } = await supabase
        .from("predefined_templates")
        .select("*")
        .order("created_at", { ascending: true });

      if (predefinedError) {
        console.error("Error fetching predefined templates:", predefinedError);
        throw predefinedError;
      }

      // Transform predefined templates
      const transformedPredefined = predefinedTemplates.map(pt => ({
        id: pt.id,
        name: pt.name,
        content: {
          description: "Přednastavená šablona protokolu",
          category: "Obecné",
        },
        category: "Obecné",
        is_locked: false,
        status: 'published' as const,
        signature_required: true,
        created_at: pt.created_at,
        template_type: pt.type,
        template_path: pt.file_path,
        created_by: null,
      })) as Template[];

      // Transform user templates
      const transformedUser = userTemplates.map(ut => ({
        id: ut.id,
        name: ut.name,
        description: ut.description,
        content: ut.content,
        category: ut.category,
        is_locked: false,
        status: ut.status as 'draft' | 'published',
        signature_required: true,
        created_at: ut.created_at,
        created_by: ut.created_by,
        usage_count: ut.usage_count,
        is_active: ut.is_active,
      })) as Template[];

      console.log("Templates fetched:", [...transformedUser, ...transformedPredefined]);
      return [...transformedUser, ...transformedPredefined];
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<Template, 'id' | 'created_at' | 'created_by'>) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) throw new Error("No user session");

      console.log("Creating template:", template);

      const { data, error } = await supabase
        .from("user_templates")
        .insert([{
          name: template.name,
          description: template.description,
          content: template.content,
          category: template.category,
          status: 'draft',
          created_by: sessionData.session.user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating template:", error);
        throw error;
      }
      
      console.log("Template created:", data);
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona vytvořena",
        description: "Nová šablona byla úspěšně vytvořena.",
      });
    },
    onError: (error) => {
      console.error("Template creation error:", error);
      toast({
        title: "Chyba při vytváření šablony",
        description: "Nepodařilo se vytvořit šablonu: " + error.message,
        variant: "destructive",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ template, newStatus }: { template: Template; newStatus: 'draft' | 'published' }) => {
      const { data, error } = await supabase
        .from("user_templates")
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
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) throw new Error("No user session");

      const duplicatedTemplate = {
        name: `${template.name} (kopie)`,
        description: template.description,
        content: template.content,
        category: template.category,
        status: 'draft' as const,
        created_by: sessionData.session.user.id,
      };

      const { data, error } = await supabase
        .from("user_templates")
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
        .from("user_templates")
        .update({ is_active: !isLocked })
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
      .from("user_templates")
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
    createTemplateMutation,
    statusMutation,
    duplicateMutation,
    toggleLockMutation,
    deleteTemplate,
  };
};
