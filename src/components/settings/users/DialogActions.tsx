import { Button } from "@/components/ui/button";
interface DialogActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}
export const DialogActions = ({
  onCancel,
  isSubmitting
}: DialogActionsProps) => {
  return <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Zrušit
      </Button>
      <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-400 text-zinc-950">
        Uložit
      </Button>
    </div>;
};