const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload', 'index.js') // Assurez-vous que ce chemin est correct
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

// ... le reste de votre code main.