import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import CreateTemplateDialog from "@/components/templates/CreateTemplateDialog";
import EditTemplateDialog from "@/components/templates/EditTemplateDialog";
import PreviewTemplateDialog from "@/components/templates/PreviewTemplateDialog";
import { TemplatesHeader } from "@/components/templates/TemplatesHeader";
import { TemplatesSearch } from "@/components/templates/TemplatesSearch";
import { TemplateCard } from "@/components/templates/TemplateCard";

type Template = {
  id: string;
  name: string;
  content: any;
  category?: string;
  is_locked?: boolean;
  status: 'draft' | 'published';
  signature_required: boolean;
  created_at: string;
  created_by: string | null;
};

const Templates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: roles, error: rolesError } = await supabase
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

  // Add new mutation for status changes
  const statusMutation = useMutation({
    mutationFn: async ({ template, newStatus }: { template: Template; newStatus: 'draft' | 'published' }) => {
      const { data, error } = await supabase
        .from("templates")
        .update({ status: newStatus })
        .eq("id", template.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Status šablony byl změněn",
        description: "Změna byla úspěšně uložena.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba při změně statusu",
        description: "Nepodařilo se změnit status šablony: " + error.message,
        variant: "destructive",
      });
    },
  });

  // Handle status change
  const handleStatusChange = (template: Template, newStatus: 'draft' | 'published') => {
    statusMutation.mutate({ template, newStatus });
  };

  const { data: templates, isLoading, error } = useQuery({
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

  // Duplicate template mutation
  const duplicateMutation = useMutation({
    mutationFn: async (template: Template) => {
      const duplicatedTemplate = {
        ...template,
        id: undefined,
        name: `${template.name} (kopie)`,
        created_at: new Date().toISOString(),
      };
      delete duplicatedTemplate.id;

      const { data, error } = await supabase
        .from("templates")
        .insert([duplicatedTemplate])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona byla úspěšně zkopírována",
        description: "Nová šablona byla vytvořena jako kopie.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba při kopírování šablony",
        description: "Zkuste to prosím později.",
        variant: "destructive",
      });
    },
  });

  // Toggle lock mutation
  const toggleLockMutation = useMutation({
    mutationFn: async ({ id, isLocked }: { id: string; isLocked: boolean }) => {
      const { data, error } = await supabase
        .from("templates")
        .update({ is_locked: !isLocked })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Stav šablony byl změněn",
        description: "Změna byla úspěšně uložena.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba při změně stavu šablony",
        description: "Zkuste to prosím později.",
        variant: "destructive",
      });
    },
  });

  // Delete template handler
  const handleDelete = async (template: Template) => {
    const { error } = await supabase
      .from("templates")
      .delete()
      .eq("id", template.id);

    if (error) {
      toast({
        title: "Chyba při mazání šablony",
        description: "Zkuste to prosím později.",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["templates"] });
    toast({
      title: "Šablona byla smazána",
      description: "Šablona byla úspěšně odstraněna.",
    });
  };

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

      <Tabs defaultValue={categories[0]} className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="w-full justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates
                ?.filter((t) => (t.category || "Obecné") === category)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    userRole={userRole}
                    onPreview={() => {
                      setSelectedTemplate(template);
                      setIsPreviewOpen(true);
                    }}
                    onEdit={() => {
                      setSelectedTemplate(template);
                      setIsEditOpen(true);
                    }}
                    onDuplicate={() => duplicateMutation.mutate(template)}
                    onToggleLock={() => toggleLockMutation.mutate({
                      id: template.id,
                      isLocked: template.is_locked || false
                    })}
                    onDelete={() => handleDelete(template)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
