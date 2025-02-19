
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTemplateMutations } from "./templates/useTemplateMutations";
import { transformUserTemplates } from "./templates/templateTransformers";
import { Template } from "@/types/template";

export const useTemplates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutations = useTemplateMutations();

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      console.log("Fetching user templates...");
      
      // Only fetch user templates for the main templates page
      const { data: userTemplates, error: userTemplatesError } = await supabase
        .from("user_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (userTemplatesError) {
        console.error("Error fetching user templates:", userTemplatesError);
        throw userTemplatesError;
      }

      const transformedTemplates = transformUserTemplates(userTemplates || []);
      console.log("User templates fetched:", transformedTemplates);
      return transformedTemplates;
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
    deleteTemplate,
    ...mutations,
  };
};
