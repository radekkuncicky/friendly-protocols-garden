
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { DialogActions } from "@/components/settings/users/DialogActions";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NewInvoiceFormProps {
  onSuccess: () => void;
}

interface FormValues {
  invoiceNumber: string;
  supplierId: string;
  priceExclVat: number;
  priceInclVat: number;
  vatAmount: number;
  dueDate: Date;
  status: "new" | "paid" | "problem";
  projectId: string;
  technologyId: string;
  file: FileList;
}

export const NewInvoiceForm = ({ onSuccess }: NewInvoiceFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      status: "new",
      priceExclVat: 0,
      priceInclVat: 0,
      vatAmount: 0
    }
  });

  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    }
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    }
  });

  const { data: technologies } = useQuery({
    queryKey: ["project-technologies", selectedProjectId],
    queryFn: async () => {
      if (!selectedProjectId) return [];
      const { data, error } = await supabase
        .from("project_technologies")
        .select("*")
        .eq("project_id", selectedProjectId)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProjectId
  });

  const calculateVAT = (value: string, type: "excl" | "incl") => {
    const numValue = parseFloat(value) || 0;
    if (type === "excl") {
      const vat = numValue * 0.21;
      const total = numValue + vat;
      form.setValue("vatAmount", Number(vat.toFixed(2)));
      form.setValue("priceInclVat", Number(total.toFixed(2)));
    } else {
      const basePrice = numValue / 1.21;
      const vat = numValue - basePrice;
      form.setValue("priceExclVat", Number(basePrice.toFixed(2)));
      form.setValue("vatAmount", Number(vat.toFixed(2)));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Soubor je příliš velký. Maximální velikost je 5MB.");
        return;
      }
      if (!["application/pdf"].includes(file.type)) {
        alert("Pouze PDF soubory jsou povoleny.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      let filePath = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("invoices")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        filePath = fileName;
      }

      const { error: insertError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: values.invoiceNumber,
          supplier_id: values.supplierId,
          price_excl_vat: values.priceExclVat,
          price_incl_vat: values.priceInclVat,
          vat_amount: values.vatAmount,
          due_date: values.dueDate,
          status: values.status,
          project_id: values.projectId,
          technology_id: values.technologyId,
          file_path: filePath,
          file_name: selectedFile?.name
        });

      if (insertError) throw insertError;

      onSuccess();
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Chyba při ukládání faktury.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Číslo faktury</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplierId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dodavatel</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte dodavatele" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers?.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceExclVat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cena bez DPH</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    calculateVAT(e.target.value, "excl");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceInclVat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cena s DPH</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    calculateVAT(e.target.value, "incl");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vatAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DPH</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Datum splatnosti</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Vyberte datum</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stav</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">Nová</SelectItem>
                  <SelectItem value="paid">Zaplacená</SelectItem>
                  <SelectItem value="problem">Problém</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projekt</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedProjectId(value);
                  form.setValue("technologyId", ""); // Reset technology when project changes
                }} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte projekt" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects?.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="technologyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologie</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProjectId}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte technologii" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {technologies?.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Soubor faktury (PDF, max 5MB)</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <DialogActions
          onCancel={() => onSuccess()}
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
};
