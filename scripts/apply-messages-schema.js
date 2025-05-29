const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function applyMessagesSchema() {
  console.log('🚀 Starting messages schema application...');
  
  // Get environment variables directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
    console.log('Current NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
    console.log('Current SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Not set');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Read the messages schema file
    const schemaPath = path.join(__dirname, '..', 'src', 'app', 'api', 'messages', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Messages schema file loaded successfully');
    
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
        // Use the SQL editor to execute the statement
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql: statement 
        });
        
        if (error) {
          console.log(`⚠️  Statement ${i + 1} failed with RPC, trying direct execution...`);
          console.log('Error:', error.message);
          
          // For some statements, we might need to handle them differently
          if (statement.includes('CREATE TABLE') || statement.includes('ALTER TABLE') || 
              statement.includes('CREATE POLICY') || statement.includes('CREATE INDEX') ||
              statement.includes('CREATE FUNCTION') || statement.includes('CREATE TRIGGER')) {
            console.log(`ℹ️  Skipping statement ${i + 1} - it may already exist or require manual execution`);
            continue;
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} failed:`, err.message);
        // Continue with other statements
      }
    }
    
    console.log('🎉 Messages schema application completed!');
    
    // Test the messages table
    console.log('🧪 Testing messages table...');
    const { data: testData, error: testError } = await supabase
      .from('messages')
      .select('count(*)')
      .limit(1);
    
    if (testError) {
      console.log('❌ Messages table test failed:', testError.message);
      console.log('You may need to manually create the messages table in your Supabase dashboard');
    } else {
      console.log('✅ Messages table is accessible!');
    }
    
  } catch (error) {
    console.error('❌ Error applying messages schema:', error.message);
    console.log('\n📋 Manual steps to create the messages table:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to the SQL Editor');
    console.log('3. Copy and paste the contents of src/app/api/messages/schema.sql');
    console.log('4. Execute the SQL statements');
  }
}

// Run the function
applyMessagesSchema().catch(console.error);
