"use client";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ncxhfuiicnakgdwkiurb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jeGhmdWlpY25ha2dkd2tpdXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODAxNjYsImV4cCI6MjA5MDY1NjE2Nn0.rr2pRbPxPEabWXXKolQjvXSon7L8ESTc9LYyCHpV6cs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
