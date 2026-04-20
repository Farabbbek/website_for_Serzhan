export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          user_type: "student" | "teacher" | null;
          role: "user" | "editor" | "admin" | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          user_type?: "student" | "teacher" | null;
          role?: "user" | "editor" | "admin" | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          user_type?: "student" | "teacher" | null;
          role?: "user" | "editor" | "admin" | null;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string | null;
          type: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string | null;
          type?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          color?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_url: string | null;
          type: string | null;
          status: string | null;
          category_id: string | null;
          author_id: string | null;
          lang: string | null;
          views: number | null;
          published_at: string | null;
          source_url: string | null;
          author_name: string | null;
          audio_url: string | null;
          duration: string | null;
          guests: string | null;
          file_url: string | null;
          level: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_url?: string | null;
          type?: string | null;
          status?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          lang?: string | null;
          views?: number | null;
          published_at?: string | null;
          source_url?: string | null;
          author_name?: string | null;
          audio_url?: string | null;
          duration?: string | null;
          guests?: string | null;
          file_url?: string | null;
          level?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          cover_url?: string | null;
          type?: string | null;
          status?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          lang?: string | null;
          views?: number | null;
          published_at?: string | null;
          source_url?: string | null;
          author_name?: string | null;
          audio_url?: string | null;
          duration?: string | null;
          guests?: string | null;
          file_url?: string | null;
          level?: string | null;
        };
        Relationships: [];
      };
      materials: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          file_url: string;
          file_type: string | null;
          category_id: string | null;
          is_free: boolean | null;
          downloads: number | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          file_url: string;
          file_type?: string | null;
          category_id?: string | null;
          is_free?: boolean | null;
          downloads?: number | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          file_url?: string;
          file_type?: string | null;
          category_id?: string | null;
          is_free?: boolean | null;
          downloads?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type PublicSchema = Database["public"];
export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
