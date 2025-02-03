import { useRef, useEffect } from "react";
import SignaturePad from "signature_pad";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SignatureCanvasProps {
  label: string;
  onSave: (signature: string) => void;
}

export const SignatureCanvas = ({ label, onSave }: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current);
    }

    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.clear();
      }
    };
  }, []);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  const handleSave = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const signatureData = signaturePadRef.current.toDataURL();
      onSave(signatureData);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border rounded-lg p-4 space-y-4">
        <canvas
          ref={canvasRef}
          className="border rounded w-full h-40 bg-white"
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleClear}>
            Vymazat
          </Button>
          <Button type="button" onClick={handleSave}>
            Uložit podpis
          </Button>
        </div>
      </div>
    </div>
  );
};