import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProtocolsHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Protokoly</h1>
      <Button onClick={() => console.log("Create new protocol")}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nový protokol
      </Button>
    </div>
  );
};