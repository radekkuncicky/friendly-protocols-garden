import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ProtocolHeader } from "./ProtocolHeader";
import { ClientProjectDetails } from "./ClientProjectDetails";
import { ProtocolItems } from "./ProtocolItems";
import { SignatureCanvas } from "./SignatureCanvas";
import { ProtocolActions } from "./ProtocolActions";
import { Protocol, ProtocolContent } from "@/types/protocol";

interface EditProtocolFormProps {
  protocol: Protocol;
  content: ProtocolContent;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  setContent: (content: ProtocolContent) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onManagerSignature: (signature: string) => void;
  onClientSignature: (signature: string) => void;
}

export const EditProtocolForm = ({
  protocol,
  content,
  date,
  setDate,
  setContent,
  onSubmit,
  onClose,
  onManagerSignature,
  onClientSignature,
}: EditProtocolFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProtocolHeader
        protocolNumber={protocol.protocol_number}
        status={protocol.status}
        updatedAt={protocol.updated_at}
      />

      <ClientProjectDetails
        content={content}
        date={date}
        setDate={setDate}
        setContent={setContent}
      />

      <Separator />

      <ProtocolItems
        content={content}
        setContent={setContent}
      />

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Poznámky</h3>
        <Textarea
          value={content.notes || ""}
          onChange={(e) => setContent({ ...content, notes: e.target.value })}
          rows={4}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Podpisy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SignatureCanvas
            label="Podpis manažera"
            onSave={onManagerSignature}
          />
          <SignatureCanvas
            label="Podpis klienta"
            onSave={onClientSignature}
          />
        </div>
      </div>

      <ProtocolActions
        onClose={onClose}
        onSubmit={onSubmit}
        protocol={protocol}
      />
    </form>
  );
};