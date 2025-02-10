
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  protocol_number: z.string().min(1, "Protocol number is required"),
});

type NewProtocolForm = z.infer<typeof formSchema>;

export const ProtocolsHeader = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<NewProtocolForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocol_number: "",
    },
  });

  const createProtocolMutation = useMutation({
    mutationFn: async (data: NewProtocolForm) => {
      const { data: protocol, error } = await supabase
        .from('protocols')
        .insert([
          { 
            protocol_number: data.protocol_number,
            content: {},
            status: 'draft'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return protocol;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: "Protocol created",
        description: "New protocol has been created successfully.",
      });
      form.reset();
    },
    onError: (error) => {
      console.error('Error creating protocol:', error);
      toast({
        title: "Error",
        description: "Failed to create new protocol. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewProtocolForm) => {
    createProtocolMutation.mutate(data);
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Protokoly</h1>
      <Sheet>
        <SheetTrigger asChild>
          <Button>
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
              <FormField
                control={form.control}
                name="protocol_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Protocol Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter protocol number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Protocol
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  );
};
