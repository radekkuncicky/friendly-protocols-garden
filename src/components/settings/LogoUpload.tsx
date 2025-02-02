import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LogoUploadProps {
  currentLogo?: string | null;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LogoUpload({ currentLogo, onUpload }: LogoUploadProps) {
  return (
    <div className="space-y-4">
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Logo společnosti</h3>
          <p className="text-sm text-muted-foreground">
            Nahrajte logo společnosti pro použití v protokolech
          </p>
        </div>
        <div className="flex items-center gap-4">
          {currentLogo && (
            <img
              src={currentLogo}
              alt="Company logo"
              className="h-10 w-auto object-contain"
            />
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Nahrát logo
          </Button>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
          />
        </div>
      </div>
      <Separator />
    </div>
  );
}