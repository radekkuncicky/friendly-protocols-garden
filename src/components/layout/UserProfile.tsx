import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileProps {
  userName: string | null;
  userRole: string | null;
}

export const UserProfile = ({ userName, userRole }: UserProfileProps) => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Odhlášení úspěšné",
        description: "Byli jste úspěšně odhlášeni.",
      });
    } catch (error: any) {
      toast({
        title: "Chyba",
        description: "Při odhlašování došlo k chybě.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {userName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {userRole}
          </p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Odhlásit se
        </Button>
      </div>
    </div>
  );
};