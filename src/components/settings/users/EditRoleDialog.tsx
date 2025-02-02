import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleSelect } from "./RoleSelect";
import { DialogActions } from "./DialogActions";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface EditRoleDialogProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditRoleDialog = ({
  user,
  open,
  onOpenChange,
}: EditRoleDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<AppRole>(
    (user?.user_roles?.[0]?.role as AppRole) || "worker"
  );

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: AppRole;
    }) => {
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
      toast({
        title: "Role aktualizována",
        description: "Role uživatele byla úspěšně změněna.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se změnit roli: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    updateRoleMutation.mutate({
      userId: user.id,
      role: selectedRole,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upravit roli uživatele</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <RoleSelect value={selectedRole} onChange={setSelectedRole} />
          <DialogActions
            onCancel={() => onOpenChange(false)}
            isSubmitting={updateRoleMutation.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};