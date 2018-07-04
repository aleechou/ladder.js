const {app, Tray, BrowserWindow, ipcMain} = require('electron')
const os = require(__dirname+'/../misc/os')

let tray = null
let menuWnd = null

app.on('ready', () => {
    menuWnd = new BrowserWindow({width: 320, height: 400, frame: false, show: true})
    menuWnd.on('closed', process.exit)
    // 失焦隐藏窗口
    menuWnd.on('blur', ()=>{
        if(!process.argv.includes('-d'))
            menuWnd.hide()
    })
    menuWnd.loadURL(`file://${__dirname}/index.html`)

    // 调试控制台
    process.argv.includes('-d') && menuWnd.webContents.openDevTools()

    tray = new Tray(__dirname+'/../../assert/ladder.png')
    tray.on('click', (event, bounds, position)=>{
        menuWnd.setPosition(bounds.x, bounds.y+bounds.height)
        menuWnd.show()
    })
})

ipcMain.on('exit', process.exit)
ipcMain.on('proxy-setting', function(window, name, value){
    console.log(name, value)
    if($Settings.proxy[name]!==undefined) {
        $Settings.proxy[name] = value

        console.log($Settings)
        $Settings.save()
    }

    // 设置为操作系统的代理
    if(name=='hookSystem') {
        os.hookSystem(value)
    }
})

ipcMain.on('disconnect-tunnel', function(window, reqid){
    var worker = $WorkersPool[reqid]
    if(!worker) {
        return
    }
    worker.kill()
})
ipcMain.on('server-new', function(window, config){
    $Settings.servers.push(config)
    $Settings.save()
})
ipcMain.on('server-remove', function(window, index){
    $Settings.servers.slice(index, 1)
    $Settings.save()
})
ipcMain.on('server-save', function(window, index, config){
    $Settings.servers[index] = config
    $Settings.save()
})

// 窗口向主进程请求 settings
ipcMain.on('pull-settings', (from)=>{
    // console.log(window)
    from.sender.send('push-settings', $Settings)
})

exports.dispatchNewTunnel = function(info, worker) {
    if(!menuWnd) {
        console.log("menuwnd not ready")
        return
    }

    menuWnd.webContents.send('tunnel-new', info)

    worker.on('exit', () => {
        try{
            menuWnd.webContents.send('tunnel-closed', info.reqid)
        }catch(e){}
    })

}
