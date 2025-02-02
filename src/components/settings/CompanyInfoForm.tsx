import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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

const companyInfoSchema = z.object({
  company_name: z.string().min(1, "Název společnosti je povinný"),
  company_address: z.string().optional(),
  company_ico: z.string().optional(),
  company_dic: z.string().optional(),
  company_email: z.string().email("Neplatný email").optional(),
  company_phone: z.string().optional(),
  protocol_numbering_format: z.string().optional(),
});

export type CompanyInfoFormValues = z.infer<typeof companyInfoSchema>;

interface CompanyInfoFormProps {
  defaultValues?: CompanyInfoFormValues;
  onSubmit: (values: CompanyInfoFormValues) => void;
  isSubmitting?: boolean;
}

export function CompanyInfoForm({ defaultValues, onSubmit, isSubmitting }: CompanyInfoFormProps) {
  const form = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: defaultValues || {
      company_name: "",
      company_address: "",
      company_ico: "",
      company_dic: "",
      company_email: "",
      company_phone: "",
      protocol_numbering_format: "",
    },
  });

  return (
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