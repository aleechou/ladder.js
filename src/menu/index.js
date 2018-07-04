const {app, Tray, BrowserWindow, ipcMain} = require('electron')
const os = require('os')
const child_process = require('child_process')

let tray = null
let menuWnd = null

app.on('ready', () => {
    menuWnd = new BrowserWindow({width: 320, height: 400, frame: false, show: true})
    menuWnd.on('closed', process.exit)
    menuWnd.on('blur', ()=>{
        // menuWnd.hide()
    })
    menuWnd.loadURL(`file://${__dirname}/index.html`)

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

    // 设置为操作系统的代理
    if(name=='bHookSystem') {
        if( os.platform()=='darwin' ){
            child_process.exec(value?
                "networksetup -setsocksfirewallproxy Wi-Fi 127.0.0.1 1080":
                "networksetup -setsocksfirewallproxystate Wi-Fi off"
            )
        }
    }
})

ipcMain.on('disconnect-tunnel', function(window, reqid){
    var worker = workersPool[reqid]
    if(!worker) {
        return
    }
    worker.kill()
})



exports.dispatchNewTunnel = function(info, worker) {
    if(!menuWnd) {
        console.log("menuwnd not ready")
        return
    }

    menuWnd.webContents.send('tunnel-new', info)

    worker.on('exit', () => {
        menuWnd.webContents.send('tunnel-closed', info.reqid)
    })

}

exports.bGlobalProxy = false