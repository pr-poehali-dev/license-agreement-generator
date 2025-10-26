-- Create table for contracts history
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(50) NOT NULL UNIQUE,
    nickname VARCHAR(255) NOT NULL,
    full_name VARCHAR(500) NOT NULL,
    short_name VARCHAR(255) NOT NULL,
    contract_date VARCHAR(100) NOT NULL,
    citizenship VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passport VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contracts_contract_number ON contracts(contract_number);
CREATE INDEX idx_contracts_nickname ON contracts(nickname);
CREATE INDEX idx_contracts_created_at ON contracts(created_at DESC);