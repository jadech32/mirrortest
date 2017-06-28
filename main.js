const electron = require('electron')
const {app} = electron
const {BrowserWindow} = electron

app.on('ready', () => {
  let win = new BrowserWindow({width:900, height: 550, name: 'Smart Mirror'})
  win.loadURL('file://' + __dirname + '/index.html')
  win.setTitle('Smart Mirror')
  //win.webContents.openDevTools()
})
