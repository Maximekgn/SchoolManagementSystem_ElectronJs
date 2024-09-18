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

//to get all students

// Get all students with their class information
ipcMain.handle("get-students", async (event, args) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all(`
        SELECT s.*, c.name AS class_name 
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return rows;
  } catch (err) {
    console.error("Error retrieving students:", err);
    throw err;
  }
});

// Get all teachers (employees with role 'Teacher')
ipcMain.handle("get-teachers", async (event, args) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all(`
        SELECT * FROM employees 
        WHERE employee_role = 'Teacher'
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return rows;
  } catch (err) {
    console.error("Error retrieving teachers:", err);
    throw err;
  }
});

// Get all employees
ipcMain.handle("get-employees", async (event, args) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all("SELECT * FROM employees", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return rows;
  } catch (err) {
    console.error("Error retrieving employees:", err);
    throw err;
  }
});

ipcMain.handle('add-student-with-parent', async (event, formData) => {
  try {
    const { student, parent } = formData;

    // Start a transaction
    await database.run('BEGIN TRANSACTION');

    // Insert the parent
    const parentResult = await database.run(
      'INSERT INTO parents (surname, name, relationship, mobile_number, email, occupation, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [parent.surname, parent.name, parent.relationship, parent.mobile_number, parent.email, parent.occupation, parent.address]
    );
    const parentId = parentResult.lastID;

    // Insert the student
    const studentResult = await database.run(
      'INSERT INTO students (surname, name, date_of_birth, place_of_birth, gender, picture, registration_number, date_of_admission, class_id, discount_in_fee, blood_group, medical_condition, previous_school, religion, additional_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [student.surname, student.name, student.date_of_birth, student.place_of_birth, student.gender, student.picture, student.registration_number, student.date_of_admission, student.class_id, student.discount_in_fee, student.blood_group, student.medical_condition, student.previous_school, student.religion, student.additional_note]
    );
    const studentId = studentResult.lastID;

    // Create the student-parent relationship
    await database.run(
      'INSERT INTO student_parent_relationship (student_id, parent_id) VALUES (?, ?)',
      [studentId, parentId]
    );

    // Commit the transaction
    await database.run('COMMIT');

    return { success: true, student: { id: studentId, ...student } };
  } catch (error) {
    // If there's an error, roll back the transaction
    await database.run('ROLLBACK');
    console.error('Error adding student and parent:', error);
    return { success: false, error: error.message };
  }
});

// Get students' payments with detailed information
ipcMain.handle('get-students-payments', (event, searchQuery = '') => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT s.name, s.surname, sf.total_fee, sf.amount_paid, sf.amount_due, sf.status,
             c.name AS class_name
      FROM student_fees sf
      JOIN students s ON sf.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
    `;
    let params = [];

    if (searchQuery) {
      query += ` WHERE s.name LIKE ? OR s.surname LIKE ?`;
      params.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    database.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

// Add a payment for a student
ipcMain.handle('add-student-payment', (event, studentId, amountPaid) => {
  return new Promise((resolve, reject) => {
    database.run(`
      UPDATE student_fees 
      SET amount_paid = amount_paid + ?,
          status = CASE 
            WHEN amount_paid + ? >= total_fee THEN 'Paid'
            ELSE 'Partially Paid'
          END
      WHERE student_id = ?
    `, [amountPaid, amountPaid, studentId], function(err) {
      if (err) reject(err);
      else resolve({ success: true, message: 'Payment updated successfully' });
    });
  });
});

// Get all payments with detailed information
ipcMain.handle('get-payments', (event, type = 'all', searchQuery = '') => {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT p.*, 
             COALESCE(s.name || ' ' || s.surname, e.name || ' ' || e.surname) AS payer_name,
             pt.name AS payment_type_name
      FROM payments p
      LEFT JOIN students s ON p.payer_id = s.id AND p.payer_type = 'Student'
      LEFT JOIN employees e ON p.payer_id = e.id AND p.payer_type = 'Employee'
      JOIN payment_types pt ON p.payment_type_id = pt.id
    `;
    let params = [];

    if (type !== 'all') {
      query += ` WHERE p.payer_type = ?`;
      params.push(type);
    }

    if (searchQuery) {
      query += params.length ? ' AND' : ' WHERE';
      query += ` (s.name LIKE ? OR s.surname LIKE ? OR e.name LIKE ? OR e.surname LIKE ?)`;
      params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
    }

    database.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

// Add a new payment
ipcMain.handle('add-payment', (event, payerId, payerType, amount, paymentTypeId, remarks) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO payments (payer_id, payer_type, payment_type_id, amount_paid, payment_date, remarks)
      VALUES (?, ?, ?, ?, date('now'), ?)
    `;

    database.run(query, [payerId, payerType, paymentTypeId, amount, remarks], function(err) {
      if (err) reject(err);
      else resolve({ success: true, message: 'Payment added successfully', id: this.lastID });
    });
  });
});

// New query: Get classes with their assigned teachers
ipcMain.handle('get-classes-with-teachers', async () => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all(`
        SELECT c.*, e.name || ' ' || e.surname AS teacher_name
        FROM classes c
        LEFT JOIN employees e ON c.teacher_id = e.id
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return rows;
  } catch (err) {
    console.error("Error retrieving classes with teachers:", err);
    throw err;
  }
});

// New query: Get subjects for a specific class
ipcMain.handle('get-class-subjects', async (event, classId) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all(`
        SELECT s.*, e.name || ' ' || e.surname AS teacher_name
        FROM class_subjects cs
        JOIN subjects s ON cs.subject_id = s.id
        LEFT JOIN employees e ON cs.teacher_id = e.id
        WHERE cs.class_id = ?
      `, [classId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return rows;
  } catch (err) {
    console.error("Error retrieving subjects for class:", err);
    throw err;
  }
});

// New query: Get attendance for a specific class and date range
ipcMain.handle('get-class-attendance', async (event, classId, startDate, endDate) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all(`
        SELECT a.*, s.name || ' ' || s.surname AS student_name
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE a.class_id = ? AND a.date BETWEEN ? AND ?
      `, [classId, startDate, endDate], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return rows;
  } catch (err) {
    console.error("Error retrieving class attendance:", err);
    throw err;
  }
});

// New query: Get grades for a specific student
ipcMain.handle('get-student-grades', async (event, studentId) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all(`
        SELECT g.*, s.name AS subject_name
        FROM grades g
        JOIN subjects s ON g.subject_id = s.id
        WHERE g.student_id = ?
      `, [studentId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    return rows;
  } catch (err) {
    console.error("Error retrieving student grades:", err);
    throw err;
  }
});