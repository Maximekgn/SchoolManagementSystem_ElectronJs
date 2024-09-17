-- -----------------------------------------------------
-- Table structure for table `employees`
-- -----------------------------------------------------
CREATE TABLE `employees` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
  registration_number TEXT UNIQUE NOT NULL,
  date_of_birth DATE,
  picture BLOB,
  national_id TEXT UNIQUE,
  mobile_number TEXT,
  nationality TEXT,
  date_of_joining DATE,
  employee_role TEXT,
  monthly_salary DECIMAL(10,2),
  experience TEXT,
  religion TEXT,
  email TEXT UNIQUE,
  address TEXT
);

CREATE INDEX idx_employees_registration_number ON employees(registration_number);
CREATE INDEX idx_employees_email ON employees(email);

-- -----------------------------------------------------
-- Table structure for table `students`
-- -----------------------------------------------------
CREATE TABLE `students` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  date_of_birth DATE,
  place_of_birth TEXT,
  gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')),
  picture BLOB,
  registration_number TEXT UNIQUE NOT NULL,
  date_of_admission DATE,
  class_id INTEGER,
  discount_in_fee DECIMAL(10,2) DEFAULT 0,
  blood_group TEXT,
  medical_condition TEXT,
  previous_school TEXT,
  religion TEXT,
  additional_note TEXT,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE INDEX idx_students_registration_number ON students(registration_number);
CREATE INDEX idx_students_class ON students(class_id);

-- -----------------------------------------------------
-- Table structure for table `parents`
-- -----------------------------------------------------
CREATE TABLE `parents` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT CHECK(relationship IN ('Father', 'Mother', 'Guardian')),
  mobile_number TEXT,
  email TEXT UNIQUE,
  occupation TEXT,
  address TEXT
);

CREATE INDEX idx_parents_email ON parents(email);

-- -----------------------------------------------------
-- Table structure for table `student_parent_relationship`
-- -----------------------------------------------------
CREATE TABLE `student_parent_relationship` (
  student_id INTEGER,
  parent_id INTEGER,
  PRIMARY KEY (student_id, parent_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- Table structure for table `classes`
-- -----------------------------------------------------
CREATE TABLE `classes` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  capacity INTEGER,
  teacher_id INTEGER,
  FOREIGN KEY (teacher_id) REFERENCES employees(id)
);

-- -----------------------------------------------------
-- Table structure for table `subjects`
-- -----------------------------------------------------
CREATE TABLE `subjects` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- -----------------------------------------------------
-- Table structure for table `class_subjects`
-- -----------------------------------------------------
CREATE TABLE `class_subjects` (
  class_id INTEGER,
  subject_id INTEGER,
  teacher_id INTEGER,
  PRIMARY KEY (class_id, subject_id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id),
  FOREIGN KEY (teacher_id) REFERENCES employees(id)
);

-- -----------------------------------------------------
-- Table structure for table `attendance`
-- -----------------------------------------------------
CREATE TABLE `attendance` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  class_id INTEGER,
  date DATE,
  status TEXT CHECK(status IN ('Present', 'Absent', 'Late')),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE INDEX idx_attendance_date ON attendance(date);

-- -----------------------------------------------------
-- Table structure for table `grades`
-- -----------------------------------------------------
CREATE TABLE `grades` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  subject_id INTEGER,
  grade DECIMAL(5,2),
  term TEXT,
  academic_year TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE INDEX idx_grades_student ON grades(student_id);

-- -----------------------------------------------------
-- Table structure for table `payment_types`
-- -----------------------------------------------------
CREATE TABLE `payment_types` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Table structure for table `payments`
-- -----------------------------------------------------
CREATE TABLE `payments` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payer_id INTEGER NOT NULL,
  payer_type TEXT CHECK(payer_type IN ('Student', 'Employee')) NOT NULL,
  payment_type_id INTEGER NOT NULL,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  remarks TEXT,
  FOREIGN KEY (payment_type_id) REFERENCES payment_types(id)
);

