export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_description: string
          action_type: string
          affected_object_id: string | null
          affected_object_type: string
          created_at: string
          details: Json | null
          device_info: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action_description: string
          action_type: string
          affected_object_id?: string | null
          affected_object_type: string
          created_at?: string
          details?: Json | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action_description?: string
          action_type?: string
          affected_object_id?: string | null
          affected_object_type?: string
          created_at?: string
          details?: Json | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      client_activity_logs: {
        Row: {
          action_type: string
          client_id: string | null
          created_at: string | null
          description: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          client_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          client_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_activity_logs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          created_at: string
          created_by: string | null
          dic: string | null
          email: string | null
          ico: string | null
          id: string
          last_interaction_date: string | null
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          dic?: string | null
          email?: string | null
          ico?: string | null
          id?: string
          last_interaction_date?: string | null
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          created_by?: string | null
          dic?: string | null
          email?: string | null
          ico?: string | null
          id?: string
          last_interaction_date?: string | null
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      protocols: {
        Row: {
          client_id: string | null
          client_signature: string | null
          content: Json
          created_at: string
          created_by: string | null
          id: string
          items_order: Json | null
          manager_signature: string | null
          protocol_number: string
          sent_at: string | null
          status: string
          template_file_path: string | null
          template_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          client_id?: string | null
          client_signature?: string | null
          content: Json
          created_at?: string
          created_by?: string | null
          id?: string
          items_order?: Json | null
          manager_signature?: string | null
          protocol_number: string
          sent_at?: string | null
          status?: string
          template_file_path?: string | null
          template_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          client_id?: string | null
          client_signature?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          items_order?: Json | null
          manager_signature?: string | null
          protocol_number?: string
          sent_at?: string | null
          status?: string
          template_file_path?: string | null
          template_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "protocols_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocols_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          company_address: string | null
          company_dic: string | null
          company_email: string | null
          company_ico: string | null
          company_logo: string | null
          company_name: string | null
          company_phone: string | null
          document_body_config: Json | null
          document_client_info_position: string | null
          document_company_info_position: string | null
          document_footer_config: Json | null
          document_header_config: Json | null
          document_logo_position: string | null
          document_template_type: string | null
          id: string
          protocol_numbering_format: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          company_address?: string | null
          company_dic?: string | null
          company_email?: string | null
          company_ico?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_phone?: string | null
          document_body_config?: Json | null
          document_client_info_position?: string | null
          document_company_info_position?: string | null
          document_footer_config?: Json | null
          document_header_config?: Json | null
          document_logo_position?: string | null
          document_template_type?: string | null
          id?: string
          protocol_numbering_format?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          company_address?: string | null
          company_dic?: string | null
          company_email?: string | null
          company_ico?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_phone?: string | null
          document_body_config?: Json | null
          document_client_info_position?: string | null
          document_company_info_position?: string | null
          document_footer_config?: Json | null
          document_header_config?: Json | null
          document_logo_position?: string | null
          document_template_type?: string | null
          id?: string
          protocol_numbering_format?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          category: string | null
          content: Json
          created_at: string
          created_by: string | null
          id: string
          is_locked: boolean | null
          name: string
          signature_required: boolean
          status: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_locked?: boolean | null
          name: string
          signature_required?: boolean
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_locked?: boolean | null
          name?: string
          signature_required?: boolean
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_minimum_role: {
        Args: {
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "worker"
      document_template_type: "standard" | "classic" | "minimalist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
