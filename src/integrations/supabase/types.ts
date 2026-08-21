export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          company_name: string
          contact_person: string
          created_at: string
          email: string
          estimated_quantity: string
          id: string
          message: string
          phone: string
          product_interest: string
          status: string
        }
        Insert: {
          company_name: string
          contact_person: string
          created_at?: string
          email: string
          estimated_quantity?: string
          id?: string
          message?: string
          phone?: string
          product_interest?: string
          status?: string
        }
        Update: {
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          estimated_quantity?: string
          id?: string
          message?: string
          phone?: string
          product_interest?: string
          status?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          created_at: string
          id: string
          kind: string
          name: string
          notes: string
          quantity: number
          reorder_level: number
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          name: string
          notes?: string
          quantity?: number
          reorder_level?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          name?: string
          notes?: string
          quantity?: number
          reorder_level?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_movements: {
        Row: {
          change: number
          created_at: string
          created_by: string | null
          id: string
          item_id: string
          reason: string
        }
        Insert: {
          change: number
          created_at?: string
          created_by?: string | null
          id?: string
          item_id: string
          reason?: string
        }
        Update: {
          change?: number
          created_at?: string
          created_by?: string | null
          id?: string
          item_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          size: string
          unit_price: number | null
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          size: string
          unit_price?: number | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          size?: string
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string
          created_at: string
          customer_notes: string
          id: string
          order_number: string
          quoted_price: number | null
          status: string
          target_date: string | null
          total_quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string
          created_at?: string
          customer_notes?: string
          id?: string
          order_number?: string
          quoted_price?: number | null
          status?: string
          target_date?: string | null
          total_quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string
          created_at?: string
          customer_notes?: string
          id?: string
          order_number?: string
          quoted_price?: number | null
          status?: string
          target_date?: string | null
          total_quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      production_jobs: {
        Row: {
          created_at: string
          id: string
          line: string
          order_id: string
          progress_notes: string
          stage: string
          target_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          line?: string
          order_id: string
          progress_notes?: string
          stage?: string
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          line?: string
          order_id?: string
          progress_notes?: string
          stage?: string
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_jobs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          category_id: string | null
          colors: string[]
          created_at: string
          description: string
          fabric: string
          gsm: number | null
          id: string
          image_url: string
          is_active: boolean
          moq: number
          name: string
          sizes: string[]
          slug: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          category_id?: string | null
          colors?: string[]
          created_at?: string
          description?: string
          fabric?: string
          gsm?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          moq?: number
          name: string
          sizes?: string[]
          slug: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category_id?: string | null
          colors?: string[]
          created_at?: string
          description?: string
          fabric?: string
          gsm?: number | null
          id?: string
          image_url?: string
          is_active?: boolean
          moq?: number
          name?: string
          sizes?: string[]
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string
          city: string
          company_name: string
          contact_person: string
          created_at: string
          email: string
          gst_number: string
          id: string
          phone: string
          pincode: string
          state: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string
          city?: string
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          gst_number?: string
          id: string
          phone?: string
          pincode?: string
          state?: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          gst_number?: string
          id?: string
          phone?: string
          pincode?: string
          state?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "customer"],
    },
  },
} as const
