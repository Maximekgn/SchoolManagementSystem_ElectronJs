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
//get all students
ipcMain.handle("get-students", (event, args) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        students.id, 
        students.surname, 
        students.name, 
        students.date_of_birth, 
        students.place_of_birth, 
        students.gender, 
        students.picture, 
        students.registration_number, 
        students.date_of_admission,
        students.discount_in_fee, 
        students.blood_group, 
        students.medical_condition,
        students.previous_school, 
        students.religion, 
        students.additional_note,
        students.parent_name, 
        students.parent_surname, 
        students.parent_mobile_number,
        classes.name AS class_name, 
        classes.capacity, 
        classes.class_fees
      FROM students
      LEFT JOIN classes ON students.class_id = classes.id
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



// add a student
  ipcMain.handle("add-student", async (event, formData) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO students (
          surname, name, date_of_birth, place_of_birth, gender, 
          registration_number, date_of_admission, class_id, blood_group, 
          medical_condition, previous_school, religion, parent_name, 
          parent_surname, parent_mobile_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      const {
        surname, name, date_of_birth, place_of_birth, gender, 
        registration_number, date_of_admission, class_id, blood_group, 
        medical_condition, previous_school, religion, parent_name, 
        parent_surname, parent_mobile_number
      } = formData;
  
      database.run(query, [
        surname, name, date_of_birth, place_of_birth, gender, 
        registration_number, date_of_admission, class_id, blood_group, 
        medical_condition, previous_school, religion, parent_name, 
        parent_surname, parent_mobile_number
      ], function(err) {
        if (err) {
          console.error("Error inserting student:", err.message);
          reject(err); 
        } else {
          resolve({ id: this.lastID }); 
        }
      });
    });
  });

// update a student
ipcMain.handle("update-student", async (event, formData) => {
  try {
    // Input validation
    const requiredFields = ['surname', 'name', 'date_of_birth', 'gender', 'registration_number', 'class_id'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new Error(`${field} is required`);
      }
    }

    let picturePath = formData.picture;

    // Handle picture upload if a new file is provided
    if (formData.picture && formData.picture.path) {
      const fileName = `${formData.registration_number}_${Date.now()}${path.extname(formData.picture.path)}`;
      const destPath = path.join(app.getPath('userData'), 'uploads', fileName);
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.copyFile(formData.picture.path, destPath);
      picturePath = destPath;
    }

    const query = `
      UPDATE students SET
        surname = ?,
        name = ?,
        date_of_birth = ?,
        place_of_birth = ?,
        gender = ?,
        registration_number = ?,
        date_of_admission = ?,
        class_id = ?,
        blood_group = ?,
        medical_condition = ?,
        previous_school = ?,
        religion = ?,
        parent_name = ?,
        parent_surname = ?,
        parent_mobile_number = ?,
        picture = ?
      WHERE id = ?
    `;

    const {
      surname, name, date_of_birth, place_of_birth, gender,
      registration_number, date_of_admission, class_id, blood_group,
      medical_condition, previous_school, religion, parent_name,
      parent_surname, parent_mobile_number, id
    } = formData;

    return new Promise((resolve, reject) => {
      database.run(query, [
        surname, name, date_of_birth, place_of_birth, gender,
        registration_number, date_of_admission, class_id, blood_group,
        medical_condition, previous_school, religion, parent_name,
        parent_surname, parent_mobile_number, picturePath, id
      ], function(err) {
        if (err) {
          console.error("Error updating student:", err.message);
          reject({ success: false, error: err.message });
        } else {
          resolve({ success: true, updatedId: this.lastID });
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

//to get all teachers
ipcMain.handle("get-teachers", (event, args) => {
  return new Promise((resolve, reject) => {
    database.all("SELECT * FROM employees where employee_role = 'Teacher' ", (err, rows) => {
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
    let picturePath = null;
    if (formData.picture) {
      const fileName = `${formData.registration_number}_${Date.now()}${path.extname(formData.picture.path)}`;
      const destPath = path.join(app.getPath('userData'), 'uploads', fileName);
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.copyFile(formData.picture.path, destPath);
      picturePath = destPath;
    }

    const query = `
      UPDATE employees SET 
        surname = ?, 
        name = ?, 
        date_of_birth = ?, 
        gender = ?,
        registration_number = ?,
        picture = ? ,
        national_id = ?,
        mobile_number = ?,
        nationality = ?,
        date_of_joining = ?,
        employee_role = ?,
        monthly_salary = ?,
        experience = ?,
        religion = ?,
        email = ?,
        address = ?
      WHERE id = ?
    `; 

    const {
      surname, name  , date_of_birth, gender , registration_number
      , picture, national_id, mobile_number, nationality, date_of_joining, employee_role ,
      monthly_salary, experience, religion, email, address, id
      } = formData;

    return new Promise((resolve, reject) => {
      database.run(query, [
        surname, name  , date_of_birth, gender , registration_number ,
        picture, national_id, mobile_number, nationality, date_of_joining, employee_role ,
        monthly_salary, experience, religion, email, address, id
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
    const query = 'INSERT INTO classes (name, capacity, class_fees, teacher_id) VALUES (?, ?, ?, ?)';
    const { name, capacity, class_fees, teacher_id } = newClass;
    database.run(query, [name, capacity, class_fees, teacher_id], function(err) {
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
    const { name, teacher_id, id } = formData;
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