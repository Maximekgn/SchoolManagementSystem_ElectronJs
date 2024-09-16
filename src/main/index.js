import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const electron = require("electron");
const log = require('electron-log');
const path = require("path");
const fs = require("fs");
const fsa = require("fs/promises");
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
ipcMain.handle("get-students", async (event, args) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all("SELECT * FROM students", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    return rows; // Renvoie les étudiants en cas de succès
  } catch (err) {
    console.error("Erreur lors de la récupération des étudiants :", err);
    throw err; // Propager l'erreur pour que l'interface puisse la gérer
  }
});

//to get all teachers
ipcMain.handle("get-teachers", async (event, args) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all("SELECT * FROM employees where employee_role = 'teacher'", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    return rows; // Renvoie les étudiants en cas de succès
  } catch (err) {
    console.error("Error gettings teachers :", err);
    throw err; // Propager l'erreur pour que l'interface puisse la gérer
  }
});

//to get all employees
ipcMain.handle("get-employees", async (event, args) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      database.all("SELECT * FROM employees", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    return rows; // Renvoie les étudiants en cas de succès
  } catch (err) {
    console.error("Error gettings employees :", err);
    throw err; // Propager l'erreur pour que l'interface puisse la gérer
  }
});