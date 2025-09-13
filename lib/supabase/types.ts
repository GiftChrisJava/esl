export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      contact_submissions: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          project_type: string | null
          response_sent: boolean | null
          status: Database["public"]["Enums"]["inquiry_status"] | null
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          project_type?: string | null
          response_sent?: boolean | null
          status?: Database["public"]["Enums"]["inquiry_status"] | null
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          project_type?: string | null
          response_sent?: boolean | null
          status?: Database["public"]["Enums"]["inquiry_status"] | null
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string
          product_snapshot: Json | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku: string
          product_snapshot?: Json | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string
          product_snapshot?: Json | null
          quantity?: number
          total_price?: number
          unit_price?: number
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
          }
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          delivered_at: string | null
          discount_amount: number | null
          id: string
          internal_notes: string | null
          notes: string | null
          order_number: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          shipped_at: string | null
          shipping_address: Json
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          customer_email: string
          customer_name?: string | null
          customer_phone?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipped_at?: string | null
          shipping_address: Json
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          customer_email?: string
          customer_name?: string | null
          customer_phone?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_number?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipped_at?: string | null
          shipping_address?: Json
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          currency: string | null
          gateway_reference: string | null
          gateway_response: Json | null
          gateway_transaction_id: string | null
          id: string
          order_id: string
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          gateway_reference?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          order_id: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          gateway_reference?: string | null
          gateway_response?: Json | null
          gateway_transaction_id?: string | null
          id?: string
          order_id?: string
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_inquiries: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          product_id: string | null
          quantity: number | null
          response_sent: boolean | null
          status: Database["public"]["Enums"]["inquiry_status"] | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          product_id?: string | null
          quantity?: number | null
          response_sent?: boolean | null
          status?: Database["public"]["Enums"]["inquiry_status"] | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          product_id?: string | null
          quantity?: number | null
          response_sent?: boolean | null
          status?: Database["public"]["Enums"]["inquiry_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_inquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          category_id: string | null
          compare_at_price: number | null
          cost_price: number | null
          created_at: string
          created_by: string | null
          description: string | null
          dimensions: Json | null
          features: Json | null
          id: string
          images: Json | null
          installation_available: boolean | null
          is_active: boolean | null
          is_featured: boolean | null
          long_description: string | null
          low_stock_threshold: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          price: number
          requires_shipping: boolean | null
          sku: string
          slug: string
          specifications: Json | null
          stock_quantity: number | null
          updated_at: string
          warranty_period: string | null
          weight: number | null
        }
        Insert: {
          category_id?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          features?: Json | null
          id?: string
          images?: Json | null
          installation_available?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price: number
          requires_shipping?: boolean | null
          sku: string
          slug: string
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string
          warranty_period?: string | null
          weight?: number | null
        }
        Update: {
          category_id?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          dimensions?: Json | null
          features?: Json | null
          id?: string
          images?: Json | null
          installation_available?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price?: number
          requires_shipping?: boolean | null
          sku?: string
          slug?: string
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string
          warranty_period?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          area: string | null
          avatar_url: string | null
          created_at: string
          district: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_active: boolean | null
          landmarks: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          area?: string | null
          avatar_url?: string | null
          created_at?: string
          district?: string | null
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          landmarks?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          area?: string | null
          avatar_url?: string | null
          created_at?: string
          district?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          landmarks?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          category: string | null
          client_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          gallery_images: Json | null
          id: string
          image_url: string | null
          impact_metrics: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string | null
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          project_value: number | null
          short_description: string | null
          slug: string
          start_date: string | null
          status: string | null
          technologies_used: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          impact_metrics?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          project_value?: number | null
          short_description?: string | null
          slug: string
          start_date?: string | null
          status?: string | null
          technologies_used?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          client_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          impact_metrics?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          project_value?: number | null
          short_description?: string | null
          slug?: string
          start_date?: string | null
          status?: string | null
          technologies_used?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          base_price: number | null
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number | null
          features: Json | null
          gallery_images: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          pricing_model: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          pricing_model?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          features?: Json | null
          gallery_images?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          pricing_model?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      staff_members: {
        Row: {
          bio: string | null
          created_at: string
          created_by: string | null
          department: string | null
          display_order: number | null
          email: string | null
          full_name: string
          id: string
          image_url: string | null
          is_active: boolean | null
          linkedin_url: string | null
          phone: string | null
          position: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          display_order?: number | null
          email?: string | null
          full_name: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          phone?: string | null
          position: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          display_order?: number | null
          email?: string | null
          full_name?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin_url?: string | null
          phone?: string | null
          position?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_members_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      testimonials: {
        Row: {
          client_company: string | null
          client_image_url: string | null
          client_name: string
          client_position: string | null
          created_at: string
          created_by: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          project_id: string | null
          rating: number | null
          testimonial_text: string
          updated_at: string
        }
        Insert: {
          client_company?: string | null
          client_image_url?: string | null
          client_name: string
          client_position?: string | null
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          project_id?: string | null
          rating?: number | null
          testimonial_text: string
          updated_at?: string
        }
        Update: {
          client_company?: string | null
          client_image_url?: string | null
          client_name?: string
          client_position?: string | null
          created_at?: string
          created_by?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          project_id?: string | null
          rating?: number | null
          testimonial_text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_cart_total: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      check_low_stock: {
        Args: Record<PropertyKey, never>
        Returns: {
          product_id: string
          product_name: string
          current_stock: number
          threshold: number
        }[]
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      admin_status: "active" | "inactive" | "suspended"
      inquiry_status: "new" | "in_progress" | "resolved" | "closed"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "failed"
      payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
        | "refunded"
      user_role:
        | "customer"
        | "system_admin"
        | "sales_admin"
        | "web_admin"
        | "helpdesk"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}