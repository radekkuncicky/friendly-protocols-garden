
import { Template } from "@/types/template";

export const transformPredefinedTemplates = (predefinedTemplates: any[]): Template[] => {
  return predefinedTemplates.map(pt => ({
    id: pt.id,
    name: pt.name,
    content: {
      description: "Přednastavená šablona protokolu",
      category: "Obecné",
    },
    category: "Obecné",
    is_locked: false,
    status: 'published' as const,
    signature_required: true,
    created_at: pt.created_at,
    template_type: pt.type,
    template_path: pt.file_path,
    created_by: null,
  }));
};

export const transformUserTemplates = (userTemplates: any[]): Template[] => {
  return userTemplates.map(ut => ({
    id: ut.id,
    name: ut.name,
    description: ut.description,
    content: ut.content,
    category: ut.category,
    is_locked: false,
    status: ut.status as 'draft' | 'published',
    signature_required: true,
    created_at: ut.created_at,
    created_by: ut.created_by,
    usage_count: ut.usage_count,
    is_active: ut.is_active,
  }));
};
