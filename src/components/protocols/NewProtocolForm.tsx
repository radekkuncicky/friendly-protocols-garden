
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { ClientSearch } from "./client-search/ClientSearch";
import { useState } from "react";
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

interface NewProtocolFormProps {
  onSuccess: () => void;
  initialData?: Partial<NewProtocolForm>;
}

export const NewProtocolForm = ({ onSuccess, initialData }: NewProtocolFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const form = useForm<NewProtocolForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      type: "",
      items: [{ name: "", quantity: "", unit: "ks" }],
      ...initialData
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
      onSuccess();
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

  return (
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
                    placeholder="Vyberte klienta"
                    value={searchValue}
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

      <ClientSearch
        open={isClientSearchOpen}
        onOpenChange={setIsClientSearchOpen}
        onSelect={handleClientSelect}
      />

      <CreateClientSheet
        open={isNewClientOpen}
        onOpenChange={setIsNewClientOpen}
      />
    </Form>
  );
};
