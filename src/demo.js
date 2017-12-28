const net = require('net')
const router = require('./proxy/router.js')
const socks = require('socksv5')
const tunnel = require('./proxy/tunnel')


socks.createServer(function(info, accept, deny) {

        function tryTunnel() {
            // 自动尝试链接
            tunnel.connectViaProxy(info, (error, downstream) => {
                if (error) {
                    console.log(error)
                    deny()
                    return
                }

                console.log("into tunnel for", info.dstAddr)
                intoTunnel(downstream)

                router.addCache(info.dstAddr)
            })
        }

        function intoTunnel(downstream) {
            var upstream = accept(true)
            if (upstream) {
                downstream.cat(upstream)
            } else {
                console.error("can not accept request via tunnel", info)
                downstream.end()
                deny()
            }
        }

        // 需要代理
        if (router.match(info.dstAddr)) {

            console.log("forward by proxy", info.dstAddr)

            tunnel.connectViaProxy(info, (error, downstream) => {
                if (error) {
                    console.error(error)
                    deny()
                    return
                }

                intoTunnel(downstream)
            })
        }
        // 不需要代理
        else {

            process.stdout.write('.')

            var nextsock = new net.Socket()
            nextsock
                .setTimeout(5000)
                .on('connect', function() {
                    var sourcesock = accept(true)
                    if (!sourcesock) {
                        console.log("can not accept request direct", info)
                        deny()
                        nextsock.close()
                        return
                    }
                    sourcesock
                        .on("error", (error) => {
                            console.log("source host error", error)
                        })
                        .pipe(nextsock)
                        .pipe(sourcesock)
                })
                .on("timeout", () => {
                    console.log('socket timeout', info)
                    tryTunnel() // 尝试使用隧道
                })
                .on("error", (error) => {
                    if (error.code = "ECONNRESET") {
                        console.log("block?", info.dstAddr)
                        tryTunnel() // 尝试使用隧道
                    } else {
                        deny()
                    }
                    console.log("dst host error", error)
                })
                .connect(info.dstPort, info.dstAddr)
        }

    })
    .listen(1080, 'localhost', function() {
        console.log('SOCKSv5 proxy server started on port 1080');
    })
    .on("error", (error) => {
        console.log("dynamic port error", error)
    })
    .useAuth(socks.auth.None());