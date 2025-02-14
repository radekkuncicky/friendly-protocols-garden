import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "./UserTable";
import { InviteUserDialog } from "./InviteUserDialog";
export const UserRolesTab = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const {
    data: users,
    isLoading
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // First fetch profiles
      const {
        data: profiles,
        error: profilesError
      } = await supabase.from("profiles").select("*");
      if (profilesError) throw profilesError;

      // Then fetch user roles
      const {
        data: userRoles,
        error: rolesError
      } = await supabase.from("user_roles").select("*");
      if (rolesError) throw rolesError;

      // Combine the data
      return profiles.map(profile => ({
        ...profile,
        user_roles: userRoles.filter(role => role.user_id === profile.id)
      }));
    }
  });
  if (isLoading) {
    return <div>Načítání...</div>;
  }
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Správa uživatelů a rolí</h2>
        <Button onClick={() => setIsInviteDialogOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-zinc-950">
          <UserPlus className="mr-2 h-4 w-4" />
          Pozvat uživatele
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uživatelé</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable users={users || []} />
        </CardContent>
      </Card>

      <InviteUserDialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />
    </div>;
};