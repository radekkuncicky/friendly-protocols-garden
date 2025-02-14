import { PlusCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { useState } from "react";
import { Template } from "@/types/template";
const formSchema = z.object({
  protocol_number: z.string().min(1, "Protocol number is required")
});
type NewProtocolForm = z.infer<typeof formSchema>;
export const ProtocolsHeader = () => {
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const form = useForm<NewProtocolForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocol_number: ""
    }
  });
  const {
    data: templates
  } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("templates").select("*").eq("status", "published");
      if (error) throw error;
      return data as Template[];
    }
  });
  const createProtocolMutation = useMutation({
    mutationFn: async (data: NewProtocolForm) => {
      const {
        data: protocol,
        error
      } = await supabase.from('protocols').insert([{
        protocol_number: data.protocol_number,
        content: {},
        status: 'draft'
      }]).select().single();
      if (error) throw error;
      return protocol;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['protocols']
      });
      toast({
        title: "Protocol created",
        description: "New protocol has been created successfully."
      });
      form.reset();
    },
    onError: error => {
      console.error('Error creating protocol:', error);
      toast({
        title: "Error",
        description: "Failed to create new protocol. Please try again.",
        variant: "destructive"
      });
    }
  });
  const createFromTemplateMutation = useMutation({
    mutationFn: async (template: Template) => {
      const {
        data: protocol,
        error
      } = await supabase.from('protocols').insert([{
        protocol_number: `${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        content: template.content,
        status: 'draft',
        template_id: template.id
      }]).select().single();
      if (error) throw error;
      return protocol;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['protocols']
      });
      toast({
        title: "Protocol created",
        description: "New protocol has been created from template successfully."
      });
      setIsTemplateDialogOpen(false);
    },
    onError: error => {
      console.error('Error creating protocol from template:', error);
      toast({
        title: "Error",
        description: "Failed to create protocol from template. Please try again.",
        variant: "destructive"
      });
    }
  });
  const onSubmit = (data: NewProtocolForm) => {
    createProtocolMutation.mutate(data);
  };
  const handleTemplateSelect = (template: Template) => {
    createFromTemplateMutation.mutate(template);
  };
  return <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Protokoly</h1>
      <div className="flex gap-2">
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <Button onClick={() => setIsTemplateDialogOpen(true)} variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Nový z šablony
          </Button>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vyberte šablonu</DialogTitle>
            </DialogHeader>
            {templates && <TemplateGrid templates={templates} userRole={userRole} onPreview={handleTemplateSelect} onEdit={() => {}} onDuplicate={() => {}} onToggleLock={() => {}} onDelete={() => {}} onStatusChange={() => {}} />}
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-400 text-gray-950">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nový protokol
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Protocol</SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField control={form.control} name="protocol_number" render={({
                field
              }) => <FormItem>
                      <FormLabel>Protocol Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter protocol number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />
                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950">
                  Create Protocol
                </Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
    </div>;
};