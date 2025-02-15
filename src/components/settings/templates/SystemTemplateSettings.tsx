
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FileText, Layout, Minimize } from "lucide-react";

type DocumentStyle = {
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

export function SystemTemplateSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: styles, isLoading } = useQuery({
    queryKey: ["document-styles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_templates")
        .select("*")
        .order("name");

      if (error) throw error;
      
      // Transform the data to match DocumentStyle type
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        type: item.type as DocumentStyle['type'],
        is_active: item.is_active ?? false,
        configuration: {
          font: (item.configuration as any)?.font ?? 'Arial',
          fontSize: (item.configuration as any)?.fontSize ?? '12px',
          spacing: (item.configuration as any)?.spacing ?? '1.5',
          margins: {
            top: (item.configuration as any)?.margins?.top ?? '2cm',
            bottom: (item.configuration as any)?.margins?.bottom ?? '2cm',
            left: (item.configuration as any)?.margins?.left ?? '2cm',
            right: (item.configuration as any)?.margins?.right ?? '2cm',
          },
          headerStyle: (item.configuration as any)?.headerStyle ?? 'standard',
          footerStyle: (item.configuration as any)?.footerStyle ?? 'standard',
        },
      })) as DocumentStyle[];
    },
  });

  const activeMutation = useMutation({
    mutationFn: async (styleId: string) => {
      const { error } = await supabase
        .from("system_templates")
        .update({ is_active: true })
        .eq("id", styleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-styles"] });
      toast({
        title: "Styl byl aktivován",
        description: "Změna byla úspěšně uložena.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba při aktivaci stylu",
        description: "Nepodařilo se aktivovat styl: " + error.message,
        variant: "destructive",
      });
    },
  });

  const activeStyle = styles?.find(s => s.is_active);

  if (isLoading) {
    return <Skeleton className="w-full h-[200px]" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Výchozí styl dokumentů</h3>
        <p className="text-sm text-muted-foreground">
          Vyberte výchozí vzhled pro všechny protokoly
        </p>
      </div>

      <RadioGroup
        value={activeStyle?.id}
        onValueChange={(value) => activeMutation.mutate(value)}
        className="grid grid-cols-3 gap-4"
      >
        {styles?.map((style) => (
          <Label
            key={style.id}
            htmlFor={style.id}
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
          >
            <RadioGroupItem
              value={style.id}
              id={style.id}
              className="sr-only"
            />
            {style.type === 'minimalistic' ? (
              <Minimize className="mb-2 h-6 w-6" />
            ) : style.type === 'classic' ? (
              <FileText className="mb-2 h-6 w-6" />
            ) : (
              <Layout className="mb-2 h-6 w-6" />
            )}
            <span className="text-sm font-medium">{style.name}</span>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {style.type === 'minimalistic'
                ? 'Jednoduchý a čistý design'
                : style.type === 'classic'
                ? 'Tradiční formát s důrazem na přehlednost'
                : 'Detailní rozložení s rozšířenými možnostmi'}
            </p>
          </Label>
        ))}
      </RadioGroup>

      <div className="rounded-md bg-muted p-4 mt-4">
        <h4 className="font-medium mb-2">Aktivní styl: {activeStyle?.name}</h4>
        <div className="text-sm text-muted-foreground">
          <p>Font: {activeStyle?.configuration.font}</p>
          <p>Velikost písma: {activeStyle?.configuration.fontSize}</p>
          <p>Řádkování: {activeStyle?.configuration.spacing}</p>
        </div>
      </div>
    </div>
  );
}
