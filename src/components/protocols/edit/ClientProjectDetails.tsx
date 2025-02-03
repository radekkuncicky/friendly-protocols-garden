import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ProtocolContent } from "@/types/protocol";

interface ClientProjectDetailsProps {
  content: ProtocolContent;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  setContent: (content: ProtocolContent) => void;
}

export const ClientProjectDetails = ({ content, date, setDate, setContent }: ClientProjectDetailsProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Klient a projekt</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="client_name">Jméno klienta</Label>
        <Input
          id="client_name"
          value={content.client_name || ""}
          onChange={(e) => setContent({ ...content, client_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company_name">Název společnosti</Label>
        <Input
          id="company_name"
          value={content.company_name || ""}
          onChange={(e) => setContent({ ...content, company_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project_name">Název projektu</Label>
        <Input
          id="project_name"
          value={content.project_name || ""}
          onChange={(e) => setContent({ ...content, project_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Datum protokolu</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: cs }) : <span>Vybrat datum</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={cs}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </div>
);