import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav } from "./layout/SidebarNav";
import { UserProfile } from "./layout/UserProfile";
const Layout = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      const {
        data: roles
      } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single();
      const {
        data: profile
      } = await supabase.from("profiles").select("full_name").eq("id", session.user.id).single();
      if (roles) {
        setUserRole(roles.role);
      }
      if (profile) {
        setUserName(profile.full_name || session.user.email);
      }
    };
    checkAuth();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  return <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="h-full flex flex-col">
          <div className="p-6 mx-0">
            <h1 className="text-amber-500 font-extrabold text-xl">
              Předávací Protokoly
            </h1>
          </div>
          
          <SidebarNav userRole={userRole} />
          <UserProfile userName={userName} userRole={userRole} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>;
};
export default Layout;