const cluster = require('cluster')
const socks = require('socksv5')
const socksServer = require('./proxy/socks5-server')
const router = require('./proxy/router.js')
const trayMenu = require(__dirname+'/menu')


var assigned_req_id = 0

var server = socksServer.createServer(function(info, upstream) {

        info.reqid = assigned_req_id++;

        console.log("trayMenu.bGlobalProxy",trayMenu.bGlobalProxy)

        info.directly = !trayMenu.bGlobalProxy && !router.isBlocked(info.dstAddr)

        let worker = cluster.fork()
        worker.info = info
        worker.on('exit', () => {
            upstream.end()
            console.log(info.reqid, 'work exited. remain:', Object.keys(cluster.workers).length)
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

        trayMenu.dispatchNewTunnel(info, worker)
    })
    .on("error", (error) => {
        console.log("dynamic port error", error)
    })
    .useAuth(socks.auth.None())
    .listen(1080, 'localhost', function() {
        console.log('SOCKSv5 proxy server started on port 1080');
    })

