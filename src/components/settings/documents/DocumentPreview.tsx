import { Card } from "@/components/ui/card";

interface DocumentPreviewProps {
  settings: any;
}

export function DocumentPreview({ settings }: DocumentPreviewProps) {
  return (
    <div className="aspect-[1/1.4142] w-full bg-white rounded-lg shadow-sm border p-8">
      <div className="w-full h-full relative">
        {/* Preview Header */}
        <div className="mb-8 flex justify-between items-start">
          {settings?.document_logo_position === "top-left" && (
            <div className="w-24 h-12 bg-gray-200 rounded" />
          )}
          {settings?.document_logo_position === "top-center" && (
            <div className="absolute left-1/2 -translate-x-1/2 w-24 h-12 bg-gray-200 rounded" />
          )}
          {settings?.document_logo_position === "top-right" && (
            <div className="ml-auto w-24 h-12 bg-gray-200 rounded" />
          )}
        </div>

        {/* Company Info */}
        <div className="mb-6">
          <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-40 bg-gray-100 rounded mb-1" />
          <div className="h-3 w-36 bg-gray-100 rounded" />
        </div>

        {/* Client Info */}
        {settings?.document_client_info_position === "below-company" && (
          <div className="mb-8">
            <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-100 rounded mb-1" />
            <div className="h-3 w-36 bg-gray-100 rounded" />
          </div>
        )}

        {/* Document Body */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-100 rounded" />
          <div className="h-3 w-4/6 bg-gray-100 rounded" />
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0">
          {settings?.document_logo_position === "footer" && (
            <div className="mb-4 mx-auto w-24 h-12 bg-gray-200 rounded" />
          )}
          <div className="h-px bg-gray-200 mb-2" />
          <div className="flex justify-between items-center">
            <div className="h-3 w-32 bg-gray-100 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}