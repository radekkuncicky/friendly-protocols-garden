
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function TemplateUploadSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    setIsUploading(true);
    const file = event.target.files[0];
    
    try {
      // Upload the minimalist template JSON
      const { error: uploadError } = await supabase.storage
        .from('document-templates')
        .upload('minimalist-template.json', file, {
          contentType: 'application/json',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('document-templates')
        .getPublicUrl('minimalist-template.json');

      console.log("Template uploaded successfully:", publicUrl);

      // Update the predefined template with the new URL
      const { error: updateError } = await supabase
        .from('predefined_templates')
        .update({ file_path: publicUrl })
        .eq('type', 'minimalist');

      if (updateError) {
        throw updateError;
      }

      queryClient.invalidateQueries({ queryKey: ['predefined-templates'] });
      
      toast({
        title: "Šablona nahrána",
        description: "Minimalistická šablona byla úspěšně nahrána a nastavena jako výchozí.",
      });
    } catch (error: any) {
      console.error("Upload process error:", error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se nahrát šablonu: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      const input = document.getElementById('template-upload') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <Button
        onClick={() => document.getElementById('template-upload')?.click()}
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Nahrávání..." : "Nahrát šablonu"}
      </Button>
      <input
        id="template-upload"
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleTemplateUpload}
      />
    </div>
  );
}
