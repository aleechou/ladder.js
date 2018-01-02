var SshClient = require('ssh2').Client
const net = require('net')




exports.connectViaProxy = function(info, sshConfig, callback) {

    var proxy = `${sshConfig.username}@${sshConfig.host}:${sshConfig.port}`

    var conn = new SshClient();
    conn.on('ready', function() {
        conn.forwardOut(
            //info.srcAddr,
            //info.srcPort,
            "0.0.0.0",
            0,
            info.dstAddr,
            info.dstPort,
            function(err, downstream) {
                if (err) {
                    callback({ code: "dst-inaccessible", cause: err, proxy: proxy })
                    return
                }
                downstream.cat = function(upstream) {
                    this.pipe(upstream).pipe(this).on('close', function() {
                        conn.end();
                    });
                }
                downstream.proxy = proxy

                callback(null, downstream)
            });
    }).on('error', function(err) {
        callback({ code: "cannot-build-tunnel", cause: err, proxy: proxy})
    }).connect(sshConfig)
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
        .connect(info.dstPort, info.dstAddr)
}