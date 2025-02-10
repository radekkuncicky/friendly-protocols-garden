
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentTemplateUploadProps {
  currentTemplate?: string | null;
  onTemplateUpdate: (templateUrl: string) => void;
}

export function DocumentTemplateUpload({ 
  currentTemplate, 
  onTemplateUpdate 
}: DocumentTemplateUploadProps) {
  const { toast } = useToast();
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
    const allowedTypes = ['pdf', 'doc', 'docx', 'txt'];

    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
      extension: fileExt
    });

    if (!fileExt || !allowedTypes.includes(fileExt)) {
      toast({
        title: "Nepodporovaný formát",
        description: "Povolené formáty jsou: PDF, DOC, DOCX, TXT",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    try {
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

      onTemplateUpdate(publicUrl);
      
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
      const input = document.getElementById('template-upload-default') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Šablona dokumentu</h3>
          <p className="text-sm text-muted-foreground">
            Nahrajte výchozí šablonu pro nové dokumenty
          </p>
        </div>
        <div className="flex items-center gap-4">
          {currentTemplate && (
            <a 
              href={currentTemplate} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Zobrazit aktuální šablonu
            </a>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('template-upload-default')?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Nahrávání..." : "Nahrát šablonu"}
          </Button>
          <input
            id="template-upload-default"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleTemplateUpload}
          />
        </div>
      </div>
      <Separator />
    </div>
  );
}
