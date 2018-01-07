const cluster = require('cluster')
if(cluster.isMaster){

    const router = require('./proxy/router.js')
    const socks = require('socksv5')
    const tunnel = require('./proxy/tunnel')


    let privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAr/3y/etPVpkEc77MkgBa6M3MvsIZi4Zk04P/BnSq++U5p4v7
7Zp+nu0Q7lp0xXfDMLpplc7CztAFiIVuTImZ7r1yNOPdzxmjb5EgRQU2Yxan1ulN
eEq1hXVFqbcsLqZS7n2E2KCED7xiJPBqTLwFlmTin44MKn4KVRVtycW4vBm/Dmp4
QQ3yPQWusARi35f9cItVYbDOycWzej8teHrvaJmDQL9js/3GGMRpGLXVjtTFSuLq
/ey25ebk7umv9hfJfCx5ZYhdjJr56ZnStHGj+AGPAh/OtK8NE3feQL+/IScxZNxE
0Ly4V+5byyuH6ntL3bgp/8I0NQ5lsfr4dRIyEQIDAQABAoIBAHivv0idayTJfiIZ
f5PHpo/rQTK3TGk/2jiqVeKJcw+WW/knp7WCsr4td+TcJyObQ0FRNELFLRZB1OmQ
Btl5qxPq2jym3l69CDTj4qsyLd+5k5NvHe8V3HEOwJznveanrEtbzBP5z1YzK2KF
c3/3mCVQPZCJCpLBKDi8nzM04cArCzO//KLYeOExsiC3C+048kVh3OmpBplTQIvw
XnihdBhnGAlWMGQHUrD96Lqskp1LjV1eHLjz1durR4bX1Jvk3cd6PExgYASQ2tiv
SNlGbanzAgJvRPjkMptqvDlQ/E+PZMaXJrb+U06X5AwuS7I7YBu6gSgFIa3d2yJo
fQR4HtkCgYEA6hqvmvOtpUOAHDgH9NMBEDrvHpGBnMWgK0LJR5I3k5K3jMRaRj7V
DZEv2D3MqsS3ruo3841n6gqusrwnujNmWpbh9do28LeCrTI47G+0eVhZZMwK4JZq
G2btzbZck6nYD5UGSEdfe1WFGgtCi1cyKDrxy8FGR2ehSk7qtxa9T7MCgYEAwHPX
wOhRmDZghC4iKHZl0/Y7sgxWP0w9LBQ61lH9nCWQ7+j2vxe4QBYy+sdmRZXYFFsc
fe7P+XXsM5lOC3njCa7eg7wBb7iBmoG1N76EXqagEKlAk/rsWQRm11a3Ns9RS3OO
r1z8Ef9lj+D1KnYO1KVHGRDpn+6L9qUP6rZDdSsCgYEAjK7syNmXiLE/07V4UpBb
Gz3PZTdcBLJexqCkBPbBn1WUKGv3NC+eKUEO14yL6jO9jsgCR8K6p9MzmQWpeiRZ
Zic2M2Cnk5E0XpDH1I5sjl+hmQlloAHEUiNQ1Ua566MtzG9qDxWVM7D5A+WwX7xO
0A5cMG49pbuJGfbC5rQroDECgYEAsnu9IN9UrQHhSTUv4K7NiWLXwizG4DVoljS8
zH+F4QbGAHniPR9Wdbkg1ouPQgHSQC6voeuVXhoLUV9gjiwgb56KJ0p5Wo+XQyAA
XQ6H3PBTiqAtkBAqmfQHHLcDfAWRs5QcRG7MKDTgkCtltFeBMZ2G7qxMv1KQ49H5
jQg0T7kCgYBMTE1DxHawkIe4UhFwaGrHe4/kQwA6h1DxHMrWDW+imYM0DK1B2c9B
OxFVrlmfTF4tz8RD40qpOiD603XOFSF3zJBcyXEZHdgF3/5sfipS7Pq9mQhGBZOw
DAHUPThKNsXqGk+sizACa5KG0yZHKZ1L02sQKixPByUjw0xUyk/WZA==
-----END RSA PRIVATE KEY-----`.replace(/[ \s\n]/.gm, '')
        // console.log(privateKey)

    var tokoy = {
        host: 'tokoy.ladder.chou.im',
        port: 22,
        username: 'root',
        privateKey: privateKey
    }
    var los = {
        host: 'los.ladder.chou.im',
        port: 22,
        username: 'root',
        privateKey: privateKey
    }

    cluster.on('message', (worker, message, downstream) => {
        if(message=='forwarder-connected') {
            let upstream = worker.accept(true)
            worker.accept = undefined
            downstream.pipe(upstream).pipe(downstream)

            upstream
            .on('error', (error)=>{
                console.error("E", error)
            })
            .on('close', ()=>{
                console.error("upstream close")
                worker.kill()
            })
        }
    })

    var assigned_req_id = 0

    var server = socks.createServer(function(info, accept, deny) {

            var requestTime = Date.now()
            var activestream = null
            var upstream = null
            var pendingStreamCount = 0
            var reqid = assigned_req_id++;

            // 直接链接
            if (!router.isBlocked(info.dstAddr)) {
                // tunnel.connectDirect(info, onStreamReady)
                // pendingStreamCount++
                let worker = cluster.fork()
                worker.accept = accept
                worker.send(info)
                worker.on('exit',()=>{
                    console.log('work exited')
                })
                return
            }

            // 代理隧道
            else {
                tunnel.connectViaProxy(info, tokoy, onStreamReady, reqid)
                pendingStreamCount++

                tunnel.connectViaProxy(info, los, onStreamReady, reqid)
                pendingStreamCount++
            }

            function cancel() {
                if (pendingStreamCount == 0) {
                    deny()
                    console.log("deny", reqid)
                }
            }

            function onStreamReady(error, downstream) {

                pendingStreamCount--

                var time = Date.now() - requestTime

                if (error) {
                    console.log("E", reqid, error.proxy || "direct", error, time)

                    if (error.cause.code = "ECONNRESET") {
                        console.log("block?", info.dstAddr)

                        // ECONNRESET 会在之前触发一次 onStreamReady
                        // 即被 block 的 downstream 会两次 callback
                        if (activestream === downstream) {
                            activestream = null
                            pendingStreamCount++
                        }

                        router.addCache(info.dstAddr)
                    }

                    return cancel()
                }

                // 尚未衔接管道
                if (!activestream) {

                    if (!upstream)
                        upstream = accept(true)

                    if (upstream) {

                        // 连接上下游管道
                        downstream.cat(upstream)

                        activestream = downstream

                        console.log(downstream.proxy ? "." : "=", reqid, info.dstAddr, downstream.proxy || "direct", time)

                    }
                    // 无法获取上游管道(浏览器关闭链接?)
                    else {
                        console.error("can not accept request via tunnel, client has wait", time, "ms. ", info)
                        downstream.end()
                        return deny()
                    }

                }
                // 较慢的链接
                else {
                    // 弃用
                    downstream.close()

                    // 代理比直连更快
                    if (!downstream.proxy) {
                        console.log("find out faster route for", info.dstAddr, ", via ", activestream.proxy || "direct")
                    }

                    console.log("x", reqid, info.dstAddr, downstream.proxy || "direct", Date.now() - requestTime)
                }
            }

        })
        .on("error", (error) => {
            console.log("dynamic port error", error)
        })
        .useAuth(socks.auth.None())
        .listen(1080, 'localhost', function() {
            console.log('SOCKSv5 proxy server started on port 1080');
        })

    }


else {

    const net = require('net')

    process.on('message',(info)=>{

        console.log(info)

        var downstream = new net.Socket()
        // .setTimeout(15000)
        .on('connect', function() {
            console.log('worker connect')
            process.send('forwarder-connected', downstream)
        })
        .on("error", (error) => {

            if (error.code = "ECONNRESET") {
                console.log("block?", info.dstAddr)
            }

            console.error('E', info.dstAddr, error)
            
            process.exit()
        })
        .on('close', ()=> {
            console.log("downstream close")
            process.exit()
        })
        .connect(info.dstPort, info.dstAddr)

    })
}

process.on('uncaughtException', function(err) {
    console.error('Error caught in uncaughtException event:', err);
});