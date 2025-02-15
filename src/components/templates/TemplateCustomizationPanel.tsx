
import { useState } from "react";
import { Template } from "@/types/template";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateCustomizationPanelProps {
  template: Template;
  onClose: () => void;
}

export function TemplateCustomizationPanel({
  template,
  onClose,
}: TemplateCustomizationPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [headerConfig, setHeaderConfig] = useState(template.content.header || {
    show_logo: true,
    show_title: true,
    show_page_numbers: true,
    logo_position: 'top-left'
  });
  const [bodyConfig, setBodyConfig] = useState(template.content.body || {
    layout: 'single-column',
    font_size: 'medium'
  });
  const [footerConfig, setFooterConfig] = useState(template.content.footer || {
    show_contact: true,
    show_disclaimer: false
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const updatedContent = {
        ...template.content,
        header: headerConfig,
        body: bodyConfig,
        footer: footerConfig
      };

      const { data, error } = await supabase
        .from("user_templates")
        .update({ content: updatedContent })
        .eq("id", template.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona aktualizována",
        description: "Změny byly úspěšně uloženy.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Chyba při ukládání",
        description: "Nepodařilo se uložit změny: " + error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Nastavení šablony: {template.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="header" className="space-y-4">
          <TabsList>
            <TabsTrigger value="header">Hlavička</TabsTrigger>
            <TabsTrigger value="body">Obsah</TabsTrigger>
            <TabsTrigger value="footer">Patička</TabsTrigger>
          </TabsList>

          <TabsContent value="header" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-logo"
                  checked={headerConfig.show_logo}
                  onCheckedChange={(checked) =>
                    setHeaderConfig({ ...headerConfig, show_logo: checked })
                  }
                />
                <Label htmlFor="show-logo">Zobrazit logo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-title"
                  checked={headerConfig.show_title}
                  onCheckedChange={(checked) =>
                    setHeaderConfig({ ...headerConfig, show_title: checked })
                  }
                />
                <Label htmlFor="show-title">Zobrazit nadpis</Label>
              </div>

              <div className="space-y-2">
                <Label>Pozice loga</Label>
                <Select
                  value={headerConfig.logo_position}
                  onValueChange={(value) =>
                    setHeaderConfig({ ...headerConfig, logo_position: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Vlevo nahoře</SelectItem>
                    <SelectItem value="top-center">Na středu nahoře</SelectItem>
                    <SelectItem value="top-right">Vpravo nahoře</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="body" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Rozložení</Label>
                <Select
                  value={bodyConfig.layout}
                  onValueChange={(value) =>
                    setBodyConfig({ ...bodyConfig, layout: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-column">Jeden sloupec</SelectItem>
                    <SelectItem value="two-columns">Dva sloupce</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Velikost písma</Label>
                <Select
                  value={bodyConfig.font_size}
                  onValueChange={(value) =>
                    setBodyConfig({ ...bodyConfig, font_size: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Malé</SelectItem>
                    <SelectItem value="medium">Střední</SelectItem>
                    <SelectItem value="large">Velké</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="footer" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-contact"
                  checked={footerConfig.show_contact}
                  onCheckedChange={(checked) =>
                    setFooterConfig({ ...footerConfig, show_contact: checked })
                  }
                />
                <Label htmlFor="show-contact">Zobrazit kontaktní údaje</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="show-page-numbers"
                  checked={headerConfig.show_page_numbers}
                  onCheckedChange={(checked) =>
                    setHeaderConfig({
                      ...headerConfig,
                      show_page_numbers: checked,
                    })
                  }
                />
                <Label htmlFor="show-page-numbers">Zobrazit čísla stránek</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Zrušit
          </Button>
          <Button onClick={() => updateMutation.mutate()}>Uložit změny</Button>
        </div>
      </CardContent>
    </Card>
  );
}
