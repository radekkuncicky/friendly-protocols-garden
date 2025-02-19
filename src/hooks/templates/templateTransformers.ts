
import { Template } from "@/types/template";

export const transformPredefinedTemplates = (templates: any[]): Template[] => {
  return templates.map(pt => ({
    id: pt.id,
    name: pt.name,
    content: {
      description: "Přednastavená šablona protokolu",
      category: "Obecné",
    },
    category: pt.type || "Obecné",
    is_locked: false,
    status: 'published' as const,
    signature_required: true,
    created_at: pt.created_at,
    template_type: pt.type,
    template_path: pt.file_path,
    created_by: null,
  }));
};

export const transformUserTemplates = (templates: any[]): Template[] => {
  console.log("Transforming user templates:", templates);
  
  return templates.map(ut => ({
    id: ut.id,
    name: ut.name,
    description: ut.description,
    content: ut.content || {
      description: ut.description || "",
      category: ut.category || "Obecné",
      items: [],
      notes: "",
    },
    category: ut.category || "Obecné",
    is_locked: !ut.is_active,
    status: ut.status as 'draft' | 'published',
    signature_required: true,
    created_at: ut.created_at,
    created_by: ut.created_by,
    usage_count: ut.usage_count || 0,
    is_active: ut.is_active !== false,
  }));
};
