
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { CompanyFormValues } from "@/types/company";

interface CompanyIdentificationProps {
  form: UseFormReturn<CompanyFormValues>;
}

export function CompanyIdentification({ form }: CompanyIdentificationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
}
