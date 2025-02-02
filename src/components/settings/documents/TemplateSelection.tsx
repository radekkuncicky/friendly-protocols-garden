import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, Layout, Minimize } from "lucide-react";

interface TemplateSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function TemplateSelection({ value, onChange }: TemplateSelectionProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="grid grid-cols-3 gap-4"
    >
      <Label
        htmlFor="standard"
        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
      >
        <RadioGroupItem value="standard" id="standard" className="sr-only" />
        <Layout className="mb-2 h-6 w-6" />
        <span className="text-sm font-medium">Standardní</span>
      </Label>

      <Label
        htmlFor="classic"
        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
      >
        <RadioGroupItem value="classic" id="classic" className="sr-only" />
        <FileText className="mb-2 h-6 w-6" />
        <span className="text-sm font-medium">Klasický</span>
      </Label>

      <Label
        htmlFor="minimalist"
        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
      >
        <RadioGroupItem value="minimalist" id="minimalist" className="sr-only" />
        <Minimize className="mb-2 h-6 w-6" />
        <span className="text-sm font-medium">Minimalistický</span>
      </Label>
    </RadioGroup>
  );
}