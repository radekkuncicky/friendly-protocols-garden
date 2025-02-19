import { PlusCircle, Copy, Search, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { useState } from "react";
import { Template } from "@/types/template";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog as ClientSearchDialog,
  DialogContent as ClientSearchDialogContent,
  DialogHeader as ClientSearchDialogHeader,
  DialogTitle as ClientSearchDialogTitle,
} from "@/components/ui/dialog";
import { CreateClientSheet } from "@/components/clients/CreateClientSheet";

const formSchema = z.object({
  client_id: z.string().min(1, "Klient je povinný"),
  type: z.string().min(1, "Typ protokolu je povinný"),
  items: z.array(z.object({
    name: z.string().min(1, "Název položky je povinný"),
    quantity: z.string().min(1, "Množství je povinné"),
    unit: z.string().min(1, "Jednotka je povinná")
  }))
});

type NewProtocolForm = z.infer<typeof formSchema>;

export const ProtocolsHeader = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isNewProtocolOpen, setIsNewProtocolOpen] = useState(false);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openClientCombobox, setOpenClientCombobox] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const form = useForm<NewProtocolForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      type: "",
      items: [{ name: "", quantity: "", unit: "ks" }]
    }
  });

  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("status", "active");
      if (error) throw error;
      return data || [];
    }
  });

  const { data: templates } = useQuery({
    queryKey: ["user-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_templates")
        .select("*");
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

  const createProtocolMutation = useMutation({
    mutationFn: async (data: NewProtocolForm) => {
      const { data: protocol, error } = await supabase
        .from('protocols')
        .insert([{
          client_id: data.client_id,
          content: {
            type: data.type,
            items: data.items
          } as Json,
          status: 'draft',
          protocol_number: ''
        }])
        .select()
        .single();
      if (error) throw error;
      return protocol;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocols'] });
      toast({
        title: "Protokol vytvořen",
        description: "Nový protokol byl úspěšně vytvořen."
      });
      form.reset();
      setIsNewProtocolOpen(false);
    },
    onError: error => {
      console.error('Error creating protocol:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se vytvořit nový protokol. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    }
  });

  const handleTemplateSelect = (template: Template) => {
    const templateItems = template.content.items?.map(item => ({
      name: item.name || "",
      quantity: item.quantity || "1",
      unit: item.unit || "ks"
    })) || [];

    form.reset({
      client_id: "",
      type: template.content.type || "",
      items: templateItems.length > 0 ? templateItems : [{ name: "", quantity: "", unit: "ks" }]
    });

    setIsTemplateDialogOpen(false);
    setIsNewProtocolOpen(true);
  };

  const onSubmit = (data: NewProtocolForm) => {
    createProtocolMutation.mutate(data);
  };

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [...currentItems, { name: "", quantity: "", unit: "ks" }]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    form.setValue("items", currentItems.filter((_, i) => i !== index));
  };

  const handleClientSelect = (clientId: string, clientName: string) => {
    form.setValue("client_id", clientId);
    setSearchValue(clientName);
    setIsClientSearchOpen(false);
  };

  const renderClientSearchContent = () => {
    if (isLoadingClients) {
      return (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2">Načítání klientů...</span>
        </div>
      );
    }

    const filteredClients = clients?.filter((client) =>
      client.name.toLowerCase().includes(searchValue.toLowerCase())
    ) || [];

    return (
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Vyhledat klienta..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>Žádný klient nenalezen.</CommandEmpty>
          <CommandGroup>
            {filteredClients.map((client) => (
              <CommandItem
                key={client.id}
                onSelect={() => handleClientSelect(client.id, client.name)}
              >
                {client.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Protokoly</h1>
      <div className="flex gap-2">
        <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
          <Button onClick={() => setIsTemplateDialogOpen(true)} variant="outline">
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
                userRole={userRole} 
                onPreview={handleTemplateSelect} 
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

        <Dialog open={isNewProtocolOpen} onOpenChange={setIsNewProtocolOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-400 text-gray-950">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nový protokol
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vytvořit nový protokol</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Klient</FormLabel>
                      <div className="flex gap-2">
                        <div className="relative w-full flex gap-2">
                          <Input
                            placeholder={isLoadingClients ? "Načítání..." : "Vyberte nebo napište jméno klienta"}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full"
                            autoComplete="off"
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsClientSearchOpen(true)}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsNewClientOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typ protokolu</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vyberte typ protokolu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="delivery">Předávací</SelectItem>
                          <SelectItem value="inspection">Kontrolní</SelectItem>
                          <SelectItem value="installation">Instalační</SelectItem>
                          <SelectItem value="maintenance">Servisní</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Položky</FormLabel>
                    <Button type="button" variant="outline" onClick={addItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Přidat položku
                    </Button>
                  </div>
                  
                  {form.watch("items").map((_, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="Název" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" placeholder="Množství" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.unit`}
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Jednotka" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ks">ks</SelectItem>
                                <SelectItem value="m">m</SelectItem>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="l">l</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                        className="self-end"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950">
                  Vytvořit protokol
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <ClientSearchDialog open={isClientSearchOpen} onOpenChange={setIsClientSearchOpen}>
          <ClientSearchDialogContent>
            <ClientSearchDialogHeader>
              <ClientSearchDialogTitle>Vyhledat klienta</ClientSearchDialogTitle>
            </ClientSearchDialogHeader>
            {renderClientSearchContent()}
          </ClientSearchDialogContent>
        </ClientSearchDialog>

        <CreateClientSheet
          open={isNewClientOpen}
          onOpenChange={setIsNewClientOpen}
        />
      </div>
    </div>
  );
};
