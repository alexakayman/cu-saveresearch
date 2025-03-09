import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Grant = {
  id: number;
  title: string;
  release_date: string;
  expired_date: string;
  activity_code: string;
  parent_organization: string;
  organization: string;
  participating_orgs: string;
  document_number: string;
  document_type: string;
  clinical_trials: string;
  url: string;
  created_at: string;
};
