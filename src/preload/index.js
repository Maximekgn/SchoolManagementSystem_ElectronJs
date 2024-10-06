import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

// preload.js
const { ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  printPDF: () => ipcRenderer.send('print-to-pdf'),
  generatePDF: () => ipcRenderer.send('generate-pdf')
});