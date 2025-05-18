import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav } from "./layout/SidebarNav";
import { UserProfile } from "./layout/UserProfile";

const Layout = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>("admin"); // Default role to admin
  const [userName, setUserName] = useState<string | null>("Developer"); // Default username

  useEffect(() => {
    // Bypass authentication check and set default values
    console.log("Authentication check bypassed. Using default admin role.");
    
    // Keep the auth state change listener to handle actual sign-outs
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
              NANPTO protokoly
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
