
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Registrace úspěšná",
          description: "Nyní se můžete přihlásit.",
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          // Handle specific error cases
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Email nebyl potvrzen. Zkontrolujte prosím svou emailovou schránku nebo se zaregistrujte znovu.");
          }
          throw error;
        }
        navigate("/");
      }
    } catch (error: any) {
      let errorMessage = error.message;
      
      // Map common error messages to user-friendly Czech translations
      if (errorMessage.includes("Invalid login credentials")) {
        errorMessage = "Nesprávné přihlašovací údaje";
      } else if (errorMessage.includes("User already registered")) {
        errorMessage = "Uživatel s tímto emailem již existuje";
      }

      toast({
        title: "Chyba",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Bypass authentication for testing
  const bypassAuth = async () => {
    setIsLoading(true);
    try {
      // Skip actual authentication, simulate session directly
      // This doesn't create a real session but tricks app logic
      navigate("/");
      toast({
        title: "Rychlé přihlášení",
        description: "Přihlášen jako testovací uživatel (admin)",
      });
    } catch (error: any) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se obejít přihlášení",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "Registrace" : "Přihlášení"}
        </h1>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading
              ? "Načítání..."
              : isSignUp
              ? "Registrovat"
              : "Přihlásit se"}
          </Button>
        </form>
        
        {/* Test bypass button */}
        <div className="mt-4">
          <Button 
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950" 
            onClick={bypassAuth}
            disabled={isLoading}
          >
            Rychlé přihlášení pro testování
          </Button>
        </div>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          {isSignUp ? "Již máte účet?" : "Nemáte účet?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline"
          >
            {isSignUp ? "Přihlásit se" : "Registrovat se"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
