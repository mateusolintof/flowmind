/**
 * Supabase client configuration
 *
 * Database Schema:
 * ================
 * Table: diagrams
 * - id: uuid (primary key, auto-generated)
 * - user_id: text (anonymous user identifier)
 * - diagram_id: text (client-generated UUID)
 * - name: text (diagram display name)
 * - data: jsonb (contains nodes, edges, viewport)
 * - created_at: timestamptz (auto-generated)
 * - updated_at: timestamptz (updated on save)
 *
 * Unique constraint: (user_id, diagram_id)
 *
 * The single-table design is intentional:
 * - Simple schema for MVP
 * - All diagram data in JSONB for flexibility
 * - Easy to extend with additional fields later
 * - RLS policies can be added for multi-tenant support
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
