import { Json } from "@/integrations/supabase/types";

export interface ProtocolItem {
  description: string;
  quantity: number;
  unit: string;
}

export interface ProtocolContent {
  client_name?: string;
  company_name?: string;
  project_name?: string;
  items?: ProtocolItem[];
  notes?: string;
  [key: string]: any; // Add index signature to make it compatible with Json type
}

export interface Protocol {
  id: string;
  protocol_number: string;
  client_id: string | null;
  content: ProtocolContent;
  status: 'draft' | 'sent' | 'completed';
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  manager_signature?: string;
  client_signature?: string;
  clients?: {
    name: string;
  };
}