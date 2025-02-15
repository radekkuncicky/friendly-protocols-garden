
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface CompanyBasicInfoProps {
  form: UseFormReturn<{
    company_name: string;
    company_address?: string;
    company_ico?: string;
    company_dic?: string;
    company_email?: string;
    company_phone?: string;
  }>;
}

export function CompanyBasicInfo({ form }: CompanyBasicInfoProps) {
  return (
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
    </div>
  );
}
