
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Template } from "@/types/template";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (template: Template) => void;
}

export const TemplateDialog = ({ isOpen, onOpenChange, onTemplateSelect }: TemplateDialogProps) => {
  const { data: templates } = useQuery({
    queryKey: ["user-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_templates")
        .select("*")
        .not('category', 'eq', 'System'); // Exclude system templates

      if (error) throw error;
      
      return (data || []).map(ut => ({
        id: ut.id,
        name: ut.name,
        content: ut.content,
        category: ut.category || "Obecné",
        is_locked: false,
        status: ut.status as 'draft' | 'published',
        signature_required: true,
        created_at: ut.created_at,
        created_by: ut.created_by
      })) as Template[];
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <Button onClick={() => onOpenChange(true)} variant="outline">
        <Copy className="mr-2 h-4 w-4" />
        Nový ze šablony
      </Button>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vyberte šablonu</DialogTitle>
        </DialogHeader>
        {templates && templates.length > 0 ? (
          <TemplateGrid 
            templates={templates} 
            userRole={null} 
            onPreview={onTemplateSelect} 
            onEdit={() => {}} 
            onDuplicate={() => {}} 
            onToggleLock={() => {}} 
            onDelete={() => {}} 
            onStatusChange={() => {}} 
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Žádné uživatelské šablony nejsou k dispozici
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
