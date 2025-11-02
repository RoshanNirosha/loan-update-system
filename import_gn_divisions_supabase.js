/**
 * Script to import GN divisions data into Supabase
 * This script reads the GN List CSV file and imports it into the gn_divisions table
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importGnDivisions() {
    console.log('Importing GN Divisions data into Supabase...\n');
    
    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables');
        return;
    }
    
    // Create Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );
    
    // Read GN List CSV file
    const gnListPath = path.join(__dirname, 'GN List (1).csv');
    
    try {
        const data = fs.readFileSync(gnListPath, 'utf8');
        const lines = data.split('\n');
        
        console.log(`Found ${lines.length - 1} GN divisions to import (excluding header)`);
        
        let insertCount = 0;
        let errorCount = 0;
        
        // Skip header line and process each line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const [division, gnDivision] = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
                if (division && gnDivision) {
                    try {
                        const { data, error } = await supabase
                            .from('gn_divisions')
                            .insert([
                                {
                                    division: division,
                                    gn_division: gnDivision
                                }
                            ]);
                        
                        if (error) {
                            console.error(`Error inserting ${division} - ${gnDivision}:`, error.message);
                            errorCount++;
                        } else {
                            insertCount++;
                        }
                        
                        // Show progress every 100 records
                        if (insertCount % 100 === 0) {
                            console.log(`Progress: ${insertCount} records inserted`);
                        }
                    } catch (err) {
                        console.error(`Error inserting ${division} - ${gnDivision}:`, err.message);
                        errorCount++;
                    }
                }
            }
        }
        
        console.log(`\n✅ Import completed!`);
        console.log(`   Successfully inserted: ${insertCount} records`);
        console.log(`   Errors: ${errorCount} records`);
        
    } catch (err) {
        console.error('❌ Error reading GN List CSV file:', err.message);
        return;
    }
}

// Run import
if (require.main === module) {
    importGnDivisions().catch(console.error);
}

module.exports = { importGnDivisions };