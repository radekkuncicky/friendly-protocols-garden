
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyBasicInfo } from "./company/CompanyBasicInfo";
import { CompanyContact } from "./company/CompanyContact";
import { CompanyIdentification } from "./company/CompanyIdentification";
import { Button } from "@/components/ui/button";
import { useSettingsData } from "@/hooks/useSettingsData";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";

const companyFormSchema = z.object({
  company_name: z.string().min(1, "Název společnosti je povinný"),
  company_address: z.string().optional(),
  company_ico: z.string().optional(),
  company_dic: z.string().optional(),
  company_email: z.string().email("Neplatný email").optional(),
  company_phone: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export function CompanyTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { settings, isLoading } = useSettingsData();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      company_name: settings?.company_name || "",
      company_address: settings?.company_address || "",
      company_ico: settings?.company_ico || "",
      company_dic: settings?.company_dic || "",
      company_email: settings?.company_email || "",
      company_phone: settings?.company_phone || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: CompanyFormValues) => {
      const { error } = await supabase
        .from("settings")
        .update(values)
        .eq("id", settings?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Změny uloženy",
        description: "Nastavení firmy bylo úspěšně aktualizováno.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se uložit změny: " + error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CompanyFormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return <div>Načítání...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nastavení firmy</CardTitle>
          <CardDescription>
            Správa informací o vaší firmě
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CompanyBasicInfo form={form} />
              <CompanyIdentification form={form} />
              <CompanyContact form={form} />
              
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Ukládání..." : "Uložit změny"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
