import 'dotenv/config';
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Supabase, SSL is required:
  ssl: process.env.DATABASE_URL?.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10, // number of connections to keep open
});
