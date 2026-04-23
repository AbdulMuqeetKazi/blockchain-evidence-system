import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  // Fallback for setups that keep env in backend/.env.
  dotenv.config({ path: resolve(__dirname, "../.env") });
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Supabase configuration missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment."
  );
}

export const supabase = createClient(supabaseUrl, serviceRoleKey);