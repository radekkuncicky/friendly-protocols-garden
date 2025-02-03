import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Users, Settings } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Předávací Protokoly</h1>
          <p className="text-xl text-muted-foreground">
            Systém pro správu a generování předávacích protokolů
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button
            variant="outline"
            size="lg"
            className="h-32 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate("/protocols")}
          >
            <FileText className="h-8 w-8" />
            <span>Protokoly</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-32 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate("/clients")}
          >
            <Users className="h-8 w-8" />
            <span>Klienti</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-32 flex flex-col items-center justify-center space-y-2"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-8 w-8" />
            <span>Nastavení</span>
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Verze 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Index;