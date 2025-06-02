
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sagteapkjmhshqrbkovu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZ3RlYXBram1oc2hxcmJrb3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NTk1NTQsImV4cCI6MjA2NDAzNTU1NH0.7ZrlOP4oRvTkCN6s0DvQtq23uSGwqLqAJNsFbVH8PK4';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});
