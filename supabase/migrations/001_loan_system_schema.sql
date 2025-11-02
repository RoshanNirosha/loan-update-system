-- Database schema for Loan Update System
-- This file contains the schema for Supabase PostgreSQL database

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (banks)
create table users (
    id uuid default uuid_generate_v4() primary key,
    username varchar(50) unique not null,
    password varchar(255) not null,
    bank_id varchar(20) not null,
    bank_name varchar(100) not null,
    division varchar(50) not null,
    created_at timestamp with time zone default now()
);

-- GN Divisions table
create table gn_divisions (
    id uuid default uuid_generate_v4() primary key,
    division varchar(50) not null,
    gn_division varchar(100) not null,
    created_at timestamp with time zone default now()
);

-- Create index on division for faster queries
create index idx_gn_divisions_division on gn_divisions (division);

-- Loan data table
create table loan_data (
    id uuid default uuid_generate_v4() primary key,
    bank_id varchar(20) not null,
    user_id uuid not null,
    entry_timestamp timestamp with time zone default now(),
    
    beneficiary_name varchar(100) not null,
    beneficiary_nic varchar(20) not null,
    beneficiary_address text not null,
    beneficiary_gn_division varchar(100) not null,
    beneficiary_category varchar(20) not null check (beneficiary_category in ('extremelyPoor', 'transitional', 'samurdhi')),
    
    interest_rate numeric(5,2) not null,
    loan_type varchar(20) not null check (loan_type in ('empowerment', 'ranpatha')),
    project varchar(20) not null check (project in ('agricultural', 'industrial', 'trade', 'services', 'vocational')),
    
    loan_amount numeric(15,2) not null,
    loan_issued_date date not null,
    
    created_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index idx_loan_data_bank_id on loan_data (bank_id);
create index idx_loan_data_user_id on loan_data (user_id);
create index idx_loan_data_entry_timestamp on loan_data (entry_timestamp);

-- Add foreign key constraint
alter table loan_data 
add constraint fk_loan_data_user 
foreign key (user_id) references users(id) 
on delete cascade;