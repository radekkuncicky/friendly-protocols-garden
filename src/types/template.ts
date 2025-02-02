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
};