// main.js
const { app, BrowserWindow, ipcMain } = require('electron')
const Datastore = require('nedb')

let db = new Datastore({ filename: 'notes.db', autoload: true })
const { dialog } = require('electron')
function createWindow () {
  const win = new BrowserWindow({
    minWidth: 900,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      transparent: true,
      titleBarStyle: 'hidden',
      frame: false,
      resizable: false,

    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

ipcMain.on('get-notes', (event, arg) => {
  db.find({}, function (err, docs) {
    event.reply('get-notes-reply', docs)
  })
})

ipcMain.on('add-note', (event, arg) => {
  db.insert(arg, function (err, newDoc) {
    event.reply('add-note-reply', newDoc)
  })
})

ipcMain.on('delete-note', (event, arg) => {
  db.remove({ _id: arg }, {}, function (err, numRemoved) {
    event.reply('delete-note-reply', numRemoved)
  })
})

ipcMain.on('edit-note', (event, arg) => {
    db.update({ _id: arg.id }, { $set: { header: arg.header, text: arg.text } }, {}, function (err, numReplaced) {
      if (err) {
        console.error(err)
      } else {
        event.reply('edit-note-reply', numReplaced)
      }
    })
  })

  // main.js

ipcMain.on('open-dialog', (event, arg) => {
  dialog.showOpenDialog({
    title: 'Edit your note',
    defaultPath: arg
  }).then(result => {
    event.reply('open-dialog-reply', result.filePaths[0])
  }).catch(err => {
    console.log(err)
  })
})