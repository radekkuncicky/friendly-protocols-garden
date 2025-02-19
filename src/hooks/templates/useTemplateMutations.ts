
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Template } from "@/types/template";

export const useTemplateMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<Template, 'id' | 'created_at' | 'created_by'>) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) throw new Error("No user session");

      const { data: existingTemplate } = await supabase
        .from("user_templates")
        .select("id")
        .eq("name", template.name)
        .maybeSingle();

      if (existingTemplate) {
        throw new Error("Šablona s tímto názvem již existuje");
      }

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
        if (error.code === '23505') {
          throw new Error("Šablona s tímto názvem již existuje");
        }
        throw error;
      }
      
      console.log("Template created:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona vytvořena",
        description: "Nová šablona byla úspěšně vytvořena.",
      });
    },
    onError: (error: Error) => {
      console.error("Template creation error:", error);
      toast({
        title: "Chyba při vytváření šablony",
        description: error.message || "Nepodařilo se vytvořit šablonu",
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

      // Generate a unique name by adding a number if necessary
      let baseName = `${template.name} (kopie)`;
      let newName = baseName;
      let counter = 1;

      while (true) {
        const { data: existingTemplate } = await supabase
          .from("user_templates")
          .select("id")
          .eq("name", newName)
          .maybeSingle();

        if (!existingTemplate) break;
        counter++;
        newName = `${baseName} ${counter}`;
      }

      const duplicatedTemplate = {
        name: newName,
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

  return {
    createTemplateMutation,
    statusMutation,
    duplicateMutation,
    toggleLockMutation,
  };
};
