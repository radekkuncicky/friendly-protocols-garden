import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ClientsFilters = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtry</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <label>Řadit podle</label>
          <Select defaultValue="created_at">
            <SelectTrigger>
              <SelectValue placeholder="Vyberte řazení" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Datum vytvoření</SelectItem>
              <SelectItem value="name">Název</SelectItem>
              <SelectItem value="protocols">Počet protokolů</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button variant="ghost">Resetovat</Button>
        <Button>Použít filtry</Button>
      </CardFooter>
    </Card>
  );
};