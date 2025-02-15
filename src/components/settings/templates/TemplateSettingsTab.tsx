
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Template } from "@/types/template";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, Upload } from "lucide-react";

export function TemplateSettingsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<File | null>(null);

  const { data: templates, isLoading } = useQuery({
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

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("template-previews")
        .upload(`previews/${file.name}`, file);

      if (uploadError) throw uploadError;

      const previewUrl = supabase.storage
        .from("template-previews")
        .getPublicUrl(`previews/${file.name}`).data.publicUrl;

      const { error: updateError } = await supabase
        .from("templates")
        .update({ preview_image: previewUrl })
        .eq("id", templates?.[0].id);

      if (updateError) throw updateError;

      return previewUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Náhled nahrán",
        description: "Náhled šablony byl úspěšně nahrán.",
      });
      setSelectedTemplate(null);
    },
    onError: (error) => {
      toast({
        title: "Chyba při nahrávání",
        description: "Nepodařilo se nahrát náhled šablony: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedTemplate(file);
      uploadMutation.mutate(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nastavení šablon</CardTitle>
          <CardDescription>
            Správa šablon a jejich výchozích hodnot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="previews" className="space-y-4">
            <TabsList>
              <TabsTrigger value="previews">Náhledy</TabsTrigger>
              <TabsTrigger value="defaults">Výchozí hodnoty</TabsTrigger>
            </TabsList>

            <TabsContent value="previews" className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Náhledy šablon</h3>
                    <p className="text-sm text-gray-500">
                      Nahrajte náhledy pro vaše šablony
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("template-preview")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Nahrát náhled
                    </Button>
                    <input
                      type="file"
                      id="template-preview"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div>Načítání...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates?.map((template) => (
                      <Card key={template.id}>
                        <CardContent className="p-4">
                          <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                            {template.preview_image ? (
                              <img
                                src={template.preview_image}
                                alt={template.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <FileCheck className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <h4 className="mt-2 font-medium">{template.name}</h4>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="defaults" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h3 className="text-lg font-medium">Výchozí hodnoty</h3>
                  <p className="text-sm text-gray-500">
                    Nastavte výchozí hodnoty pro nové šablony
                  </p>
                </div>
                {/* We'll implement default values settings in the next iteration */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
