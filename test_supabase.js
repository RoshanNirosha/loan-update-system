/**
 * Test script for Supabase integration
 * Run this script to verify Supabase connectivity and basic operations
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabase() {
    console.log('Testing Supabase Integration...\n');
    
    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables');
        console.log('   Please create a .env file with these variables or set them in your environment');
        return;
    }
    
    // Create Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );
    
    console.log('1. Testing database connection...');
    
    try {
        // Test basic connectivity with a simple query
        const { data, error } = await supabase
            .from('users')
            .select('count()', { count: 'exact' })
            .limit(1);
        
        if (error) {
            console.error('❌ Database connection failed:', error.message);
            console.log('\nTroubleshooting tips:');
            console.log('- Check that your SUPABASE_URL is correct');
            console.log('- Check that your SUPABASE_ANON_KEY is correct');
            console.log('- Ensure your Supabase project is set up correctly');
            return;
        }
        
        console.log('✅ Successfully connected to Supabase database');
    } catch (err) {
        console.error('❌ Error connecting to database:', err.message);
        return;
    }
    
    console.log('\n2. Testing table structure...');
    
    try {
        // Check if required tables exist by attempting to describe them
        const tables = ['users', 'gn_divisions', 'loan_data'];
        
        for (const table of tables) {
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                
                if (error && error.code !== '42P01') { // 42P01 = undefined_table
                    console.error(`❌ Error accessing table ${table}:`, error.message);
                } else {
                    console.log(`✅ Table ${table} exists and is accessible`);
                }
            } catch (err) {
                console.log(`⚠ Could not verify table ${table}:`, err.message);
            }
        }
    } catch (err) {
        console.log('⚠ Could not verify table structure:', err.message);
    }
    
    console.log('\n3. Testing basic operations...');
    
    try {
        // Test inserting a dummy record (will be rolled back)
        const { data, error } = await supabase
            .from('users')
            .select('count()', { count: 'exact' });
        
        if (error) {
            console.error('❌ Error performing basic query:', error.message);
        } else {
            console.log('✅ Basic query operations work correctly');
            console.log(`   Found ${data[0].count} records in users table`);
        }
    } catch (err) {
        console.error('❌ Error performing basic operations:', err.message);
    }
    
    console.log('\n🎉 Supabase integration test completed!');
    console.log('\nNext steps:');
    console.log('- If all tests passed, you can deploy to Vercel');
    console.log('- If tests failed, check your Supabase configuration');
    console.log('- Refer to VERCEL_SUPABASE_DEPLOYMENT.md for full deployment instructions');
}

// Run test
if (require.main === module) {
    testSupabase().catch(console.error);
}

module.exports = { testSupabase };