// var Client = require('ssh2').Client;
// var conn = new Client();
// conn.on('ready', function() {
//         console.log('Client :: ready');
//         conn.shell(function(err, stream) {
//             if (err) throw err;
//             stream.on('close', function() {
//                 console.log('Stream :: close');
//                 conn.end();
//             }).on('data', function(data) {
//                 console.log('STDOUT: ' + data);
//             }).stderr.on('data', function(data) {
//                 console.log('STDERR: ' + data);
//             });
//             stream.end('ls -l\nexit\n');
//         });
//     })
//     .connect({
//         host: 'ladder.chou.im',
//         port: 22,
//         username: 'root',
//         privateKey: privateKey
//     });

// console.log("xxxx")


// var socks = require('socksv5');
// var Client = require('ssh2').Client;

// var ssh_config = {
//     host: 'ladder.chou.im',
//     port: 22,
//     username: 'root',
//     privateKey: privateKey
// };

// socks.createServer(function(info, accept, deny) {
//     // NOTE: you could just use one ssh2 client connection for all forwards, but
//     // you could run into server-imposed limits if you have too many forwards open
//     // at any given time
//     console.log(info)
//     var conn = new Client();
//     conn.on('ready', function() {
//         console.log("proxy ready")
//         conn.forwardOut(info.srcAddr,
//             info.srcPort,
//             info.dstAddr,
//             info.dstPort,
//             function(err, stream) {
//                 if (err) {
//                     conn.end();
//                     return deny();
//                 }

//                 var clientSocket;
//                 if (clientSocket = accept(true)) {
//                     stream.pipe(clientSocket).pipe(stream).on('close', function() {
//                         conn.end();
//                     });
//                 } else
//                     conn.end();
//             });
//     }).on('error', function(err) {
//         deny();
//     }).connect(ssh_config);
// }).listen(7070, 'localhost', function() {
//     console.log('SOCKSv5 proxy server started on port 7070');
// }).useAuth(socks.auth.None());


/*
Error: read ECONNRESET
    at exports._errnoException (util.js:1016:11)
    at TCP.onread (net.js:609:25)
*/
// test with cURL:
//   curl -i --socks5 localhost:1080 google.com



// var http = require('http')
// var httpProxy = require('http-proxy')

// proxy = httpProxy.createProxyServer({})
// http.createServer(function(req, res) {
//     console.log(req.headers)
//     proxy.web(req, res, {
//         target: "http://"+req.headers.host
//     });
// })
// .listen(1080)





var http = require('http');
var net = require('net');
var url = require('url');
var tunnel = require("./tunnel").tunnel
    // var Client = require('ssh2').Client;

// var ssh_config = {
//     host: 'ladder.chou.im',
//     port: 22,
//     username: 'root',
//     privateKey: privateKey
// };


// var regexpHttpHeaderHost = /^Host\s*:\s*([a-zA-Z\d\-_\.]+)\s*(:\s*(\d+))?\s*$/i

// const server = net.createServer((client) => {

//     console.log("client coming in >>")

//     var distHost, distPort
//     var forwarder

//     client.on("data", (data) => {

//         console.log("request of client coming out >> >>", data.length)
//         console.log(data.toString())

//         if (forwarder) {
//             forwarder.write(data)
//             return
//         }

//         var raw = data.toString() || "";

//         var rawLines = raw.split("\r\n")
//         for (var line of rawLines) {
//             var result = line.match(regexpHttpHeaderHost)
//             if (result) {
//                 distHost = result[1]
//                 distPort = result[3] || 80
//                 break
//             }
//         }

//         // 未知的请求
//         if (!distHost) {
//             client.end()
//             console.log("unknow HTTP Request:")
//             console.log(raw)
//             return
//         }

//         forwarder = tunnel().forward(client, distHost, distPort)

//         if (raw.substr(0, 8) == "CONNECT ") {
//             forwarder.ready(() => {
//                     console.log("is HTTP CONNECT reqeust")
//                     try {
//                         client.write('HTTP/1.1 200 Connection Established\r\n\r\n');
//                     } catch (error) {
//                         console.error(error)
//                     }
//                 })
//                 // console.log("is HTTP CONNECT reqeust")
//                 // forwarder.write(data)
//         } else {
//             forwarder.write(data)
//         }
//     })

//     client.on("error", (error) => {
//         console.error("client request socket error:", error)
//     })
//     client.on("close", () => {
//         console.log("client closed")
//         forwarder = null

//         setTimeout(() => {
//             console.log("clear all listeners of client")
//             client.removeAllListeners("close")
//             client.removeAllListeners("data")
//             client.removeAllListeners("error")
//         }, 0)
//     })
// });
// server.on('error', (err) => {
//     throw err;
// });
// // server.listen(1080, () => {
// //     console.log('proxy server ready');

// // });


var store = {
    a: "aaaa",
    b: "bbbb",
    c: {
        aaa: 11,
        bbb: 22
    }
}
qnode.shadow(store)

console.log(store.a)
store.a = "xxx"
console.log(store.a)



;
(async() => {

    qnode.window.openConsole()

    var mainwnd = await qnode.window.create()
    var loaded = await mainwnd.load("file://" + __dirname + "/mainwnd/mainwindow.html")
    mainwnd.show()

    var a = 111
    var b = "bbb"
    var c = {
        a: a,
        b: b
    }
    var ret = await mainwnd.run(() => {
        c.b = a
        c.a = b
        resolve(c)
    }, { a, b, c })

    console.log(">>>>>", ret)


})()

setInterval(() => {}, 1000)