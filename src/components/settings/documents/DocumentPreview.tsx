
import { Card } from "@/components/ui/card";
import { useDraggable } from "@/hooks/useDraggable";
import { cn } from "@/lib/utils";
import { Logo, FileText, User, LayoutGrid } from "lucide-react";

interface DocumentPreviewProps {
  settings: any;
  onDragEnd?: (result: any) => void;
}

export function DocumentPreview({ settings, onDragEnd }: DocumentPreviewProps) {
  const { isDragging, draggedElement } = useDraggable();

  const getDropIndicatorPosition = (position: string) => {
    if (!isDragging) return "";
    if (draggedElement?.dataset?.type !== position) return "";
    return "bg-primary/20 border-2 border-dashed border-primary";
  };

  return (
    <div className="sticky top-6">
      <h3 className="text-lg font-medium mb-4">Náhled dokumentu</h3>
      <div className="aspect-[1/1.4142] w-full bg-white rounded-lg shadow-sm border p-8">
        <div className="w-full h-full relative">
          {/* Preview Header */}
          <div className={cn(
            "mb-8 flex justify-between items-start transition-colors",
            getDropIndicatorPosition("header")
          )}>
            {settings?.document_logo_position === "top-left" && (
              <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
                <Logo className="h-6 w-6 text-gray-400" />
              </div>
            )}
            {settings?.document_logo_position === "top-center" && (
              <div className="absolute left-1/2 -translate-x-1/2 w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
                <Logo className="h-6 w-6 text-gray-400" />
              </div>
            )}
            {settings?.document_logo_position === "top-right" && (
              <div className="ml-auto w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
                <Logo className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className={cn(
            "mb-6 p-4 border border-transparent",
            getDropIndicatorPosition("company-info")
          )}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
            <div className="h-3 w-40 bg-gray-100 rounded mb-1" />
            <div className="h-3 w-36 bg-gray-100 rounded" />
          </div>

          {/* Client Info */}
          {settings?.document_client_info_position === "below-company" && (
            <div className={cn(
              "mb-8 p-4 border border-transparent",
              getDropIndicatorPosition("client-info")
            )}>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-gray-400" />
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
              <div className="h-3 w-32 bg-gray-100 rounded mb-1" />
              <div className="h-3 w-36 bg-gray-100 rounded" />
            </div>
          )}

          {/* Document Body */}
          <div className={cn(
            "space-y-4 p-4 border border-transparent",
            getDropIndicatorPosition("body")
          )}>
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-gray-400" />
              <div className="h-4 w-full bg-gray-200 rounded" />
            </div>
            <div className="h-3 w-5/6 bg-gray-100 rounded" />
            <div className="h-3 w-4/6 bg-gray-100 rounded" />
          </div>

          {/* Footer */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-4 border border-transparent",
            getDropIndicatorPosition("footer")
          )}>
            {settings?.document_logo_position === "footer" && (
              <div className="mb-4 mx-auto w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
                <Logo className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="h-px bg-gray-200 mb-2" />
            <div className="flex justify-between items-center">
              <div className="h-3 w-32 bg-gray-100 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
