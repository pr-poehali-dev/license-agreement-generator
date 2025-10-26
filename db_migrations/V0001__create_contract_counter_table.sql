-- Create table for contract counter
CREATE TABLE IF NOT EXISTS contract_counter (
    id SERIAL PRIMARY KEY,
    current_number INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial counter value
INSERT INTO contract_counter (current_number) VALUES (0);