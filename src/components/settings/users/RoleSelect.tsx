import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RoleSelectProps {
  value: AppRole;
  onChange: (value: AppRole) => void;
}

export const RoleSelect = ({ value, onChange }: RoleSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Role</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="worker">Worker</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};