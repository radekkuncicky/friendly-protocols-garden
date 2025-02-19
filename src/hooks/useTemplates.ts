
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTemplateMutations } from "./templates/useTemplateMutations";
import { transformPredefinedTemplates, transformUserTemplates } from "./templates/templateTransformers";

export const useTemplates = () => {
  const { toast } = useToast();
  const mutations = useTemplateMutations();

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

      const transformedPredefined = transformPredefinedTemplates(predefinedTemplates);
      const transformedUser = transformUserTemplates(userTemplates);

      console.log("Templates fetched:", [...transformedUser, ...transformedPredefined]);
      return [...transformedUser, ...transformedPredefined];
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
