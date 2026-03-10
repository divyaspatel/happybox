import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgevqkyukrsnklkopfsh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZXZxa3l1a3Jzbmtsa29wZnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzE5OTAsImV4cCI6MjA4ODc0Nzk5MH0.jWLQksaPVCEGuqEPtazOfwUdtNhih4tlqIb94oyzVvg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
