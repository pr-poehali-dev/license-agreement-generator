-- Add new columns for INN/SWIFT and bank details
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS inn_swift TEXT,
ADD COLUMN IF NOT EXISTS bank_details TEXT;