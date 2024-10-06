-- Table des classes (Classes)
CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  class_fees REAL DEFAULT 0
);

INSERT INTO classes (name, class_fees) VALUES ('CP1', 0);
INSERT INTO classes (name, class_fees) VALUES ('CP2', 0);
INSERT INTO classes (name, class_fees) VALUES ('CE1', 0);
INSERT INTO classes (name, class_fees) VALUES ('CE2', 0);
INSERT INTO classes (name, class_fees) VALUES ('CM1', 0);
INSERT INTO classes (name, class_fees) VALUES ('CM2', 0);
INSERT INTO classes (name, class_fees) VALUES ('6ème', 0);
INSERT INTO classes (name, class_fees) VALUES ('5ème', 0);
INSERT INTO classes (name, class_fees) VALUES ('4ème', 0);
INSERT INTO classes (name, class_fees) VALUES ('3ème', 0);
INSERT INTO classes (name, class_fees) VALUES ('S1', 0);
INSERT INTO classes (name, class_fees) VALUES ('S2', 0);
INSERT INTO classes (name, class_fees) VALUES ('S3', 0);




-- Table des étudiants (Students)
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  picture BLOB default null,
  name TEXT NOT NULL,
  birthDate DATE NOT NULL,
  birthPlace TEXT,
  gender TEXT NOT NULL DEFAULT 'Other',
  regNumber TEXT ,
  admissionDate DATE NOT NULL,
  classId INTEGER,
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

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ADELEKE', 'Favour', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ADOMPRE', 'Divine favour', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AHODETO', 'Kodjo mathias', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('BAKOYA', 'Nerhon clovis', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('DEGAHOUE', 'Auguste', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('EKUE', 'Eunice', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('EMEH', 'Chiamaka charity chiyindu', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('GBENYO', 'Ivana merveille', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('IKECHUKWU', 'Elijah', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ("N'WAOGBURU", 'David', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('NEGBLE', 'Komlanvi mawuenyegan samuel', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('OZIOKO', 'Marvellous oluebubechukwu', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('TSONYA', 'Dziedzom gloria', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ADANVESSO', 'Jébouse', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AFANVI', 'Kokou olivier', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AHONSU', 'Neil', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AMETE', 'Aguilar', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AMUZU', 'Wisdom', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ATITSO', 'Kokou wilfried', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('BOCCO', 'Gift', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('DANSOU', 'Sarah', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ETSE', 'Abla perfect', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('KODJO', 'Mawupemo pélagie', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('KOUMEDJINA', 'Kokou israel', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('SALLAH', 'Grace', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AHONSU', 'Neil', '2018-05-31', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ADANVESSO', 'Jeboel', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AFANVI', 'Kokou olivier', '2017-07-12', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AMETE', 'Aguilar ruth', '2018-01-12', 'F', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AMUZU', 'Wisdom', '2017-06-03', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ATITSO', 'Kokou wilfried', '2016-11-09', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ALI', 'Chukwu buikem', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CE2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AMETE', 'Rebecca esther', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CE2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AVOUGLAH', 'Afi daphney', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CE2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AZIAGLLE', 'Jacques', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CE2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AKUETEY', 'Sheila', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CM2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('BAKOYA', 'Dilonne alvin', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CM2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('BOCCO', 'Keysha', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CM2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ADELEKE', 'Mercy iyanun', '2012-02-27', 'F', (SELECT id FROM classes WHERE name = '6ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('BAKOYA', 'Dilonne alvin', '2013-02-07', 'M', (SELECT id FROM classes WHERE name = '6ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('BOCCO', 'Keysha', '2014-01-14', 'F', (SELECT id FROM classes WHERE name = '6ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AYENA', 'Bénit céphas', '2012-05-10', 'M', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ENOCK', 'Ijeoma', '2014-02-14', 'F', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('IKWEGBU', 'Chiderah precious', '2010-11-12', 'F', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('IKWEGBU', 'Grace chinazaekpere', '2011-06-22', 'F', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('KOUDJODJI', 'Afi perfect', '2012-12-07', 'F', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AMUZU', 'Israel wolanyo esidkenu', '2012-07-27', 'M', (SELECT id FROM classes WHERE name = '4ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ADJOH', 'Akossiwa olivia', '2010-07-12', 'F', (SELECT id FROM classes WHERE name = '4ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('BENTO', 'Adeyemi justine', '2011-03-12', 'F', (SELECT id FROM classes WHERE name = '4ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('KEDE', 'Koffi daniel', '2009-12-11', 'M', (SELECT id FROM classes WHERE name = '4ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AGWO', 'Bethel', '2006-06-27', 'F', (SELECT id FROM classes WHERE name = '3ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('KATANGA', 'Kevin', '2010-01-26', 'M', (SELECT id FROM classes WHERE name = '3ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ONYEABO', 'Okechukwu elijah', '2011-03-03', 'M', (SELECT id FROM classes WHERE name = '3ème'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AKODE', 'Kodjo gewinner', '2021-10-18', 'M', (SELECT id FROM classes WHERE name = 'S1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ANABA', 'David chibuzor', '2021-05-10', 'M', (SELECT id FROM classes WHERE name = 'S1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ANABA', 'Destiny chinecherem', '2021-05-10', 'M', (SELECT id FROM classes WHERE name = 'S1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('DOTTO', 'Rhema kessinonou eyram', '2021-03-02', 'F', (SELECT id FROM classes WHERE name = 'S1'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('KPOGNON', 'Yoshua', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'S2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('IKECHUKWU', 'Grace', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'S2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('SODJI', 'Walter', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'S2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('KOHOU', 'Bénit darel', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'S2'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('AFANVI', 'Yawa fidèle', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'S3'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ALI', 'Chiamanda', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'S3'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('ALI', 'Chisimdili', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'S3'), '2023-09-01');

INSERT INTO students (name, surname, birthDate, gender, classId, admissionDate) 
VALUES ('CHUKWUEMEKA', 'Gloria', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'S3'), '2023-09-01');

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





-- Ajout d'une colonne pour le montant total de la scolarité dans la table students
ALTER TABLE students ADD COLUMN total_fees REAL DEFAULT 0;

-- Table des paiements des étudiants (Student_Payments)
CREATE TABLE IF NOT EXISTS student_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  student_id INTEGER NOT NULL,
  paymentDate DATE NOT NULL,
  amount REAL NOT NULL,
  amount_paid REAL NOT NULL,
  discount REAL DEFAULT 0,
  description TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Table des notes des étudiants (Student_Notes)
CREATE TABLE IF NOT EXISTS student_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  value REAL NOT NULL,
  noteDate DATE NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);  