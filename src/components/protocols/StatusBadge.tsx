import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "draft":
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Rozpracováno
        </Badge>
      );
    case "sent":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Odesláno
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Dokončeno
        </Badge>
      );
    default:
      return null;
  }
};