import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

export const UserActivityLog = () => {
  // This is a placeholder component that will be implemented
  // when we add activity logging functionality
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Historie aktivit bude implementována v další fázi.
        </div>
      </div>
    </ScrollArea>
  );
};