# Deploying Loan Update System on Vercel + Supabase

This guide explains how to deploy the Loan Update System on Vercel with Supabase as the database backend.

## Prerequisites

1. A [Vercel](https://vercel.com/) account
2. A [Supabase](https://supabase.com/) account
3. Node.js installed locally (for testing)

## Step 1: Set up Supabase

1. Create a new Supabase project:
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Click "New Project"
   - Enter your project details and create the project

2. Get your Supabase credentials:
   - In your Supabase project dashboard, go to "Project Settings" > "API"
   - Copy the "Project URL" and "anon public" key

3. Set up the database:
   - Go to the "SQL Editor" in your Supabase dashboard
   - Run the SQL scripts from `supabase/migrations/001_loan_system_schema.sql`
   - Optionally run the seed data from `supabase/seed.sql`

## Step 2: Configure Environment Variables

In your Supabase project, go to "Settings" > "Configuration" > "Environment Variables" and add:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SESSION_SECRET=a_strong_random_string_for_session_security
```

## Step 3: Deploy to Vercel

1. Fork this repository to your GitHub account
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your forked repository
5. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: npm install
   - Output Directory: ./
   - Install Command: npm install
6. Add environment variables in the "Environment Variables" section:
   - SUPABASE_URL (from Step 2)
   - SUPABASE_ANON_KEY (from Step 2)
   - SESSION_SECRET (a strong random string)
7. Click "Deploy"

## Step 4: Populate Initial Data (Optional)

If you want to add sample users and GN divisions:

1. Connect to your Supabase database using a tool like pgAdmin or the built-in SQL editor
2. Run the seed data from `supabase/seed.sql`

## Usage

After deployment, you can access:
- Login page: `https://your-vercel-url.vercel.app/login`
- Sample user credentials:
  - Username: `gampaha_bank_01`, Password: `password123`
  - Username: `negombo_bank_01`, Password: `password123`

## Notes

- The application uses server-side sessions stored in memory. For production, consider using a persistent session store.
- Make sure to use strong passwords in production.
- The free tier of Supabase and Vercel should be sufficient for testing and small deployments.