CREATE INDEX idx_payments_payer ON payments(payer_id, payer_type);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- -----------------------------------------------------
-- Table structure for table `student_fees`
-- -----------------------------------------------------
CREATE TABLE `student_fees` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  total_fee DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0.00,
  amount_due DECIMAL(10,2) GENERATED ALWAYS AS (total_fee - amount_paid) STORED,
  start_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT CHECK(status IN ('Pending', 'Paid', 'Partially Paid')) DEFAULT 'Pending',
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX idx_student_fees_student ON student_fees(student_id);
CREATE INDEX idx_student_fees_status ON student_fees(status);

-- -----------------------------------------------------
-- Insert test data
-- -----------------------------------------------------

-- Insert payment types
INSERT INTO payment_types (name) VALUES 
('School Fees'), ('Uniform'), ('Trip'), ('Salary'), ('Bonus'), ('Miscellaneous');

-- Insert employees
INSERT INTO employees (surname, name, gender, registration_number, date_of_birth, national_id, mobile_number, nationality, date_of_joining, employee_role, monthly_salary, email)
VALUES 
('Smith', 'John', 'Male', 'EMP001', '1980-05-15', 'NID123456', '+1234567890', 'USA', '2020-01-01', 'Teacher', 5000.00, 'john.smith@school.com'),
('Johnson', 'Emily', 'Female', 'EMP002', '1985-08-22', 'NID789012', '+1987654321', 'UK', '2019-09-01', 'Administrator', 4500.00, 'emily.johnson@school.com');

-- Insert classes
INSERT INTO classes (name, capacity, teacher_id)
VALUES 
('Grade 1A', 30, 1),
('Grade 2B', 25, 2);

-- Insert subjects
INSERT INTO subjects (name, description)
VALUES 
('Mathematics', 'Basic arithmetic and problem-solving'),
('English', 'Grammar, reading, and writing skills');

-- Insert class_subjects
INSERT INTO class_subjects (class_id, subject_id, teacher_id)
VALUES 
(1, 1, 1),
(1, 2, 2),
(2, 1, 1),
(2, 2, 2);

-- Insert students
INSERT INTO students (surname, name, gender, registration_number, date_of_birth, class_id, date_of_admission)
VALUES 
('Brown', 'Alice', 'Female', 'STU001', '2015-03-10', 1, '2021-09-01'),
('Davis', 'Bob', 'Male', 'STU002', '2014-11-25', 2, '2020-09-01');

-- Insert parents
INSERT INTO parents (surname, name, relationship, mobile_number, email)
VALUES 
('Brown', 'Michael', 'Father', '+1122334455', 'michael.brown@email.com'),
('Davis', 'Sarah', 'Mother', '+5544332211', 'sarah.davis@email.com');

-- Insert student_parent_relationship
INSERT INTO student_parent_relationship (student_id, parent_id)
VALUES 
(1, 1),
(2, 2);

-- Insert attendance
INSERT INTO attendance (student_id, class_id, date, status)
VALUES 
(1, 1, '2023-09-01', 'Present'),
(2, 2, '2023-09-01', 'Present'),
(1, 1, '2023-09-02', 'Absent'),
(2, 2, '2023-09-02', 'Present');

-- Insert grades
INSERT INTO grades (student_id, subject_id, grade, term, academic_year)
VALUES 
(1, 1, 85.5, 'Fall', '2023-2024'),
(1, 2, 90.0, 'Fall', '2023-2024'),
(2, 1, 78.5, 'Fall', '2023-2024'),
(2, 2, 88.0, 'Fall', '2023-2024');

-- Insert student_fees
INSERT INTO student_fees (student_id, total_fee, amount_paid, start_date, due_date, status)
VALUES 
(1, 1000.00, 500.00, '2023-09-01', '2023-12-31', 'Partially Paid'),
(2, 1000.00, 1000.00, '2023-09-01', '2023-12-31', 'Paid');

-- Insert payments
INSERT INTO payments (payer_id, payer_type, payment_type_id, amount_paid, payment_date, remarks)
VALUES 
(1, 'Student', 1, 500.00, '2023-09-15', 'First installment'),
(2, 'Student', 1, 1000.00, '2023-09-05', 'Full payment'),
(1, 'Employee', 4, 5000.00, '2023-09-30', 'September salary'),
(2, 'Employee', 4, 4500.00, '2023-09-30', 'September salary');