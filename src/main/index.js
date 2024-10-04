import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const electron = require("electron");
const log = require('electron-log');
const path = require("path");
const fs = require("fs");
const sqlite = require("sqlite3");
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 670,
    show: false,
    frame: true,
    autoHideMenuBar: true,
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

// Function To Close Window
ipcMain.handle("close", (event, args) => {
  switch (args) {
    case "mainWindow":
      app.quit();
      break;
    default:
      break;
  }
});

//---------------------STUDENTS-----------------------------
//get all students
ipcMain.handle("get-students", (event, args) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        students.*,
        classes.name AS className
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

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO students (
      name, surname, birthDate, birthPlace, gender, admissionDate, classId, 
       schoolFee, paidFee, bloodGroup, medicalCondition, 
      previousSchool, religion, additionalNote, parentName, parentSurname, parentPhone
    ) VALUES (${',?'.repeat(18).slice(1)})`;

    const values = [
      formData.name, formData.surname, formData.birthDate, formData.birthPlace,
      formData.gender, formData.admissionDate, formData.classId, formData.schoolFee,
      formData.paidFee, formData.bloodGroup, formData.medicalCondition,
      formData.previousSchool, formData.religion, formData.additionalNote,
      formData.parentName, formData.parentSurname, formData.parentPhone
    ];

    database.run(query, values, function(err) {
      if (err) {
        console.error("Error adding student:", err.message);
        reject({ success: false, error: err.message });
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
    const query = `
      UPDATE students SET
        surname = ?, name = ?, birthDate = ?, birthPlace = ?, gender = ?,
        regNumber = ?, admissionDate = ?, classId = ?,
        schoolFee = ?, paidFee = ?, bloodGroup = ?, medicalCondition = ?,
        previousSchool = ?, religion = ?, additionalNote = ?,
        parentName = ?, parentSurname = ?, parentPhone = ?
      WHERE id = ?
    `;

    const {
      surname, name, birthDate, birthPlace, gender, regNumber, admissionDate, 
      classId,  schoolFee, paidFee, bloodGroup, medicalCondition, 
      previousSchool, religion, additionalNote, parentName, parentSurname, 
      parentPhone, id
    } = formData;

    return new Promise((resolve, reject) => {
      database.run(query, [
        surname, name, birthDate, birthPlace, gender, regNumber, admissionDate, 
        classId,  schoolFee, paidFee, bloodGroup, medicalCondition, 
        previousSchool, religion, additionalNote, parentName, parentSurname, 
        parentPhone, id
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
ipcMain.handle('delete-student', async (event, student_id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM students WHERE id = ?';

    database.run(query, [student_id], function(err) {
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
      surname, name, birthDate, gender, regNumber,
      nationalId, phone, nationality, joinDate, role,
      salary, experience, religion, email, address, id
    } = formData;

    return new Promise((resolve, reject) => {
      database.run(query, [
        surname, name, birthDate, gender, regNumber,
        nationalId, phone, nationality, joinDate, role,
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
      delete newEmployee.date_of_birth;
      console.log("Received employee data:", newEmployee);

      const insertQuery = `
        INSERT INTO employees (
          name, surname, birthDate, gender, regNumber, nationalId, 
          phone, nationality, joinDate, role, salary, 
          experience, religion, email, address
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const { name, surname, birthDate, gender, regNumber, nationalId, 
              phone, nationality, joinDate, role, salary, 
              experience, religion, email, address } = newEmployee;

     database.run(insertQuery, [
        name, surname, birthDate, gender, regNumber,  
        nationalId, phone, nationality, joinDate, role, 
        salary, experience, religion, email, address
      ], function (err) {
        if (err) {
          console.error("Error adding employee to database:", err);
          return reject("Failed to add employee to the database.");
        }

        resolve({ id: this.lastID, message: "Employee added successfully" });
      });

    } catch (error) {
      console.error("Error adding employee:", error);
      reject("Failed to add employee. Please try again.");
    }
  });
});

