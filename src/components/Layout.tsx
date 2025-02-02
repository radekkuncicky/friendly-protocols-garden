import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
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

const Layout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string | null>(null);

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

      if (roles) {
        setUserRole(roles.role);
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

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Předávací Protokoly</h1>
        </div>
        <nav className="space-y-2">
          <Link to="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            >
              <LayoutDashboard className="mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link to="/protocols">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            >
              <FileText className="mr-2" />
              Protokoly
            </Button>
          </Link>
          <Link to="/clients">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            >
              <Users className="mr-2" />
              Klienti
            </Button>
          </Link>
          <Link to="/templates">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            >
              <LayoutTemplate className="mr-2" />
              Šablony
            </Button>
          </Link>
          {(userRole === "admin" || userRole === "manager") && (
            <Link to="/settings">
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
              >
                <Settings className="mr-2" />
                Nastavení
              </Button>
            </Link>
          )}
        </nav>
        <div className="absolute bottom-4 w-56">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:text-white hover:bg-gray-700"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2" />
            Odhlásit se
          </Button>
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