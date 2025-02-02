import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { MoreVertical, Trash, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserTableActionsProps {
  user: any;
  onEditRole: (user: any) => void;
}

export const UserTableActions = ({ user, onEditRole }: UserTableActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditRole(user)}>
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
  );
};