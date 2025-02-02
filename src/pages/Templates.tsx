import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Copy, Lock, Unlock, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import CreateTemplateDialog from "@/components/templates/CreateTemplateDialog";
import EditTemplateDialog from "@/components/templates/EditTemplateDialog";
import PreviewTemplateDialog from "@/components/templates/PreviewTemplateDialog";

type Template = {
  id: string;
  name: string;
  content: any;
  category?: string;
  is_locked?: boolean;
  version?: number;
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

  // Fetch user role
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

  // Fetch templates
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

  // Delete template mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("templates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona smazána",
        description: "Šablona byla úspěšně odstraněna.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Při mazání šablony došlo k chybě.",
        variant: "destructive",
      });
      console.error("Error deleting template:", error);
    },
  });

  // Toggle lock mutation
  const toggleLockMutation = useMutation({
    mutationFn: async ({ id, isLocked }: { id: string; isLocked: boolean }) => {
      const { error } = await supabase
        .from("templates")
        .update({ is_locked: !isLocked })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Stav šablony změněn",
        description: "Stav uzamčení šablony byl úspěšně změněn.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Při změně stavu šablony došlo k chybě.",
        variant: "destructive",
      });
      console.error("Error toggling template lock:", error);
    },
  });

  // Duplicate template mutation
  const duplicateMutation = useMutation({
    mutationFn: async (template: Template) => {
      const { data: session } = await supabase.auth.getSession();
      const { error } = await supabase.from("templates").insert({
        name: `${template.name} (kopie)`,
        content: template.content,
        category: template.category,
        created_by: session?.user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Šablona zkopírována",
        description: "Šablona byla úspěšně zkopírována.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Při kopírování šablony došlo k chybě.",
        variant: "destructive",
      });
      console.error("Error duplicating template:", error);
    },
  });

  const handleDelete = async (template: Template) => {
    if (template.is_locked && userRole !== "admin") {
      toast({
        title: "Nelze smazat",
        description: "Uzamčené šablony může smazat pouze administrátor.",
        variant: "destructive",
      });
      return;
    }
    deleteMutation.mutate(template.id);
  };

  const handleToggleLock = (template: Template) => {
    if (userRole !== "admin") {
      toast({
        title: "Nedostatečná oprávnění",
        description: "Pouze administrátor může měnit stav uzamčení šablony.",
        variant: "destructive",
      });
      return;
    }
    toggleLockMutation.mutate({ id: template.id, isLocked: template.is_locked || false });
  };

  const handleDuplicate = (template: Template) => {
    duplicateMutation.mutate(template);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Šablony</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const categories = [...new Set(templates?.map((t) => t.category || "Obecné"))];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Šablony</h1>
        {(userRole === "admin" || userRole === "manager") && (
          <Button onClick={() => setIsCreateOpen(true)}>
            <PlusCircle className="mr-2" />
            Nová šablona
          </Button>
        )}
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
              {templates
                ?.filter((t) => (t.category || "Obecné") === category)
                .map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{template.name}</CardTitle>
                          <CardDescription>
                            Vytvořeno: {new Date(template.created_at).toLocaleDateString("cs-CZ")}
                          </CardDescription>
                        </div>
                        {template.is_locked && (
                          <Badge variant="secondary">
                            <Lock className="h-3 w-3 mr-1" />
                            Uzamčeno
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {template.content.description || "Bez popisu"}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setIsPreviewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(userRole === "admin" ||
                          (userRole === "manager" && !template.is_locked)) && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedTemplate(template);
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {(userRole === "admin" || userRole === "manager") && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDuplicate(template)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {userRole === "admin" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleLock(template)}
                          >
                            {template.is_locked ? (
                              <Unlock className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(template)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
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