import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Protocol } from "@/types/protocol";
interface StatusBadgeProps {
  status: Protocol['status'];
}
export const StatusBadge = ({
  status
}: StatusBadgeProps) => {
  switch (status) {
    case "draft":
      return <Badge variant="outline" className="flex items-center gap-1 bg-yellow-200 hover:bg-yellow-100">
          <Clock className="h-3 w-3" />
          Rozpracováno
        </Badge>;
    case "sent":
      return <Badge variant="secondary" className="flex items-center gap-1 bg-lime-500 hover:bg-lime-400">
          <AlertCircle className="h-3 w-3" />
          Odesláno
        </Badge>;
    case "completed":
      return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Dokončeno
        </Badge>;
    default:
      return null;
  }
};