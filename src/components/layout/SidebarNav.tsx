import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  userRole: string | null;
}

export const SidebarNav = ({ userRole }: SidebarNavProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
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
  );
};