
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyBasicInfo } from "./company/CompanyBasicInfo";
import { CompanyContact } from "./company/CompanyContact";
import { CompanyIdentification } from "./company/CompanyIdentification";

export function CompanyTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nastavení firmy</CardTitle>
          <CardDescription>
            Správa informací o vaší firmě
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CompanyBasicInfo />
          <CompanyIdentification />
          <CompanyContact />
        </CardContent>
      </Card>
    </div>
  );
}
