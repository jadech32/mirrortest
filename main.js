const electron = require('electron')
const {app} = electron
const {BrowserWindow} = electron

app.on('ready', () => {
  let win = new BrowserWindow({width:1920, height: 1200, name: 'Smart Mirror'})
  win.loadURL('file://' + __dirname + '/index.html')
  win.setTitle('Smart Mirror')
  //win.webContents.openDevTools()
})
