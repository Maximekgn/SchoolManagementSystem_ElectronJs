-- Table des classes (Classes)
CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  class_fees REAL NOT NULL,
  teacher_id INTEGER,
  FOREIGN KEY (teacher_id) REFERENCES employees(id) ON DELETE SET NULL
);

INSERT INTO classes (name, capacity, class_fees, teacher_id)
VALUES 
('Class A', 30, 500.00, NULL),
('Class B', 25, 450.00, NULL),
('Class C', 35, 550.00, NULL);


-- Table des étudiants (Students)
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  place_of_birth TEXT,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')) DEFAULT 'Other',
  picture BLOB,
  registration_number TEXT UNIQUE,
  date_of_admission DATE NOT NULL,
  class_id INTEGER,
  discount_in_fee REAL DEFAULT 0,
  blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  medical_condition TEXT,
  previous_school TEXT,
  religion TEXT,
  additional_note TEXT,
  parent_name TEXT,
  parent_surname TEXT,
  parent_mobile_number TEXT,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

INSERT INTO students (surname, name, date_of_birth, place_of_birth, gender, registration_number, date_of_admission, class_id, blood_group, medical_condition, previous_school, religion, parent_name, parent_surname, parent_mobile_number)
VALUES 
('Johnson', 'Emily', '2010-03-25', 'London', 'Female', 'STU001', '2020-09-01', 1, 'O+', 'None', 'Little Stars Academy', 'Christian', 'Michael', 'Johnson', '1231231234'),
('Brown', 'Oliver', '2011-07-19', 'New York', 'Male', 'STU002', '2021-09-01', 2, 'A+', 'Asthma', 'Sunrise School', 'Atheist', 'William', 'Brown', '4564564567'),
('Wilson', 'Sophia', '2009-12-10', 'Toronto', 'Female', 'STU003', '2019-09-01', 1, 'B+', 'Diabetes', 'Greenfield School', 'Muslim', 'David', 'Wilson', '7897897890');



-- Table des employés (Employees)
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')) DEFAULT 'Male',
  registration_number TEXT UNIQUE,
  picture BLOB,
  national_id TEXT UNIQUE,
  mobile_number TEXT UNIQUE,
  nationality TEXT,
  date_of_joining DATE NOT NULL,
  employee_role TEXT NOT NULL,
  monthly_salary REAL DEFAULT 0,
  experience TEXT,
  religion TEXT,
  email TEXT UNIQUE,
  address TEXT
);

INSERT INTO employees (surname, name, date_of_birth, gender, registration_number, national_id, mobile_number, nationality, date_of_joining, employee_role, monthly_salary, experience, religion, email, address)
VALUES 
('Smith', 'John', '1980-05-15', 'Male', 'EMP001', 'NI123456789', '1234567890', 'British', '2010-09-01', 'Teacher', 2500.00, '10 years', 'Christian', 'john.smith@example.com', '123 Oxford St, London'),
('Doe', 'Jane', '1985-08-22', 'Female', 'EMP002', 'NI987654321', '0987654321', 'American', '2015-01-15', 'Teacher', 2200.00, '5 years', 'Atheist', 'jane.doe@example.com', '456 Maple St, New York'),
('Miller', 'Tom', '1990-11-12', 'Male', 'EMP003', 'NI112233445', '1122334455', 'Canadian', '2018-05-10', 'Admin', 1800.00, '3 years', 'Muslim', 'tom.miller@example.com', '789 Pine St, Toronto');

UPDATE classes SET teacher_id = 1 WHERE id = 1; -- John Smith est l'enseignant de Class A
UPDATE classes SET teacher_id = 2 WHERE id = 2; -- Jane Doe est l'enseignante de Class B