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
      client_contacts: {
        Row: {
          client_id: string | null
          contact_type: string | null
          contact_value: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          contact_type?: string | null
          contact_value: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          contact_type?: string | null
          contact_value?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
      email_log: {
        Row: {
          attachments: Json | null
          email_body: string | null
          email_subject: string | null
          error_message: string | null
          id: string
          protocol_id: string | null
          retry_count: number | null
          sent_at: string | null
          sent_by: string | null
          sent_to: string
          status: Database["public"]["Enums"]["email_status"] | null
        }
        Insert: {
          attachments?: Json | null
          email_body?: string | null
          email_subject?: string | null
          error_message?: string | null
          id?: string
          protocol_id?: string | null
          retry_count?: number | null
          sent_at?: string | null
          sent_by?: string | null
          sent_to: string
          status?: Database["public"]["Enums"]["email_status"] | null
        }
        Update: {
          attachments?: Json | null
          email_body?: string | null
          email_subject?: string | null
          error_message?: string | null
          id?: string
          protocol_id?: string | null
          retry_count?: number | null
          sent_at?: string | null
          sent_by?: string | null
          sent_to?: string
          status?: Database["public"]["Enums"]["email_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "email_log_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "protocols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_protocol"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          created_by: string | null
          due_date: string
          file_name: string | null
          file_path: string | null
          id: string
          invoice_number: string
          price_excl_vat: number
          price_incl_vat: number
          project_id: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          supplier_id: string | null
          technology_id: string | null
          updated_at: string
          updated_by: string | null
          vat_amount: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          due_date: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          invoice_number: string
          price_excl_vat: number
          price_incl_vat: number
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          supplier_id?: string | null
          technology_id?: string | null
          updated_at?: string
          updated_by?: string | null
          vat_amount: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          due_date?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          invoice_number?: string
          price_excl_vat?: number
          price_incl_vat?: number
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          supplier_id?: string | null
          technology_id?: string | null
          updated_at?: string
          updated_by?: string | null
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "project_technologies"
            referencedColumns: ["id"]
          },
        ]
      }
      predefined_templates: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
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
      project_technologies: {
        Row: {
          created_at: string
          id: string
          name: string
          project_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          project_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      protocol_numbers: {
        Row: {
          created_at: string | null
          id: string
          last_number: number
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_number: number
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          id?: string
          last_number?: number
          updated_at?: string | null
          year?: number
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
          status: Database["public"]["Enums"]["protocol_status"]
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
          status?: Database["public"]["Enums"]["protocol_status"]
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
          status?: Database["public"]["Enums"]["protocol_status"]
          template_file_path?: string | null
          template_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_template"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocols_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "user_templates"
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
          document_template: string | null
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
          document_template?: string | null
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
          document_template?: string | null
          document_template_type?: string | null
          id?: string
          protocol_numbering_format?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      settings_templates: {
        Row: {
          created_at: string | null
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id: string
          is_default: boolean | null
          updated_at: string | null
          upload_date: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id?: string
          is_default?: boolean | null
          updated_at?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_size?: number
          file_type?: string
          file_url?: string
          filename?: string
          id?: string
          is_default?: boolean | null
          updated_at?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_templates_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          created_at: string
          dic: string | null
          ico: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dic?: string | null
          ico?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dic?: string | null
          ico?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_templates: {
        Row: {
          configuration: Json
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          type: Database["public"]["Enums"]["system_template_type"]
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          type: Database["public"]["Enums"]["system_template_type"]
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["system_template_type"]
          updated_at?: string
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
          last_used_at: string | null
          name: string
          preview_image: string | null
          signature_required: boolean
          status: string
          system_template_type:
            | Database["public"]["Enums"]["system_template_type"]
            | null
          template_path: string | null
          template_type: string | null
          updated_at: string
          usage_count: number | null
          version: string | null
        }
        Insert: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_locked?: boolean | null
          last_used_at?: string | null
          name: string
          preview_image?: string | null
          signature_required?: boolean
          status?: string
          system_template_type?:
            | Database["public"]["Enums"]["system_template_type"]
            | null
          template_path?: string | null
          template_type?: string | null
          updated_at?: string
          usage_count?: number | null
          version?: string | null
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_locked?: boolean | null
          last_used_at?: string | null
          name?: string
          preview_image?: string | null
          signature_required?: boolean
          status?: string
          system_template_type?:
            | Database["public"]["Enums"]["system_template_type"]
            | null
          template_path?: string | null
          template_type?: string | null
          updated_at?: string
          usage_count?: number | null
          version?: string | null
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
      user_templates: {
        Row: {
          category: string | null
          content: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          previous_version_id: string | null
          status: string | null
          updated_at: string | null
          usage_count: number | null
          version: number | null
        }
        Insert: {
          category?: string | null
          content?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          previous_version_id?: string | null
          status?: string | null
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          previous_version_id?: string | null
          status?: string | null
          updated_at?: string | null
          usage_count?: number | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_templates_previous_version_id_fkey"
            columns: ["previous_version_id"]
            isOneToOne: false
            referencedRelation: "user_templates"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_role_access: {
        Args: {
          user_id_to_check: string
        }
        Returns: boolean
      }
      generate_protocol_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
      email_status: "pending" | "sent" | "failed" | "bounced"
      invoice_status: "new" | "paid" | "problem"
      protocol_status: "draft" | "sent" | "signed" | "archived"
      system_template_type: "minimalistic" | "classic" | "detailed"
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
