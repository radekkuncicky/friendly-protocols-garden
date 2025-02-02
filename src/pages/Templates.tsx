import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import CreateTemplateDialog from "@/components/templates/CreateTemplateDialog";
import EditTemplateDialog from "@/components/templates/EditTemplateDialog";
import PreviewTemplateDialog from "@/components/templates/PreviewTemplateDialog";
import { TemplatesHeader } from "@/components/templates/TemplatesHeader";
import { TemplatesSearch } from "@/components/templates/TemplatesSearch";
import { TemplateTabs } from "@/components/templates/TemplateTabs";
import { useTemplates } from "@/hooks/useTemplates";
import { Template } from "@/types/template";

const Templates = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    templates,
    isLoading,
    error,
    statusMutation,
    duplicateMutation,
    toggleLockMutation,
    deleteTemplate,
  } = useTemplates();

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        if (roles) {
          setUserRole(roles.role);
        }
      }
    };
    fetchUserRole();
  }, []);

  const filteredTemplates = templates?.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.content.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(filteredTemplates?.map((t) => t.category || "Obecné"))];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TemplatesHeader userRole={userRole} onCreateClick={() => setIsCreateOpen(true)} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h1 className="text-2xl font-bold text-red-500">Chyba při načítání šablon</h1>
        <p className="text-gray-600">
          {error instanceof Error ? error.message : "Zkuste to prosím později nebo kontaktujte podporu."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TemplatesHeader
          userRole={userRole}
          onCreateClick={() => setIsCreateOpen(true)}
        />
        <TemplatesSearch onSearch={setSearchQuery} />
      </div>

      <TemplateTabs
        categories={categories}
        templates={filteredTemplates || []}
        userRole={userRole}
        onPreview={(template) => {
          setSelectedTemplate(template);
          setIsPreviewOpen(true);
        }}
        onEdit={(template) => {
          setSelectedTemplate(template);
          setIsEditOpen(true);
        }}
        onDuplicate={(template) => duplicateMutation.mutate(template)}
        onToggleLock={(template) => toggleLockMutation.mutate({
          id: template.id,
          isLocked: template.is_locked || false
        })}
        onDelete={deleteTemplate}
        onStatusChange={(template, newStatus) => 
          statusMutation.mutate({ template, newStatus })}
      />

      <CreateTemplateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      
      {selectedTemplate && (
        <>
          <EditTemplateDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            template={selectedTemplate}
          />
          <PreviewTemplateDialog
            open={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            template={selectedTemplate}
          />
        </>
      )}
    </div>
  );
};

export default Templates;