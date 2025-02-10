
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

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('settings-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('settings-files')
        .getPublicUrl(filePath);

      onTemplateUpdate(publicUrl);
      
      toast({
        title: "Šablona nahrána",
        description: "Šablona dokumentu byla úspěšně nahrána.",
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
      </div>
      <Separator />
    </div>
  );
}
