const cluster = require('cluster')
const socks = require('socksv5')
const socksServer = require('./proxy/socks5-server')
const router = require('./proxy/router.js')
const trayMenu = require(__dirname+'/menu')
const lsof = require(__dirname+'/misc/lsof')
const fs = require('fs')

try{
    fs.mkdirSync(__dirname+"/../data")
}catch(e){}

// 加载数据
try{
    global.settings = require(__dirname+"/../data/config.json")
}catch(e){
    global.settings = {
        servers: [],
        rules: []
    }
}

var assigned_req_id = 0
global.workersPool = {}

var server = socksServer.createServer(function(info, upstream) {

    info.reqid = assigned_req_id++;
    info.directly = !trayMenu.bGlobalProxy && !router.isBlocked(info.dstAddr)

    let worker = cluster.fork()
    workersPool[info.reqid] = worker

    worker.info = info
    worker.on('exit', () => {
        upstream.end()
        console.log(info.reqid, 'work exited. remain:', Object.keys(cluster.workers).length)

        delete workersPool[info.reqid]
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

    lsof.i(info.srcPort,(err, from)=>{
        info.srcApp = err? {}: from
        console.log(info)

        trayMenu.dispatchNewTunnel(info, worker)
    })
})
.on("error", (error) => {
    console.log("dynamic port error", error)
})
.useAuth(socks.auth.None())
.listen(1080, 'localhost', function() {
    console.log('SOCKSv5 proxy server started on port 1080');
})

