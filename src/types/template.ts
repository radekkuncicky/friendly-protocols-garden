
export type Template = {
  id: string;
  name: string;
  content: any;
  category?: string;
  is_locked?: boolean;
  status: 'draft' | 'published';
  signature_required: boolean;
  created_at: string;
  created_by: string | null;
  template_type?: string;
  template_path?: string;
  preview_image?: string;
  last_used_at?: string;
  version?: string;
};
