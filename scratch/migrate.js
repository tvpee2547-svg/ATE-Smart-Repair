import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env configuration
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase_project_url')) {
  console.error('❌ Error: Please configure your SUPABASE_URL and SUPABASE_ANON_KEY inside the .env file first!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dbFile = path.join(__dirname, '..', 'db.json');

async function runMigration() {
  console.log('🔄 Starting migration from db.json to Supabase...');

  if (!fs.existsSync(dbFile)) {
    console.error('❌ db.json file not found! Nothing to migrate.');
    process.exit(1);
  }

  const dbData = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  const users = dbData.users || [];
  const requests = dbData.requests || [];

  console.log(`📂 Read ${users.length} users and ${requests.length} requests from db.json.`);

  // 1. Migrate Users
  if (users.length > 0) {
    console.log('👥 Migrating users...');
    // We map users to the table structure. Supabase handles IDs automatically for bigint identity, 
    // but to preserve their current IDs (especially for manual IDs if referenced, though username is the unique key),
    // let's insert them mapping username, password, name, role, initials.
    for (const u of users) {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', u.username)
        .maybeSingle();

      if (existingUser) {
        console.log(`⚠️ User ${u.username} already exists in Supabase. Skipping.`);
        continue;
      }

      const { error } = await supabase
        .from('users')
        .insert({
          username: u.username,
          password: u.password,
          name: u.name,
          role: u.role,
          initials: u.initials
        });

      if (error) {
        console.error(`❌ Error inserting user ${u.username}:`, error.message);
      } else {
        console.log(`✅ Migrated user: ${u.username} (${u.name})`);
      }
    }
  }

  // 2. Migrate Requests
  if (requests.length > 0) {
    console.log('🛠️ Migrating maintenance requests...');
    for (const r of requests) {
      // Check if request already exists
      const { data: existingReq } = await supabase
        .from('requests')
        .select('id')
        .eq('id', r.id)
        .maybeSingle();

      if (existingReq) {
        console.log(`⚠️ Request ${r.id} already exists in Supabase. Skipping.`);
        continue;
      }

      const { error } = await supabase
        .from('requests')
        .insert({
          id: r.id,
          subject: r.subject,
          category: r.category,
          reporter: r.reporter,
          reporter_username: r.reporterUsername,
          phone: r.phone || '-', // Default old requests to '-'
          date: r.date,
          status: r.status,
          details: r.details || '',
          assignee: r.assignee || null,
          image_url: r.imageUrl || null
        });

      if (error) {
        console.error(`❌ Error inserting request ${r.id}:`, error.message);
      } else {
        console.log(`✅ Migrated request: ${r.id} - ${r.subject}`);
      }
    }
  }

  console.log('🎉 Migration completed successfully!');
}

runMigration().catch(err => {
  console.error('💥 Migration failed with error:', err);
});
