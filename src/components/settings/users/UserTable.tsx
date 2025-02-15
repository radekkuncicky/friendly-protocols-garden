
import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableRow } from "./UserTableRow";
import { EditRoleDialog } from "./EditRoleDialog";

interface User {
  id: string;
  full_name: string;
  email: string;
  updated_at: string;
  user_roles: Array<{
    role: string;
    user_id: string;
  }>;
}

interface UserTableProps {
  users: User[];
}

export const UserTable = ({ users }: UserTableProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jméno</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Poslední aktivita</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onEditRole={(user) => {
                setSelectedUser(user);
                setIsEditRoleOpen(true);
              }}
            />
          ))}
        </TableBody>
      </Table>

      <EditRoleDialog
        user={selectedUser}
        open={isEditRoleOpen}
        onOpenChange={setIsEditRoleOpen}
      />
    </>
  );
};
