const {app, Tray, BrowserWindow, ipcMain} = require('electron')

app.on('ready', () => {
    let tray = null
    let menuWnd = new BrowserWindow({width: 320, height: 400, frame: false, show: false})
    menuWnd.on('closed', process.exit)
    menuWnd.on('blur', ()=>{
        menuWnd.hide()
    })
    menuWnd.loadURL(`file://${__dirname}/menu.html`)

    menuWnd.webContents.openDevTools()

    tray = new Tray(__dirname+'/../../assert/ladder.png')
    tray.setToolTip('ladder.js')
    tray.on('click', (event, bounds, position)=>{
        menuWnd.setPosition(bounds.x, bounds.y+bounds.height)
        menuWnd.show()
    })
})

ipcMain.on('exit', process.exit)
ipcMain.on('setting', function(window, name, value){
    if(exports[name]!==undefined) {
        exports[name] = value
    }
})


exports.dispatchNewTunnel = function(info, worker) {
}

exports.bGlobalProxy = false