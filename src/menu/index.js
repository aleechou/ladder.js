const {app, Tray, BrowserWindow, ipcMain} = require('electron')
const os = require(__dirname+'/../misc/os')
const userRules = require(__dirname+'/../user-rules.js')

let tray = null
let menuWnd = null

app.on('ready', () => {
    menuWnd = new BrowserWindow({width: 380, height: 500, frame: false, show: true})
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


// 建立新隧道
exports.dispatchNewTunnel = function(worker) {
    if(!menuWnd) {
        console.log("menuwnd not ready")
        return
    }

    menuWnd.webContents.send('tunnel-new', worker.info)

    worker.on('message',function (params){
        if( params.message=='tunnel-status' ) {
            worker.info.status = params.status
            menuWnd.webContents.send('tunnel-status-changed', worker.info.reqid, worker.info.status)
        }
    })

    worker.on('exit', () => {
        try{
            menuWnd.webContents.send('tunnel-closed', worker.info.reqid)
        }catch(e){}
    })

}


ipcMain.on('exit', process.exit)
ipcMain.on('proxy-setting', function(window, name, value){

    $Settings.proxy[name] = value
    $Settings.save()

    // 全局代理
    if(name=='global') {
        for(var reqid in $WorkersPool){
            var worker = $WorkersPool[reqid]
            
            if( 
                (value && worker.info.directly)         // 切换到全局模式，断开所有的 直连隧道
                || (!value && worker.info.causeGlobal)  // 关闭全局模式，断开所有因全局模式的代理隧道
            ) {
                worker.kill()
            }
        }
    }

    // 设置为操作系统的代理
    else if(name=='asSystemProxy') {
        os.hookSystem(value)
    }

    // 设置为 git 代理
    else if(name=='asGitProxy') {
        if(value) {
            os.exec("git config --global http.proxy 'socks5://127.0.0.1:1080'")
            os.exec("git config --global https.proxy 'socks5://127.0.0.1:1080'")
            os.exec("git config --global socks.proxy 'socks5://127.0.0.1:1080'")
            os.exec(`git config --global core.gitProxy "${__dirname+'/../../sh/gitproxysocks.sh'}"`)
            // os.exec(`git config --global core.gitproxy "git-proxy"`)
        }
        else {
            os.exec("git config --global http.proxy ''")
            os.exec("git config --global https.proxy ''")
            os.exec("git config --global socks.proxy ''")
            os.exec("git config --global core.gitproxy ''")
        }
    }
})

// 窗口渲染完成，向主进程请求 settings
ipcMain.on('pull-settings', (window)=>{
    window.sender.send('push-settings', [$Settings, userRules.rules])
})

// 断开隧道
ipcMain.on('disconnect-tunnel', function(window, reqid){
    var worker = $WorkersPool[reqid]
    if(!worker) {
        return
    }
    worker.kill()
})
// 新增代理服务器 
ipcMain.on('server-new', function(window, config){
    $Settings.servers.push(config)
    $Settings.save()
})
// 删除代理服务器
ipcMain.on('server-remove', function(window, index){
    $Settings.servers.splice(index, 1)
    $Settings.save()
})
// 保存代理服务器
ipcMain.on('server-save', function(window, index, config){
    $Settings.servers[index] = config
    $Settings.save()
})
// 用户规则修改
ipcMain.on('user-rule-changed', (window, idx, rule)=>{
    userRules.rules[idx] = rule
    userRules.format(idx)
    userRules.save()
})
ipcMain.on('user-rule-delete', (window, idx)=>{
    userRules.remove(idx)
    userRules.save()
})
ipcMain.on('user-rule-new', (window, regexp)=>{
    var [idx, rule] = userRules.add(regexp)
    menuWnd.webContents.send('user-rule-new', idx, rule)
    userRules.save()
})