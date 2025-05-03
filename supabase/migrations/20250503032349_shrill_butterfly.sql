/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - role (text)
      - avatar (text, nullable)
      - created_at (timestamp)
      
    - loans
      - id (uuid, primary key)
      - client_id (uuid, references users)
      - agent_id (uuid, references users)
      - amount (numeric)
      - term (integer)
      - interest_rate (numeric)
      - purpose (text)
      - status (text)
      - monthly_payment (numeric)
      - total_payable (numeric)
      - created_at (timestamp)
      - updated_at (timestamp)
      
    - loan_status_history
      - id (uuid, primary key)
      - loan_id (uuid, references loans)
      - status (text)
      - notes (text)
      - created_at (timestamp)
      
    - documents
      - id (uuid, primary key)
      - loan_id (uuid, references loans)
      - title (text)
      - url (text)
      - created_at (timestamp)
      
    - payments
      - id (uuid, primary key)
      - loan_id (uuid, references loans)
      - amount (numeric)
      - notes (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  avatar text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Loans table
CREATE TABLE loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES users(id),
  agent_id uuid REFERENCES users(id),
  amount numeric NOT NULL,
  term integer NOT NULL,
  interest_rate numeric NOT NULL,
  purpose text NOT NULL,
  status text NOT NULL,
  monthly_payment numeric NOT NULL,
  total_payable numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read loans they are involved with"
  ON loans
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = client_id OR 
    auth.uid() = agent_id OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('credit_investigator', 'finance_officer')
    )
  );

CREATE POLICY "Agents can create loans"
  ON loans
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'agent'
    )
  );

CREATE POLICY "Appropriate roles can update loans"
  ON loans
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = agent_id OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('credit_investigator', 'finance_officer')
    )
  );

-- Loan status history table
CREATE TABLE loan_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES loans(id),
  status text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE loan_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read status history for their loans"
  ON loan_status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = loan_id
      AND (
        loans.client_id = auth.uid() OR
        loans.agent_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
          AND role IN ('credit_investigator', 'finance_officer')
        )
      )
    )
  );

CREATE POLICY "Appropriate roles can insert status history"
  ON loan_status_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = loan_id
      AND (
        loans.agent_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
          AND role IN ('credit_investigator', 'finance_officer')
        )
      )
    )
  );

-- Documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES loans(id),
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read documents for their loans"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = loan_id
      AND (
        loans.client_id = auth.uid() OR
        loans.agent_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
          AND role IN ('credit_investigator', 'finance_officer')
        )
      )
    )
  );

CREATE POLICY "Clients can upload documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = loan_id
      AND loans.client_id = auth.uid()
    )
  );

-- Payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES loans(id),
  amount numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read payments for their loans"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = loan_id
      AND (
        loans.client_id = auth.uid() OR
        loans.agent_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid()
          AND role IN ('credit_investigator', 'finance_officer')
        )
      )
    )
  );

CREATE POLICY "Agents can record payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM loans
      WHERE loans.id = loan_id
      AND loans.agent_id = auth.uid()
    )
  );