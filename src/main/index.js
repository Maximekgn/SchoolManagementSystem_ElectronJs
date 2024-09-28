import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const electron = require("electron");
const log = require('electron-log');
const path = require("path");
const fs = require("fs");
const sqlite = require("sqlite3");
const fse = require("fs-extra");
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
import express from 'express';
 
let mainWindow , CourseWindow;
function createWindow() {
  if (!is.dev) {
    const exApp = express();
    exApp.use(express.static(path.join(__dirname, '../renderer/')));
    exApp.listen(5173, () => {
      log.info('Express server started on port 5173');
    });
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: true, // Changed to true to show default window frame
    autoHideMenuBar: true, // Changed to false to show menu bar
    ...(process.platform === 'linux' ? { icon: path.join(__dirname, 'path/to/icon.png') } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      webSecurity: true
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  log.info(`Preload script path: ${path.join(__dirname, '../preload/index.js')}`);

  // Load the appropriate URL based on the environment
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  return mainWindow;
}



app.whenReady().then(() => {
  log.info("Ready")
  electronApp.setAppUserModelId('com.exampapersetter')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on("uncaughtException", (error) => {
  log.info(`Exception: ${error}`);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

log.info(process.resourcesPath)

//Database Connection And Instance
const database = new sqlite.Database(
  is.dev
    ? path.join(path.join(app.getAppPath(), "resources/database.db"))
    : path.join(__dirname, "../../resources/database.db").replace("app.asar", "app.asar.unpacked"),
  (err) => {
    if (err) log.log("Database Error" + app.getAppPath());
    else log.log("Database Loaded sucessfully");
  }
);

// Function To Minimize Window
ipcMain.handle("minimize", () => {
  mainWindow.minimize();
});

// Function To Maximize Window
ipcMain.handle("maximize", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle("showDialog", async (event, args) => {
  let win = null;
  switch (args.window) {
    case "mainWindow":
      win = mainWindow;
      break;
    case "CourseWindow":
      win = CourseWindow;
      break;
    default:
      break;
  }

  return dialog.showMessageBox(win, args.options);
});

ipcMain.handle("saveFile", async (event, args) => {
  let options = {
    title: "Save files",

    defaultPath: app.getPath("downloads"),

    buttonLabel: "Save Output File",

    properties: ["openDirectory"],
  };

  let filename = await dialog.showOpenDialog(mainWindow, options);
  if (!filename.canceled) {
    var base64Data = args.replace(/^data:application\/pdf;base64,/, "");
    
    const p = path.join(filename.filePaths[0], "/exampaper")
    if (!fs.existsSync(p)){
      fs.mkdirSync(p);
    }
    fs.writeFileSync(
      path.join(p, "output.pdf"),
      base64Data,
      "base64"
    );


    fse.copySync("input", path.join(p,"input"))
      
  }
});

// Function To Close Window
ipcMain.handle("close", (event, args) => {
  switch (args) {
    case "mainWindow":
      app.quit();
      break;
    case "CourseWindow":
      mainWindow.webContents.send("reload");
      CourseWindow.close();
      break;
    default:
      break;
  }
});

//---------------------STUDENTS-----------------------------
/*
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
  bloudGroup TEXT ,
  medicalCondition TEXT,
  previousSchool TEXT,
  religion TEXT,
  additionalNote TEXT,
  parentName TEXT,
  parentSurname TEXT,
  parentPhone TEXT,
  FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE SET NULL
);
*/
//get all students
ipcMain.handle("get-students", (event, args) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        students.id, 
        students.surname, 
        students.name, 
        students.birthDate,
        students.birthPlace,
        students.gender,
        students.regNumber,
        students.admissionDate,
        students.classId,
        students.discountFee,
        students.schoolFee,
        students.paidFee,
        students.bloodGroup,
        students.medicalCondition,
        students.previousSchool,
        students.religion,
        students.additionalNote,
        students.parentName,
        students.parentSurname,
        students.parentPhone,
        students.regNumber,
        classes.name AS className, 
        classes.capacity, 
        classes.class_fees
      FROM students
      LEFT JOIN classes ON students.classId = classes.id
    `;

    database.all(query, (err, rows) => {
      if (err) {
        console.error("Error fetching students:", err.message);
        reject(err); 
      } else {
        resolve(rows); 
      }
    });
  });
});

//add a student 
ipcMain.handle("add-student", async (event, formData) => {
  console.log("Received student data:", formData);

  // Validation des données (ignorer si c'est une réponse de succès)
  if (typeof formData === 'object' && formData.success) {
    console.log('Ignoring success response data');
    return; // Ignorer si les données sont la réponse de succès
  }

  // Validation stricte pour s'assurer que les données correctes sont reçues
  if (!formData.surname || formData.surname.trim() === '') {
    console.error("Validation error: Surname is required");
    return { success: false, error: "Surname is required" };
  }

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO students (
      name, surname, birthDate, birthPlace, gender, admissionDate, classId, 
      discountFee, schoolFee, paidFee, bloudGroup, medicalCondition, 
      previousSchool, religion, additionalNote, parentName, parentSurname, parentPhone
    ) VALUES (${',?'.repeat(18).slice(1)})`;

    const values = [
      formData.name, formData.surname, formData.birthDate, formData.birthPlace,
      formData.gender, formData.admissionDate, formData.classId, formData.discountFee,
      formData.schoolFee, formData.paidFee, formData.bloudGroup, formData.medicalCondition,
      formData.previousSchool, formData.religion, formData.additionalNote,
      formData.parentName, formData.parentSurname, formData.parentPhone
    ];

    database.run(query, values, function(err) {
      if (err) {
        console.error("Error adding student:", err.message);
        resolve({ success: false, error: err.message });
      } else {
        console.log("Student added successfully. ID:", this.lastID);
        resolve({ success: true, id: this.lastID });
      }
    });
  });
});




// update a student
ipcMain.handle("update-student", async (event, formData) => {
  try {
    // Input validation
    const requiredFields = ['surname', 'name', 'birthDate', 'gender', 'regNumber', 'classId'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    const query = `
      UPDATE students SET
        surname = ?,
        name = ?,
        birthDate = ?,
        birthPlace = ?,
        gender = ?,
        regNumber = ?,
        admissionDate = ?,
        classId = ?,
        bloodGroup = ?,
        medicalCondition = ?,
        previousSchool = ?,
        religion = ?,
        parentName = ?,
        parentSurname = ?,
        parentPhone = ?
      WHERE id = ?
    `;

    const {
      surname, name, birthDate, birthPlace, gender,
      regNumber, admissionDate, classId, bloodGroup,
      medicalCondition, previousSchool, religion, parentName,
      parentSurname, parentPhone, id
    } = formData;

    return new Promise((resolve, reject) => {
      database.run(query, [
        surname, name, birthDate, birthPlace, gender,
        regNumber, admissionDate, classId, bloodGroup,
        medicalCondition, previousSchool, religion, parentName,
        parentSurname, parentPhone, id
      ], function(err) {
        if (err) {
          console.error("Error updating student:", err.message);
          reject({ success: false, error: err.message });
        } else {
          resolve({ success: true, updatedId: id });
        }
      });
    });
  } catch (error) {
    console.error("Error in update-student handler:", error);
    return { success: false, error: error.message };
  }
});


//delete a student
ipcMain.handle('delete-student', async (event, studentId) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM students WHERE id = ?';

    database.run(query, [studentId], function(err) {
      if (err) {
        console.error('Error deleting student:', err.message);
        reject({ success: false, error: err.message });
      } else {
        if (this.changes > 0) {
          resolve({ success: true, message: 'Student deleted successfully' });
        } else {
          reject({ success: false, error: 'No student found with the given ID' });
        }
      }
    });
  });
});


//----------------------EMPLOYEES----------------------
/*id INTEGER PRIMARY KEY AUTOINCREMENT,
  surname TEXT NOT NULL,
  name TEXT NOT NULL,
  birthDate DATE,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')) DEFAULT 'Male',
  regNumber TEXT UNIQUE,
  picture BLOB,
  nationalId TEXT UNIQUE,
  phone TEXT UNIQUE,
  nationality TEXT,
  joinDate DATE NOT NULL,
  role TEXT NOT NULL,
  salary REAL DEFAULT 0,
  experience TEXT,
  religion TEXT,
  email TEXT UNIQUE,
  address TEXT*/

//to get all employees
ipcMain.handle("get-employees", (event, args) => {
  return new Promise((resolve, reject) => {
    database.all("SELECT * FROM employees", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
})


//to delete a employee
ipcMain.handle('delete-employee', async (event, employeeId) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM employees WHERE id = ?';
    
    database.run(query, [employeeId], function(err) {
      if (err) {
        console.error('Error deleting employee:', err.message);
        reject({ success: false, error: err.message });
      } else {
        if (this.changes > 0) {
          resolve({ success: true, message: 'Employee deleted successfully' });
        } else {
          reject({ success: false, error: 'No employee found with the given ID' });
        }
      }
    });
  });
})

//to update an employee
ipcMain.handle("update-employee", async (event, formData) => {
  try {
    

    const query = `
      UPDATE employees SET 
        surname = ?, 
        name = ?, 
        birthDate = ?, 
        gender = ?,
        regNumber = ?,
        nationalId = ?,
        phone = ?,
        nationality = ?,
        joinDate = ?,
        role = ?,
        salary = ?,
        experience = ?,
        religion = ?,
        email = ?,
        address = ?
      WHERE id = ?
    `; 

    const {
      surname, name  , birthDate, gender , regNumber
      , nationalId, phone, nationality, joinDate, role ,
      salary, experience, religion, email, address, id
      } = formData;

    return new Promise((resolve, reject) => {
      database.run(query, [
        surname, name  , birthDate, gender , regNumber ,
        nationalId, phone, nationality, joinDate, role ,
        salary, experience, religion, email, address, id
      ], function(err) {
        if (err) {
          console.error("Error updating employee:", err.message);
          reject({ success: false, error: err.message });
        } else {
          resolve({ success: true, updatedId: this.lastID });
        }
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

//to add a new employee
ipcMain.handle("add-employee", async (event, newEmployee) => {
  return new Promise((resolve, reject) => {
    try {

      // supprime date_of_birth
      delete newEmployee.date_of_birth;
      console.log("Received employee data:", newEmployee);


      // Insérer les données de l'employé dans SQLite
      const insertQuery = `
        INSERT INTO employees (
          name, surname, birthDate, gender, regNumber,  nationalId, 
          phone, nationality, joinDate, role, salary, 
          experience, religion, email, address
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const { name, surname, birthDate, gender, regNumber, nationalId, 
              phone, nationality, joinDate, role, salary, 
              experience, religion, email, address } = newEmployee;

      // Exécuter l'insertion dans la base de données
     database.run(insertQuery, [
        name , surname, birthDate, gender, regNumber,  
        nationalId, phone, nationality, joinDate, role, 
        salary, experience, religion, email, address
      ], function (err) {
        if (err) {
          console.error("Error adding employee to database:", err);
          return reject("Failed to add employee to the database.");
        }

        // Si insertion réussie, retourner l'ID de l'employé inséré
        resolve({ id: this.lastID, message: "Employee added successfully" });
      });

    } catch (error) {
      console.error("Error adding employee:", error);
      reject("Failed to add employee. Please try again.");
    }
  });
});





/* ---------------- CLASSEs ----------------*/
/* 
id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  class_fees REAL NOT NULL,
  teacher_id INTEGER,
  FOREIGN KEY (teacher_id) REFERENCES employees(id) ON DELETE SET NULL
*/
//to get all classes
ipcMain.handle("get-classes", (event, args) => {
  return new Promise((resolve, reject) => {
    database.all("SELECT * FROM classes", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
})

// to add a new class
ipcMain.handle("add-class", async (event, newClass) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO classes (name, capacity, class_fees) VALUES (?, ?, ?)';
    const { name, capacity, class_fees } = newClass;
    database.run(query, [name, capacity, class_fees], function(err) {
      if (err) {
        console.error('Error adding class:', err.message);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, insertedId: this.lastID });
      }
    });
  });
})

//to delete a class
ipcMain.handle('delete-class', async (event, classId) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM classes WHERE id = ?';
    
    database.run(query, [classId], function(err) {
      if (err) {
        console.error('Error deleting class:', err.message);
        reject({ success: false, error: err.message });
      } else {
        if (this.changes > 0) {
          resolve({ success: true, message: 'Class deleted successfully' });
        } else {
          reject({ success: false, error: 'No class found with the given ID' });
        }
      }
    });
  });
})

// to update a class
ipcMain.handle("update-class", async (event, formData) => {
  try {
    const query = `
      UPDATE classes SET 
        name = ?,
        teacher_id = ?
      WHERE id = ?
    `; 
    const { name, id } = formData;
    return new Promise((resolve, reject) => {
      database.run(query, [name, teacher_id, id], function(err) {
        if (err) {
          console.error("Error updating class:", err.message);
          reject({ success: false, error: err.message });
        } else {
          resolve({ success: true, updatedId: this.lastID });
        }
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }

})


/* ----------------PAYEMENTS ----------------------*/
/* 
  student_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  student_id INTEGER NOT NULL,
  payement_maker TEXT NOT NULL,
  payment_date DATE NOT NULL,
  amount_paid REAL NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
  employee_salaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  salary_month TEXT NOT NULL,
  salary_paid REAL NOT NULL,
  payment_date DATE NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
*/
//add student payement 
ipcMain.handle("add-student-payement", async (event, newPayement) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO student_payments (title, student_id, payement_maker, payment_date, amount_paid) VALUES (?, ?, ?, ?, ?)';
    const { title, student_id, payement_maker, payment_date, amount_paid } = newPayement;
    database.run(query, [title, student_id, payement_maker, payment_date, amount_paid], function(err) {
      if (err) {
        console.error('Error adding student payement:', err.message);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, insertedId: this.lastID });
      }
    });
  });
})

//add employee payement 
ipcMain.handle("add-employee-payement", async (event, newPayement) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO employee_salaries (employee_id, salary_month, salary_paid, payment_date) VALUES (?, ?, ?, ?)';
    const { employee_id, salary_month, salary_paid, payment_date } = newPayement;
    database.run(query, [employee_id, salary_month, salary_paid, payment_date], function(err) {
      if (err) {
        console.error('Error adding employee payement:', err.message);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, insertedId: this.lastID });
      }
    });
  });
})









// Handle database reset
ipcMain.handle('reset-database', async () => {
  try {
    const dbPath = path.join(__dirname, '../../resources/database.db');
    const sqlFilePath = path.join(__dirname, '../../resources/database.sql');

    // Open the existing database connection
    const db = new sqlite.Database(dbPath);

    return new Promise((resolve, reject) => {
      // Read the SQL schema file
      const sql = fs.readFileSync(sqlFilePath, 'utf8');

      db.serialize(() => {
        // Disable foreign keys
        db.exec("PRAGMA foreign_keys = OFF;", (err) => {
          if (err) {
            db.close();  // Ensure the database is closed on error
            return reject(`Failed to disable foreign keys: ${err.message}`);
          }

          // Drop all existing tables
          db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
            if (err) {
              db.close();  // Ensure the database is closed on error
              return reject(`Error fetching tables: ${err.message}`);
            }

            const dropTablePromises = tables
              .filter(table => table.name !== 'sqlite_sequence')
              .map(table => new Promise((resolve, reject) => {
                db.run(`DROP TABLE IF EXISTS ${table.name}`, (err) => {
                  if (err) {
                    reject(`Failed to drop table ${table.name}: ${err.message}`);
                  } else {
                    resolve();
                  }
                });
              }));

            // Wait for all drop table promises to complete
            Promise.all(dropTablePromises)
              .then(() => {
                // Recreate the database structure from SQL file
                db.exec(sql, (err) => {
                  if (err) {
                    return reject(`Failed to recreate the database structure: ${err.message}`);
                  } else {
                    resolve('Database reset successfully');
                  }
                });
              })
              .catch(err => {
                reject(err);
              })
              .finally(() => {
                db.close();  // Always close the database when finished
              });
          });
        });
      });
    });
  } catch (err) {
    return `Error resetting the database: ${err.message}`;
  }
});



/*-------------------PAYEMENTS----------------- */
/* 
  CREATE TABLE IF NOT EXISTS student_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  student_id INTEGER NOT NULL,
  payement_maker TEXT NOT NULL,
  payment_date DATE NOT NULL,
  amount_paid REAL NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

*/
//get student payements
ipcMain.handle("get-payments", async (event, student_id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM student_payments WHERE student_id = ?';
    database.all(query, [student_id], (err, rows) => {
      if (err) {
        console.error('Error fetching student payments:', err.message);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, payments: rows });
      }
    });
  });
});

// Add a new payment
ipcMain.handle("make-payment", async (event, newPayment) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO student_payments (title, student_id, payment_maker, payment_date, amount_paid) VALUES (?, ?, ?, ?, ?)';
    const { title, student_id, payment_maker, payment_date, amount_paid } = newPayment;
    database.run(query, [title, student_id, payment_maker, payment_date, amount_paid], function(err) {
      if (err) {
        console.error('Error adding payment:', err.message);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, insertedId: this.lastID });
      }
    });
  });
});