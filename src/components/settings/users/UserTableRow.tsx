import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { Check } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserTableActions } from "./UserTableActions";
interface UserTableRowProps {
  user: any;
  onEditRole: (user: any) => void;
}
export const UserTableRow = ({
  user,
  onEditRole
}: UserTableRowProps) => {
  return <TableRow>
      <TableCell>{user.full_name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {user.user_roles?.[0]?.role || "worker"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className="bg-lime-500 hover:bg-lime-400">
          <Check className="mr-1 h-3 w-3" />
          Aktivní
        </Badge>
      </TableCell>
      <TableCell>
        {format(new Date(user.updated_at), "d. M. yyyy", {
        locale: cs
      })}
      </TableCell>
      <TableCell>
        <UserTableActions user={user} onEditRole={onEditRole} />
      </TableCell>
    </TableRow>;
};