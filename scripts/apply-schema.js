const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function applySchema() {
  console.log('🚀 Starting schema application...');
  
  // Initialize Supabase client with service role key for admin operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Schema file loaded successfully');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try alternative method using raw SQL
          const { error: altError } = await supabase
            .from('_temp')
            .select('*')
            .limit(0);
          
          // If that doesn't work, use the REST API directly
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({ sql: statement })
          });
          
          if (!response.ok) {
            console.warn(`⚠️  Statement ${i + 1} might have failed, but continuing...`);
            console.log(`Statement: ${statement.substring(0, 100)}...`);
          }
        }
      } catch (err) {
        console.warn(`⚠️  Error executing statement ${i + 1}, continuing...`);
        console.log(`Error: ${err.message}`);
      }
    }
    
    console.log('✅ Schema application completed!');
    console.log('🔍 Verifying tables were created...');
    
    // Verify some key tables exist
    const tablesToCheck = ['profiles', 'vehicles', 'vehicle_images', 'saved_vehicles', 'listing_plans', 'user_subscriptions', 'listing_purchases'];
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}' might not exist or have access issues`);
        } else {
          console.log(`✅ Table '${table}' is accessible`);
        }
      } catch (err) {
        console.log(`❌ Could not verify table '${table}': ${err.message}`);
      }
    }
    
    console.log('\n🎉 Schema application process finished!');
    console.log('You can now test your profile functionality at http://localhost:3000/profile');
    
  } catch (error) {
    console.error('❌ Error applying schema:', error);
    process.exit(1);
  }
}

// Run the script
applySchema();
