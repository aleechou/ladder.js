const SshClient = require('ssh2').Client
const net = require('net')




exports.connectViaProxy = function(info, sshConfig, callback) {

    var proxy = `${sshConfig.username}@${sshConfig.host}:${sshConfig.port}`

    var conn = new SshClient();
    conn.on('ready', function() {
        conn.forwardOut(
            info.srcAddr,
            info.srcPort,
            // "0.0.0.0",
            // 0,
            info.dstHost,
            info.dstPort,
            function(err, downstream) {
                if (err) {
                    callback({ code: "dst-inaccessible", cause: err, proxy: proxy })
                    conn.end()
                    return
                }
                downstream.cat = function(upstream) {
                    upstream.on('close', () => console.log(info.reqid, 'upstream closed', proxy))
                    this.pipe(upstream).pipe(this)
                }
                downstream.oriEnd = downstream.end
                downstream.end = function() {
                    this.oriEnd()
                    conn.end()
                }
                downstream.proxy = proxy

                downstream.on('close', function() {
                    console.log(info.reqid, "forwarder closed", proxy)
                    conn.end()
                });

                callback(null, downstream, sshConfig)
            });
    })
    .on('error', function(err) {
        callback({ code: "cannot-build-tunnel", cause: err, proxy: proxy })
        conn.end()
    })
    .on('close', () => {
        console.log(info.reqid, "tunnel closed", proxy)
    })
    .connect(sshConfig)
}


exports.connectDirect = function(info, callback) {
    var downstream = new net.Socket()
        // .setTimeout(15000)
        .on('connect', function() {
            downstream.cat = function(upstream) {
                this.pipe(upstream).pipe(this)
            }
            downstream.proxy = null

            callback(null, downstream)
        })
        .on("error", (error) => {
            callback({ code: "dst-inaccessible", cause: error, proxy: false }, downstream)
        })
        .connect(info.dstPort, info.dstHost)
}