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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSelect } from "./RoleSelect";
import { DialogActions } from "./DialogActions";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InviteUserDialog = ({
  open,
  onOpenChange,
}: InviteUserDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AppRole>("worker");

  const inviteUserMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: AppRole }) => {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);
      if (error) throw error;

      if (data?.user?.id) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: data.user.id, role });

        if (roleError) throw roleError;
      }

      return data;
    },
    onSuccess: () => {
      onOpenChange(false);
      setEmail("");
      setRole("worker");
      toast({
        title: "Pozvánka odeslána",
        description: "Uživatel byl úspěšně pozván.",
      });
    },
    onError: (error) => {
      toast({
        title: "Chyba",
        description: "Nepodařilo se pozvat uživatele: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inviteUserMutation.mutate({ email, role });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pozvat nového uživatele</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>E-mail</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jan.novak@example.com"
              required
            />
          </div>

          <RoleSelect value={role} onChange={setRole} />

          <DialogActions
            onCancel={() => onOpenChange(false)}
            isSubmitting={inviteUserMutation.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};