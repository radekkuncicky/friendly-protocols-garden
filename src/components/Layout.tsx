import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      if (roles) {
        setUserRole(roles.role);
      }
      if (profile) {
        setUserName(profile.full_name || session.user.email);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Předávací Protokoly
            </h1>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            <Link to="/">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive("/") && "bg-gray-100 dark:bg-gray-700"
                )}
              >
                <LayoutDashboard className="mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/protocols">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive("/protocols") && "bg-gray-100 dark:bg-gray-700"
                )}
              >
                <FileText className="mr-2" />
                Protokoly
              </Button>
            </Link>
            <Link to="/clients">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive("/clients") && "bg-gray-100 dark:bg-gray-700"
                )}
              >
                <Users className="mr-2" />
                Klienti
              </Button>
            </Link>
            <Link to="/templates">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  isActive("/templates") && "bg-gray-100 dark:bg-gray-700"
                )}
              >
                <LayoutTemplate className="mr-2" />
                Šablony
              </Button>
            </Link>
            {(userRole === "admin" || userRole === "manager") && (
              <Link to="/settings">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive("/settings") && "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  <Settings className="mr-2" />
                  Nastavení
                </Button>
              </Link>
            )}
          </nav>

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
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;