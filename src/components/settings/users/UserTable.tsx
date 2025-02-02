import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  MoreVertical,
  Trash,
  UserCog,
  Check,
  X,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditRoleDialog } from "./EditRoleDialog";

interface UserTableProps {
  users: any[];
}

export const UserTable = ({ users }: UserTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Uživatel smazán",
        description: "Uživatel byl úspěšně odstraněn.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se smazat uživatele: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Opravdu chcete smazat tohoto uživatele?")) {
      deleteUserMutation.mutate(userId);
    }
  };

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
            <TableRow key={user.id}>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {user.user_roles?.[0]?.role || "worker"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge>
                  <Check className="mr-1 h-3 w-3" />
                  Aktivní
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(user.updated_at), "d. M. yyyy", {
                  locale: cs,
                })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditRoleOpen(true);
                      }}
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      Upravit roli
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Smazat uživatele
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
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