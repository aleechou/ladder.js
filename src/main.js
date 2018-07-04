const cluster = require('cluster')
const socks = require('socksv5')
const socksServer = require('./proxy/socks5-server')
const router = require('./proxy/router.js')
const trayMenu = require(__dirname+'/menu')
const fs = require('fs')
const os = require(__dirname+'/misc/os')


try{ fs.mkdirSync(__dirname+"/../data") }catch(e){}
try{ fs.mkdirSync(__dirname+"/../data/keys") }catch(e){}

// 全局对象
global.$Settings = require(__dirname+'/settings')
global.$WorkersPool = {}

// 自动设置操作系统的代理设置
if( $Settings.proxy.hookSystem ) {
    os.hookSystem(true)
}

var assigned_req_id = 0

var server = socksServer.createServer(function(info, upstream) {

    info.reqid = assigned_req_id++;
    info.directly = !$Settings.proxy.global && !router.isBlocked(info.dstAddr)

    let worker = cluster.fork()
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
        if( params.message=='add router' ) {
            router.addCache(params.addr)
        }
    })

    worker.send(info, upstream)

    os.lsof(info.srcPort,(err, from)=>{
        info.srcApp = err? {}: from
        console.log(info)

        trayMenu.dispatchNewTunnel(info, worker)
    })
})
.on("error", (error) => {
    console.log("dynamic port error", error)
})
.useAuth(socks.auth.None())
.listen($Settings.proxy.port, $Settings.proxy.bind, function() {
    console.log('SOCKSv5 proxy server started on port '+$Settings.proxy.port);
})

