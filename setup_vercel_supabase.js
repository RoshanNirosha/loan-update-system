/**
 * Setup script for Vercel + Supabase deployment
 * This script helps with initial setup and verification
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setup() {
    console.log('Setting up Loan Update System for Vercel + Supabase...');
    
    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables');
        process.exit(1);
    }
    
    // Create Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );
    
    // Test database connection
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count()', { count: 'exact' })
            .limit(1);
        
        if (error) {
            console.error('Database connection error:', error.message);
            process.exit(1);
        }
        
        console.log('✓ Successfully connected to Supabase database');
    } catch (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    }
    
    // Check if tables exist
    try {
        const { data, error } = await supabase
            .from('_meta.tables')
            .select('name')
            .in('name', ['users', 'gn_divisions', 'loan_data']);
        
        if (error) {
            console.log('⚠ Could not verify tables existence. You may need to run the migration scripts.');
        } else {
            console.log('✓ Required tables exist');
        }
    } catch (err) {
        console.log('⚠ Could not verify tables existence. You may need to run the migration scripts.');
    }
    
    console.log('\nSetup verification completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Deploy to Vercel using the vercel.json configuration');
    console.log('2. Set environment variables in Vercel dashboard:');
    console.log('   - SUPABASE_URL');
    console.log('   - SUPABASE_ANON_KEY');
    console.log('   - SESSION_SECRET');
    console.log('3. Run database migrations if needed');
    console.log('4. Add seed data if desired');
    
    process.exit(0);
}

// Run setup
if (require.main === module) {
    setup().catch(console.error);
}

module.exports = { setup };