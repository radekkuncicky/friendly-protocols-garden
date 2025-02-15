
export type Template = {
  id: string;
  name: string;
  description?: string;
  content: {
    description?: string;
    items?: Array<{
      name: string;
      quantity: string;
      unit: string;
    }>;
    client_info?: {
      [key: string]: string;
    };
    instructions?: string;
    notes?: string;
    header?: {
      show_logo: boolean;
      show_title: boolean;
      show_page_numbers: boolean;
      logo_position?: string;
    };
    body?: {
      layout?: string;
      font_size?: string;
    };
    footer?: {
      show_contact: boolean;
      show_disclaimer: boolean;
    };
  };
  category?: string;
  is_locked?: boolean;
  status: 'draft' | 'published';
  is_active?: boolean;
  signature_required: boolean;
  created_at: string;
  created_by: string | null;
  template_type?: string;
  template_path?: string;
  preview_image?: string;
  last_used_at?: string;
  version?: string;
  usage_count?: number;
};

export type TemplateFormData = {
  name: string;
  description: string;
  category: string;
  signature_required: boolean;
  items: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string;
  notes: string;
};
