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

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Favour', 'ADELEKE', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Divine Favour', 'ADOMPRE', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Kodjo Mathias', 'AHODETO', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Nerhon Clovis', 'BAKOYA', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Auguste', 'DEGAHOUE', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Eunice', 'EKUE', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Chiamaka Charity Chiyindu', 'EMEH', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Ivana Merveille', 'GBENYO', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Elijah', 'IKECHUKWU', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('David', "N'WAOGBURU", '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Komlanvi Mawuenyegan Samuel', 'NEGBLE', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Marvellous Oluebubechukwu', 'OZIOKO', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Dziedzom Gloria', 'TSONYA', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Jébouse', 'ADANVESSO', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Kokou Olivier', 'AFANVI', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Neil', 'AHONSU', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Aguilar', 'AMETE', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Wisdom', 'AMUZU', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Kokou Wilfried', 'ATITSO', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Gift', 'BOCCO', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Sarah', 'DANSOU', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Abla Perfect', 'ETSE', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Mawupemo Pélagie', 'KODJO', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Kokou Israel', 'KOUMEDJINA', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('Grace', 'SALLAH', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CP2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AHONSU', 'Neil', '2018-05-31', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ADANVESSO', 'Jeboel', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AFANVI', 'Kokou Olivier', '2017-07-12', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AMETE', 'Aguilar Ruth', '2018-01-12', 'F', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AMUZU', 'Wisdom', '2017-06-03', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ATITSO', 'Kokou Wilfried', '2016-11-09', 'M', (SELECT id FROM classes WHERE name = 'CE1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ALI', 'Chukwu Buikem', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CE2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AMETE', 'Rebecca Esther', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CE2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AVOUGLAH', 'Afi Daphney', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CE2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AZIAGLLE', 'Jacques', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CE2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AKUETEY', 'Sheila', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CM2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('BAKOYA', 'Dilonne Alvin', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'CM2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('BOCCO', 'Keysha', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'CM2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ADELEKE', 'Mercy Iyanun', '2012-02-27', 'F', (SELECT id FROM classes WHERE name = '6ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('BAKOYA', 'Dilonne Alvin', '2013-02-07', 'M', (SELECT id FROM classes WHERE name = '6ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('BOCCO', 'Keysha', '2014-01-14', 'F', (SELECT id FROM classes WHERE name = '6ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AYENA', 'Bénit Céphas', '2012-05-10', 'M', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ENOCK', 'Ijeoma', '2014-02-14', 'F', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('IKWEGBU', 'Chiderah Precious', '2010-11-12', 'F', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('IKWEGBU', 'Grace Chinazaekpere', '2011-06-22', 'F', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('KOUDJODJI', 'Afi Perfect', '2012-12-07', 'F', (SELECT id FROM classes WHERE name = '5ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AMUZU', 'Israel Wolanyo Esidkenu', '2012-07-27', 'M', (SELECT id FROM classes WHERE name = '4ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ADJOH', 'Akossiwa Olivia', '2010-07-12', 'F', (SELECT id FROM classes WHERE name = '4ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('BENTO', 'Adeyemi Justine', '2011-03-12', 'F', (SELECT id FROM classes WHERE name = '4ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('KEDE', 'Koffi Daniel', '2009-12-11', 'M', (SELECT id FROM classes WHERE name = '4ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AGWO', 'Bethel', '2006-06-27', 'F', (SELECT id FROM classes WHERE name = '3ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('KATANGA', 'Kevin', '2010-01-26', 'M', (SELECT id FROM classes WHERE name = '3ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ONYEABO', 'Okechukwu Elijah', '2011-03-03', 'M', (SELECT id FROM classes WHERE name = '3ème'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AKODE', 'Kodjo Gewinner', '2021-10-18', 'M', (SELECT id FROM classes WHERE name = 'S1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ANABA', 'David Chibuzor', '2021-05-10', 'M', (SELECT id FROM classes WHERE name = 'S1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ANABA', 'Destiny Chinecherem', '2021-05-10', 'M', (SELECT id FROM classes WHERE name = 'S1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('DOTTO', 'Rhema Kessinonou Eyram', '2021-03-02', 'F', (SELECT id FROM classes WHERE name = 'S1'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('KPOGNON', 'Yoshua', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'S2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('IKECHUKWU', 'Grace', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'S2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('SODJI', 'Walter', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'S2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('KOHOU', 'Bénit Darel', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'S2'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('AFANVI', 'Yawa Fidèle', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'S3'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ALI', 'Chiamanda', '2023-01-01', 'F', (SELECT id FROM classes WHERE name = 'S3'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
VALUES ('ALI', 'Chisimdili', '2023-01-01', 'M', (SELECT id FROM classes WHERE name = 'S3'), '2023-09-01');

INSERT INTO students (surname, name, birthDate, gender, classId, admissionDate) 
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
  payment_date DATE NOT NULL,
  amount REAL NOT NULL,
  amount_paid REAL NOT NULL,
  discount REAL DEFAULT 0,
  description TEXT,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);