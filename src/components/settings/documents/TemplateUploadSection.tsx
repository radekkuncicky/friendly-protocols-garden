
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function TemplateUploadSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedTypes = ['pdf', 'doc', 'docx', 'txt'];

    if (!fileExt || !allowedTypes.includes(fileExt)) {
      toast({
        title: "Nepodporovaný formát",
        description: "Povolené formáty jsou: PDF, DOC, DOCX, TXT",
        variant: "destructive",
      });
      return;
    }

    // Check existing templates count
    const { count } = await supabase
      .from('settings_templates')
      .select('*', { count: 'exact' });

    if (count && count >= 5) {
      toast({
        title: "Překročen limit šablon",
        description: "Můžete nahrát maximálně 5 šablon. Nejprve některé odstraňte.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('document-templates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('document-templates')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('settings_templates')
        .insert({
          filename: file.name,
          file_type: fileExt.toUpperCase(),
          file_url: publicUrl,
          file_size: file.size,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['templates'] });
      
      toast({
        title: "Šablona nahrána",
        description: "Šablona byla úspěšně nahrána.",
      });
    } catch (error: any) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se nahrát šablonu: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <Button
        onClick={() => document.getElementById('template-upload')?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Nahrát šablonu
      </Button>
      <input
        id="template-upload"
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={handleTemplateUpload}
      />
    </div>
  );
}
