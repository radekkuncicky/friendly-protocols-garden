
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
    console.log("Upload triggered", event.target.files);
    
    if (!event.target.files || !event.target.files[0]) {
      console.log("No file selected");
      return;
    }

    setIsUploading(true);
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedTypes = ['docx'];

    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
      extension: fileExt
    });

    if (!fileExt || !allowedTypes.includes(fileExt)) {
      toast({
        title: "Nepodporovaný formát",
        description: "Povolený formát je pouze DOCX",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    try {
      // Check existing templates count
      const { count, error: countError } = await supabase
        .from('settings_templates')
        .select('*', { count: 'exact' });

      if (countError) {
        console.error("Error checking template count:", countError);
        throw countError;
      }

      console.log("Current template count:", count);

      if (count && count >= 5) {
        toast({
          title: "Překročen limit šablon",
          description: "Můžete nahrát maximálně 5 šablon. Nejprve některé odstraňte.",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      console.log("Generated filename:", fileName);

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('document-templates')
        .upload(fileName, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully:", uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('document-templates')
        .getPublicUrl(fileName);

      console.log("Public URL generated:", publicUrl);

      const { error: dbError } = await supabase
        .from('settings_templates')
        .insert({
          filename: file.name,
          file_type: fileExt.toUpperCase(),
          file_url: publicUrl,
          file_size: file.size,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw dbError;
      }

      queryClient.invalidateQueries({ queryKey: ['templates'] });
      
      toast({
        title: "Šablona nahrána",
        description: "Šablona byla úspěšně nahrána.",
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
      // Reset the file input
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
        accept=".docx"
        className="hidden"
        onChange={handleTemplateUpload}
      />
    </div>
  );
}
