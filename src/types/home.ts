export interface HomeSection {
  id: string;
  title: string;
  description: string;
  image_url?: string | null;
  link_url?: string | null;
  link_text?: string | null;
  category?: string | null; // Links to menu category
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
