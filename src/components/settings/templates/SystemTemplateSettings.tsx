
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FileText, Layout, Minimize } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

type SystemTemplate = {
  id: string;
  name: string;
  type: 'minimalistic' | 'classic' | 'detailed';
  is_active: boolean;
  configuration: {
    font: string;
    fontSize: string;
    spacing: string;
    margins: {
      top: string;
      bottom: string;
      left: string;
      right: string;
    };
    headerStyle: string;
    footerStyle: string;
  };
};

type RawSystemTemplate = {
  id: string;
  name: string;
  type: 'minimalistic' | 'classic' | 'detailed';
  is_active: boolean;
  configuration: Json;
  created_at: string;
  updated_at: string;
};

export function SystemTemplateSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["system-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_templates")
        .select("*")
        .order("name");

      if (error) throw error;
      
      // Transform the raw data to match our SystemTemplate type
      return (data as RawSystemTemplate[]).map(template => ({
        id: template.id,
        name: template.name,
        type: template.type,
        is_active: template.is_active,
        configuration: template.configuration as SystemTemplate['configuration']
      })) as SystemTemplate[];
    },
  });

  const activeMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const { error } = await supabase
        .from("system_templates")
        .update({ is_active: true })
        .eq("id", templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-templates"] });
      toast({
        title: "Šablona byla aktivována",
        description: "Změna byla úspěšně uložena.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba při aktivaci šablony",
        description: "Nepodařilo se aktivovat šablonu: " + error.message,
        variant: "destructive",
      });
    },
  });

  const activeTemplate = templates?.find(t => t.is_active);

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Systémové šablony</h3>
        <p className="text-sm text-muted-foreground">
          Vyberte výchozí vzhled pro všechny protokoly.
        </p>
      </div>

      <RadioGroup
        value={activeTemplate?.id}
        onValueChange={(value) => activeMutation.mutate(value)}
        className="grid grid-cols-3 gap-4"
      >
        {templates?.map((template) => (
          <Label
            key={template.id}
            htmlFor={template.id}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <RadioGroupItem
              value={template.id}
              id={template.id}
              className="sr-only"
            />
            {template.type === 'minimalistic' ? (
              <Minimize className="mb-2 h-6 w-6" />
            ) : template.type === 'classic' ? (
              <FileText className="mb-2 h-6 w-6" />
            ) : (
              <Layout className="mb-2 h-6 w-6" />
            )}
            <span className="text-sm font-medium">{template.name}</span>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {template.type === 'minimalistic'
                ? 'Jednoduchý a čistý design'
                : template.type === 'classic'
                ? 'Tradiční formát s důrazem na přehlednost'
                : 'Detailní rozložení s rozšířenými možnostmi'}
            </p>
          </Label>
        ))}
      </RadioGroup>

      <div className="rounded-md bg-muted p-4 mt-4">
        <h4 className="font-medium mb-2">Aktivní šablona: {activeTemplate?.name}</h4>
        <div className="text-sm text-muted-foreground">
          <p>Font: {activeTemplate?.configuration.font}</p>
          <p>Velikost písma: {activeTemplate?.configuration.fontSize}</p>
          <p>Řádkování: {activeTemplate?.configuration.spacing}</p>
        </div>
      </div>
    </div>
  );
}
