const router = require('./proxy/router.js')
const socks = require('socksv5')
const tunnel = require('./proxy/tunnel')


var assigned_req_id = 0

var server = socks.createServer(function(info, accept, deny) {

        var requestTime = Date.now()
        var activestream = null
        var pendingStreamCount = 0
        var reqid = assigned_req_id++;

        function cancel() {
            if (pendingStreamCount == 0)
                deny()
        }

        function onStreamReady(error, downstream) {

            pendingStreamCount--

            if (error) {
                console.log(error)
                return cancel()
            }

            console.log(reqid, info.dstAddr, downstream.proxy || "direct", Date.now() - requestTime)

            // 尚未衔接管道
            if (!activestream) {


                var upstream = accept(true)

                if (upstream) {
                    // 连接上下游管道
                    downstream.cat(upstream)

                    activestream = downstream

                    process.stdout.write(downstream.proxy ? 'x' : '.')
                }

                // 无法获取上游管道(浏览器关闭链接?)
                else {
                    console.error("can not accept request via tunnel, client has wait", Date.now() - requestTime, "ms. ", info)
                    downstream.end()
                    return cancel()
                }
            }
            // 较慢的链接
            else {
                // 弃用
                downstream.end()

                // 代理比直连更快
                if (!downstream.proxy) {
                    console.log("find out faster route for", info.dstAddr, ", via ", activestream.proxy || "direct")
                }
            }
        }

        // 代理隧道
        tunnel.connectViaProxy(info, onStreamReady)
        pendingStreamCount++

        // 直接链接
        if (!router.isBlocked(info.dstAddr)) {
            tunnel.connectDirect(info, onStreamReady)
            pendingStreamCount++
        }

    })
    .on("error", (error) => {
        console.log("dynamic port error", error)
    })
    .useAuth(socks.auth.None())
    .listen(1080, 'localhost', function() {
        console.log('SOCKSv5 proxy server started on port 1080');
    })



process.on('uncaughtException', function(err) {
    console.error('Error caught in uncaughtException event:', err);
});