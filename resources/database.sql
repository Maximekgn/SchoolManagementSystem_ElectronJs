-- Table des étudiants
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  place_of_birth TEXT,
  gender TEXT,
  picture BLOB,
  registration_number TEXT,
  date_of_admission TEXT,
  class_id INTEGER,
  discount_in_fee REAL,
  blood_group TEXT,
  medical_condition TEXT,
  previous_school TEXT,
  religion TEXT,
  additional_note TEXT,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- Insertion de données de test dans la table students
INSERT INTO students (surname, name, date_of_birth, place_of_birth, gender, registration_number, date_of_admission, class_id)
VALUES 
('Doe', 'John', '2005-04-10', 'Paris', 'Male', 'S12345', '2021-09-01', 1),
('Smith', 'Jane', '2006-07-15', 'Lyon', 'Female', 'S12346', '2021-09-01', 2);

-- Table des parents
CREATE TABLE IF NOT EXISTS parents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT,
  occupation TEXT,
  address TEXT
);

-- Insertion de données de test dans la table parents
INSERT INTO parents (surname, name, relationship, mobile_number, email, occupation, address)
VALUES 
('Doe', 'Michael', 'Father', '0612345678', 'michael.doe@example.com', 'Engineer', '123 Main St, Paris'),
('Smith', 'Laura', 'Mother', '0623456789', 'laura.smith@example.com', 'Doctor', '456 Oak St, Lyon');

-- Table des relations entre étudiants et parents
CREATE TABLE IF NOT EXISTS student_parent_relationship (
  student_id INTEGER,
  parent_id INTEGER,
  PRIMARY KEY (student_id, parent_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
);

-- Insertion de données de test dans la table student_parent_relationship
INSERT INTO student_parent_relationship (student_id, parent_id)
VALUES 
(1, 1),  -- John Doe avec Michael Doe
(2, 2);  -- Jane Smith avec Laura Smith

-- Table des classes
CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  teacher_id INTEGER,
  FOREIGN KEY (teacher_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Insertion de données de test dans la table classes
INSERT INTO classes (name, teacher_id)
VALUES 
('Class 1', 1),
('Class 2', 2);

-- Table des employés
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth TEXT,
  gender TEXT DEFAULT 'Male',
  registration_number TEXT,
  picture BLOB,
  national_id TEXT,
  mobile_number TEXT,
  nationality TEXT,
  date_of_joining TEXT,
  employee_role TEXT NOT NULL,
  monthly_salary REAL DEFAULT 0,
  experience TEXT,
  religion TEXT,
  email TEXT,
  address TEXT
);

-- Insertion de données de test dans la table employees
INSERT INTO employees (surname, name, date_of_birth, gender, registration_number, national_id, mobile_number, nationality, date_of_joining, employee_role, monthly_salary, experience, religion, email, address)
VALUES 
('White', 'Alice', '1980-01-15', 'Female', 'E12345', 'ID12345', '0678912345', 'French', '2020-09-01', 'Teacher', 3000, '5 years', 'Christianity', 'alice.white@example.com', '789 Birch St, Paris'),
('Brown', 'Bob', '1978-05-22', 'Male', 'E12346', 'ID12346', '0689123456', 'French', '2019-09-01', 'hacker', 3500, '10 years', 'Christianity', 'bob.brown@example.com', '101 Maple St, Lyon');

-- Table des frais étudiants
CREATE TABLE IF NOT EXISTS student_fees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  total_fee REAL NOT NULL,
  amount_paid REAL NOT NULL DEFAULT 0,
  amount_due REAL NOT NULL,
  status TEXT DEFAULT 'Not Paid',
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Insertion de données de test dans la table student_fees
INSERT INTO student_fees (student_id, total_fee, amount_paid, amount_due, status)
VALUES 
(1, 5000, 1000, 4000, 'Partially Paid'),
(2, 5000, 5000, 0, 'Paid');

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payer_id INTEGER,
  payer_type TEXT NOT NULL,  -- 'Student' ou 'Employee'
  payment_type_id INTEGER,
  amount_paid REAL NOT NULL,
  payment_date TEXT DEFAULT (date('now')),
  remarks TEXT,
  FOREIGN KEY (payer_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Insertion de données de test dans la table payments
INSERT INTO payments (payer_id, payer_type, payment_type_id, amount_paid, remarks)
VALUES 
(1, 'Student', 1, 1000, 'First installment'),
(2, 'Student', 1, 5000, 'Full payment');

-- Table des types de paiements
CREATE TABLE IF NOT EXISTS payment_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

-- Insertion de données de test dans la table payment_types
INSERT INTO payment_types (name)
VALUES 
('Tuition Fee'),
('Library Fee');
