import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "./UserTable";
import { InviteUserDialog } from "./InviteUserDialog";
import { UserActivityLog } from "./UserActivityLog";

export const UserRolesTab = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          *,
          user_roles (
            role
          )
        `);

      if (profilesError) throw profilesError;
      return profiles;
    },
  });

  if (isLoading) {
    return <div>Načítání...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Správa uživatelů a rolí</h2>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Pozvat uživatele
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Uživatelé</CardTitle>
            </CardHeader>
            <CardContent>
              <UserTable users={users || []} />
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Historie aktivit</CardTitle>
            </CardHeader>
            <CardContent>
              <UserActivityLog />
            </CardContent>
          </Card>
        </div>
      </div>

      <InviteUserDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
      />
    </div>
  );
};