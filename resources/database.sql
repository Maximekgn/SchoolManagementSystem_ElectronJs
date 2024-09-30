-- Table des classes (Classes)
CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  class_fees REAL NOT NULL
);

INSERT INTO classes (name,  class_fees)
VALUES 
('Class A', 500.00),
('Class B',  450.00),
('Class C',  550.00);


-- Table des étudiants (Students)
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  birthDate DATE NOT NULL,
  birthPlace TEXT,
  gender TEXT NOT NULL DEFAULT 'Other',
  regNumber TEXT ,
  admissionDate DATE NOT NULL,
  classId INTEGER,
  discountFee REAL DEFAULT 0,
  schoolFee REAL DEFAULT 0,
  paidFee REAL DEFAULT 0,
  bloodGroup TEXT ,
  medicalCondition TEXT,
  previousSchool TEXT,
  religion TEXT,
  additionalNote TEXT,
  parentName TEXT,
  parentSurname TEXT,
  parentPhone TEXT,
  FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE SET NULL
);

INSERT INTO students (surname, name, birthDate, birthPlace, gender, regNumber, admissionDate, classId, bloodGroup, medicalCondition, previousSchool, religion, parentName, parentSurname, parentPhone, schoolFee, discountFee)
VALUES 
('Johnson', 'Emily', '2010-03-25', 'London', 'Female', 'STU001', '2020-09-01', 1, 'O+', 'None', 'Little Stars Academy', 'Christian', 'Michael', 'Johnson', '1231231234', 500.00, 0),
('Brown', 'Oliver', '2011-07-19', 'New York', 'Male', 'STU002', '2021-09-01', 2, 'A+', 'Asthma', 'Sunrise School', 'Atheist', 'William', 'Brown', '4564564567', 450.00, 50.00),
('Wilson', 'Sophia', '2009-12-10', 'Toronto', 'Female', 'STU003', '2019-09-01', 1, 'B+', 'Diabetes', 'Greenfield School', 'Muslim', 'David', 'Wilson', '7897897890', 500.00, 25.00);



-- Table des employés (Employees)
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  birthDate DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')) DEFAULT 'Male',
  regNumber TEXT ,
  nationalId TEXT ,
  phone TEXT ,
  nationality TEXT,
  joinDate DATE NOT NULL,
  role TEXT NOT NULL,
  salary REAL DEFAULT 0,
  experience TEXT,
  religion TEXT,
  email TEXT ,
  address TEXT
);


INSERT INTO employees (surname, name, birthDate, gender,regNumber, nationalId, phone, nationality, joinDate, role, salary, experience, religion, email, address)
VALUES 
('Smith', 'John', '1980-05-15', 'Male', 'EMP001', 'NI123456789', '1234567890', 'British', '2010-09-01', 'Teacher', 2500.00, '10 years', 'Christian', 'john.smith@example.com', '123 Oxford St, London'),
('Doe', 'Jane', '1985-08-22', 'Female', 'EMP002', 'NI987654321', '0987654321', 'American', '2015-01-15', 'Teacher', 2200.00, '5 years', 'Atheist', 'jane.doe@example.com', '456 Maple St, New York'),
('Miller', 'Tom', '1990-11-12', 'Male', 'EMP003', 'NI112233445', '1122334455', 'Canadian', '2018-05-10', 'Admin', 1800.00, '3 years', 'Muslim', 'tom.miller@example.com', '789 Pine St, Toronto');


-- Ajout d'une colonne pour le montant total de la scolarité dans la table students
ALTER TABLE students ADD COLUMN total_fees REAL DEFAULT 0;

-- Table des paiements des étudiants (Student_Payments)
CREATE TABLE IF NOT EXISTS student_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  student_id INTEGER NOT NULL,
  payment_date DATE NOT NULL,
  amount_paid REAL NOT NULL,
  discount REAL DEFAULT 0,
  description TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);