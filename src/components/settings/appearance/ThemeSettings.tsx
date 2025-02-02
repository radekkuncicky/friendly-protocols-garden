import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSettings = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Tmavý režim</Label>
          <Switch
            id="dark-mode"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="system-theme">Synchronizovat se systémem</Label>
          <Switch
            id="system-theme"
            checked={theme === "system"}
            onCheckedChange={(checked) => setTheme(checked ? "system" : "light")}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Primární barva</Label>
        <RadioGroup defaultValue="purple" className="grid grid-cols-3 gap-4">
          <div>
            <RadioGroupItem
              value="purple"
              id="purple"
              className="peer sr-only"
            />
            <Label
              htmlFor="purple"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-purple-100 p-4 hover:bg-purple-200 peer-data-[state=checked]:border-purple-500 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full bg-purple-500" />
              <span className="mt-2">Fialová</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="blue"
              id="blue"
              className="peer sr-only"
            />
            <Label
              htmlFor="blue"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-blue-100 p-4 hover:bg-blue-200 peer-data-[state=checked]:border-blue-500 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full bg-blue-500" />
              <span className="mt-2">Modrá</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="green"
              id="green"
              className="peer sr-only"
            />
            <Label
              htmlFor="green"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-green-100 p-4 hover:bg-green-200 peer-data-[state=checked]:border-green-500 cursor-pointer"
            >
              <span className="w-8 h-8 rounded-full bg-green-500" />
              <span className="mt-2">Zelená</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};