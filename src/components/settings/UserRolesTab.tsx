
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserTable } from "./users/UserTable";

export function UserRolesTab() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // First fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
      if (profilesError) throw profilesError;

      // Then fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Správa uživatelů</CardTitle>
          <CardDescription>
            Spravujte uživatelské účty a jejich role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable users={users || []} />
        </CardContent>
      </Card>
    </div>
  );
}
