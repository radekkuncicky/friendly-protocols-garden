
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CompanyBasicInfo } from "./company/CompanyBasicInfo";
import { CompanyIdentification } from "./company/CompanyIdentification";
import { CompanyContact } from "./company/CompanyContact";
import type { CompanyFormValues } from "@/types/company";

const companyInfoSchema = z.object({
  company_name: z.string().min(1, "Název společnosti je povinný"),
  company_address: z.string().optional(),
  company_ico: z.string().optional(),
  company_dic: z.string().optional(),
  company_email: z.string().email("Neplatný email").optional(),
  company_phone: z.string().optional(),
  protocol_numbering_format: z.string().optional(),
});

interface CompanyInfoFormProps {
  defaultValues?: CompanyFormValues;
  onSubmit: (values: CompanyFormValues) => void;
  isSubmitting?: boolean;
}

export function CompanyInfoForm({ defaultValues, onSubmit, isSubmitting }: CompanyInfoFormProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      company_name: defaultValues?.company_name || "",
      company_address: defaultValues?.company_address || "",
      company_ico: defaultValues?.company_ico || "",
      company_dic: defaultValues?.company_dic || "",
      company_email: defaultValues?.company_email || "",
      company_phone: defaultValues?.company_phone || "",
      protocol_numbering_format: defaultValues?.protocol_numbering_format || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CompanyBasicInfo form={form} />
        <CompanyIdentification form={form} />
        <CompanyContact form={form} />

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
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? "Ukládání..." : "Uložit změny"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
