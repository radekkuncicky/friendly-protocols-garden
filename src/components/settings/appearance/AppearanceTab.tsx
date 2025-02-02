import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSettings } from "./ThemeSettings";
import { FontSettings } from "./FontSettings";
import { LayoutSettings } from "./LayoutSettings";

export const AppearanceTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Vzhled aplikace</h2>
      
      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList>
          <TabsTrigger value="theme">Téma a barvy</TabsTrigger>
          <TabsTrigger value="typography">Písmo a hustota</TabsTrigger>
          <TabsTrigger value="layout">Rozvržení</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Téma a barvy</CardTitle>
            </CardHeader>
            <CardContent>
              <ThemeSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>Písmo a hustota rozhraní</CardTitle>
            </CardHeader>
            <CardContent>
              <FontSettings />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Rozvržení a navigace</CardTitle>
            </CardHeader>
            <CardContent>
              <LayoutSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};