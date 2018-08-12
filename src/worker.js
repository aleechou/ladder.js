const tunnel = require('./proxy/tunnel')

var REP = require('socksv5/lib/constants').REP;
var BUF_REP_INTR_SUCCESS = new Buffer([0x05,
        REP.SUCCESS,
        0x00,
        0x01,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00
    ]),
    BUF_REP_DISALLOW = new Buffer([0x05, REP.DISALLOW])

process.on('message', (argv, upstream) => {
    var info = argv[0]
    var serverList = argv[1]

    var requestTime = Date.now()
    var activestream = null
    var pendingStreamCount = 0
    var retriedViaProxy = false

    upstream.on('close', () => {
        // console.log('upstream close', info)
        process.exit()
    })
    
    forward(info)

    function forward(info) {

        // 直接链接
        if (info.directly) {
            tunnel.connectDirect(info, onStreamReady)
            pendingStreamCount++
        }

        // 代理隧道
        else {
            for(var i=0;i<serverList.length;i++) {
                tunnel.connectViaProxy(info, serverList[i], onStreamReady)
                pendingStreamCount++
            }
        }

        var handled = false;

        function cancel() {
            if (pendingStreamCount == 0) {
                deny()
            }
        }

        function accept() {
            if (handled)
                return
            handled = true;
            if (upstream.writable) {
                upstream.write(BUF_REP_INTR_SUCCESS);
                process.nextTick(function() {
                    upstream.resume()
                })
            }
        }

        function deny() {
            if (handled)
                return;
            handled = true;
            if (upstream.writable)
                upstream.end(BUF_REP_DISALLOW);
        }

        function onStreamReady(error, downstream) {

            pendingStreamCount--

            var time = Date.now() - requestTime

            if (error) {
                console.log("E", info.reqid, error.proxy||"direct",
                        error.dstHost+":"+error.dstPort, time+"ms")

                if (error.cause && error.cause.code=="ECONNRESET") {
                    console.log("block?", info.dstHost)

                    // ECONNRESET 会在之前触发一次 onStreamReady
                    // 即被 block 的 downstream 会两次 callback
                    if (activestream === downstream) {
                        activestream = null
                        pendingStreamCount++
                    }
                    
                    process.send({
                        message: 'add-router',
                        dstHost: info.dstHost
                    })

                    // 尝试走代理重试
                    if( !retriedViaProxy ) {
                        info.directly = false
                        forward(info)
                        retriedViaProxy = true
                        return
                    }
                }

                process.send({
                    message: 'tunnel-status',
                    status: 'error'
                })

                return cancel()
            }

            // 尚未衔接管道
            if (!activestream) {

                accept()

                downstream.on("close", () => {
                    console.log("downstream closed", info.reqid, info.dstAddr)
                    process.exit()
                })

                // 连接上下游管道
                downstream.cat(upstream)

                activestream = downstream

                console.log(downstream.proxy ? "." : "=", info.reqid, info.dstHost, downstream.proxy || "direct", time)

                process.send({
                    message: 'tunnel-status',
                    status: 'established'
                })
            }
            // 较慢的链接
            else {
                // 弃用
                downstream.close()

                // 代理比直连更快
                if (!downstream.proxy) {
                    console.log("find out faster route for", info.dstHost, ", via ", activestream.proxy || "direct")
                }

                console.log("x", info.reqid, info.dstHost, downstream.proxy || "direct", Date.now() - requestTime)
            }
        }

    }
})