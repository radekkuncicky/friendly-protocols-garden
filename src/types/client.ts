
export interface ClientContact {
  id: string;
  contact_type: string;
  contact_value: string;
  is_primary: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  ico: string | null;
  dic: string | null;
  address: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  last_interaction_date: string | null;
  contacts: ClientContact[];
  protocols: { count: number }[];
}
