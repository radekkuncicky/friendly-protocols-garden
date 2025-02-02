import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const settingsFormSchema = z.object({
  company_name: z.string().min(1, "Název společnosti je povinný"),
  company_address: z.string().optional(),
  company_ico: z.string().optional(),
  company_dic: z.string().optional(),
  company_email: z.string().email("Neplatný email").optional(),
  company_phone: z.string().optional(),
  protocol_numbering_format: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Check if user has admin role
  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data?.role;
    },
  });

  // Redirect non-admin users
  useEffect(() => {
    if (userRole && userRole !== "admin") {
      navigate("/");
      toast({
        title: "Přístup odepřen",
        description: "Pouze administrátoři mají přístup k nastavení.",
        variant: "destructive",
      });
    }
  }, [userRole, navigate, toast]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      // Update settings with new logo URL
      const { error: updateError } = await supabase
        .from('settings')
        .update({ company_logo: publicUrl })
        .single();

      if (updateError) throw updateError;

      // Invalidate settings query to refresh data
      queryClient.invalidateQueries({ queryKey: ['settings'] });

      toast({
        title: "Logo nahráno",
        description: "Logo společnosti bylo úspěšně aktualizováno.",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Chyba při nahrávání",
        description: "Nepodařilo se nahrát logo. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      company_name: "",
      company_address: "",
      company_ico: "",
      company_dic: "",
      company_email: "",
      company_phone: "",
      protocol_numbering_format: "",
    },
    values: settings || undefined,
  });

  const updateMutation = useMutation({
    mutationFn: async (values: SettingsFormValues) => {
      const { data, error } = await supabase
        .from("settings")
        .upsert(values)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Nastavení uloženo",
        description: "Změny byly úspěšně uloženy.",
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

  const onSubmit = (values: SettingsFormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return <div>Načítání...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Nastavení</h1>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company">Firemní údaje</TabsTrigger>
          <TabsTrigger value="users">Uživatelé a role</TabsTrigger>
          <TabsTrigger value="appearance">Vzhled</TabsTrigger>
          <TabsTrigger value="documents">Dokumenty</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Firemní údaje</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Název společnosti</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresa</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_ico"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IČO</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_dic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DIČ</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Logo společnosti</h3>
                        <p className="text-sm text-muted-foreground">
                          Nahrajte logo společnosti pro použití v protokolech
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {settings?.company_logo && (
                          <img
                            src={settings.company_logo}
                            alt="Company logo"
                            className="h-10 w-auto object-contain"
                          />
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Nahrát logo
                        </Button>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </div>
                    </div>
                    <Separator />
                  </div>

                  <FormField
                    control={form.control}
                    name="protocol_numbering_format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Formát číslování protokolů</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="PP-{YYYY}-{NUM}" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="w-full md:w-auto"
                    >
                      {updateMutation.isPending ? "Ukládání..." : "Uložit změny"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Uživatelé a role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Správa uživatelů a rolí bude implementována v další fázi.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Vzhled aplikace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nastavení vzhledu bude implementováno v další fázi.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Nastavení dokumentů</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nastavení dokumentů bude implementováno v další fázi.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;