/* ---------------- CLASSEs ----------------*/
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
    const query = 'INSERT INTO classes (name, class_fees) VALUES (?, ?)';
    const { name,  class_fees } = newClass;
    database.run(query, [name,  class_fees], function(err) {
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
        class_fees = ?
      WHERE id = ? 
    `; 

    const { name, class_fees, id } = formData;
    return new Promise((resolve, reject) => {
      database.run(query, [name, class_fees, id], function(err) {
        if (err) {
          console.error("Error updating class:", err.message);
          reject({ success: false, error: err.message });
        } else {
          resolve({ success: true, updatedId: this.lastID });
        }
      });
    // update all student school_fee who are in this class
    const query2 = 'UPDATE students SET schoolFee = ? WHERE classId = ?';
    database.run(query2, [class_fees, id], function(err) {
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
});

// Handle database reset
ipcMain.handle('reset-database', async () => {
  try {
    let dbPath, sqlFilePath;

    if (process.env.NODE_ENV === 'dev') {
      dbPath = path.join(__dirname, '../resources/app.asar.unpacked/resources/database.db');
      sqlFilePath = path.join(__dirname, '../resources/app.asar.unpacked/resources/database.sql');
    } else {
      dbPath = path.join(__dirname, '../../resources/database.db');
      sqlFilePath = path.join(__dirname, '../../resources/database.sql');
    }

    // Open the existing database connection
    const db = new sqlite.Database(dbPath);

    return new Promise((resolve, reject) => {
      // Read the SQL schema file
      const sql = fs.readFileSync(sqlFilePath, 'utf8');

      db.serialize(() => {
        // Disable foreign keys
        db.exec("PRAGMA foreign_keys = OFF;", (err) => {
          if (err) {
            db.close();
            return reject(`Failed to disable foreign keys: ${err.message}`);
          }

          // Drop all existing tables
          db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
            if (err) {
              db.close();
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
                db.close();
              });
          });
        });
      });
    });
  } catch (err) {
    return `Error resetting the database: ${err.message}`;
  }
});

/* ----------------PAYEMENTS ----------------------*/
//get all payments
ipcMain.handle("get-all-payments", async (event, args) => {
  return new Promise((resolve, reject) => {
    database.all("SELECT * FROM student_payments", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

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
    console.log("Received payment data:", newPayment);
    const query = 'INSERT INTO student_payments (title, student_id, discount, payment_date, amount_paid ,amount) VALUES (?, ?, ?, ?, ?,?)';
    const { title, student_id, discount, payment_date, amount_paid ,amount} = newPayment;
    database.run(query, [title, student_id, discount, payment_date, amount_paid ,amount], function(err) {
      if (err) {
        console.error('Error adding payment:', err.message);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, insertedId: this.lastID });
      }
    });
    if (newPayment.title.toLowerCase() =="Tuition fee".toLowerCase()) 
    {
      // augmenter paidFee dans la table student
      const query2 = 'UPDATE students SET paidFee = paidFee + ? WHERE id = ?';
      database.run(query2, [amount_paid, student_id], function(err) {
      if (err) {
        console.error('Error adding payment:', err.message);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, insertedId: this.lastID });
      }
      });
    }
  });
});

//to edit a payment
ipcMain.handle("edit-payment", async (event, editedPayment) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE student_payments SET title = ?, student_id = ?, discount = ?, payment_date = ?, amount_paid = ? , amount = ? WHERE id = ?';
    const { id, title, student_id, discount, payment_date, amount_paid , amount} = editedPayment;
    database.run(query, [title, student_id, discount, payment_date, amount_paid , amount, id], function(err) {
      if (err) {
        console.error('Error editing payment:', err.message);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, updatedId: this.lastID });
      }
    });
    if (editedPayment.title.toLowerCase() =="Tuition fee".toLowerCase()) 
    {
      // augmenter paidFee dans la table student
      const query2 = 'UPDATE students SET paidFee = paidFee + ? WHERE id = ?';
      database.run(query2, [amount_paid, student_id], function(err) {
      if (err) {
        console.error('Error adding payment:', err.message);
        reject({ success: false, error: err.message });
      }
    });
    }
  });
});