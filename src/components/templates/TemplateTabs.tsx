
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type TemplateTab = "mine" | "all" | "all-protocols";

interface TemplatesTabsProps {
  onTabChange: (value: TemplateTab) => void;
}

export const TemplateTabs = ({ onTabChange }: TemplatesTabsProps) => {
  const [activeTab, setActiveTab] = useState<TemplateTab>("all");

  const handleTabChange = (value: TemplateTab) => {
    setActiveTab(value);
    onTabChange(value);
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => handleTabChange(value as TemplateTab)}
        className="w-full"
      >
        <TabsList className="w-full justify-start">
          <TabsTrigger
            value="all"
            className={cn(
              "flex-1 max-w-[200px]",
              activeTab === "all" && "bg-primary text-primary-foreground"
            )}
          >
            Všechny šablony
          </TabsTrigger>
          <TabsTrigger
            value="mine"
            className={cn(
              "flex-1 max-w-[200px]",
              activeTab === "mine" && "bg-primary text-primary-foreground"
            )}
          >
            Moje šablony
          </TabsTrigger>
          <TabsTrigger
            value="all-protocols"
            className={cn(
              "flex-1 max-w-[200px]",
              activeTab === "all-protocols" && "bg-primary text-primary-foreground"
            )}
          >
            Všechny protokoly
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
