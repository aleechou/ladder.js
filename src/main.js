const cluster = require('cluster')
const socks = require('socksv5')
const socksServer = require('./proxy/socks5-server')
const router = require('./proxy/router.js')
const fs = require('fs')
const os = require(__dirname+'/misc/os')
const userRules = require(__dirname+"/user-rules.js")

try{ fs.mkdirSync(__dirname+"/../data") }catch(e){}
try{ fs.mkdirSync(__dirname+"/../data/keys") }catch(e){}

// 全局对象
global.$Settings = require(__dirname+'/settings')
global.$WorkersPool = {}

var bShowUI = process.argv.includes("--ui")
if(bShowUI) {
    var trayMenu = require(__dirname+'/menu')
}

// 自动设置操作系统的代理设置
if( $Settings.proxy.hookSystem ) {
    os.hookSystem(true)
}

function isLocal(host) {
    return ['127.0.0.1', 'localhost'].includes(host)
}

var assigned_req_id = 0

var server = socksServer.createServer(async function(info, upstream) {

    info.reqid = assigned_req_id++;
    info.directly = true
    info.causeRules = info.causeGlobal = false
    info.status = 'connecting'

    info.dstHost = info.dstAddr
    info.dstAddr = info.dstAddr + ":" + info.dstPort

    if( !isLocal(info.dstHost) ) {

        // 用户规则
        var rule = userRules.needProxy(info.dstAddr)
        if(rule) {
            info.directly = false
            info.byRules = true
            info.byUserRule = rule.txt
        }
        
        // gfwlist 规则
        else if($Settings.proxy.useGFWList && router.isBlocked(info.dstHost)) {
            info.directly = false
            info.byRules = true
        }

        // 全局模式
        else if($Settings.proxy.global) {
            info.directly = false
            info.causeGlobal = true
        }
    }

    let worker = cluster.fork({servers: JSON.stringify($Settings.cacheServers)})
    $WorkersPool[info.reqid] = worker

    worker.info = info
    worker.on('exit', () => {
        upstream.end()
        console.log(info.reqid, 'work exited. remain:', Object.keys(cluster.workers).length)

        delete $WorkersPool[info.reqid]
    })

    upstream
        .on('error', (error) => {
            console.error("E", error)
        })
        .on('close', () => {
            console.log("upstream closed", info)
            worker.kill()
        })

    worker.on('message',(params)=>{
        if( params.message=='add-router' ) {
            router.addCache(params.dstHost)
        }
    })

    worker.send([info,$Settings.servers] , upstream) 

    // 根据来源端口，查询正在请求的应用程序
    var fromPID = await os.lsof(info.srcPort)
    if(fromPID) {
        info.srcApp = await os.ps(fromPID)
    }
    if(!info.srcApp) {
        info.srcApp = {}
    }

    trayMenu && trayMenu.dispatchNewTunnel(worker)
    
})
.on("error", (error) => {
    console.log("dynamic port error", error)
})
.useAuth(socks.auth.None())
.listen($Settings.proxy.port, $Settings.proxy.bind, function() {
    console.log('SOCKSv5 proxy server started on port '+$Settings.proxy.port);
})

