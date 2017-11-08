const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const objProxy = require("./src/misc/ObjectIpcProxy.js")

let quick

// console.log(__dirname)

function createWindow() {
    mainWindow = new BrowserWindow({ width: 600, height: 450, show: true })
    mainWindow.loadURL("file://" + __dirname + '/src/mainwnd/mainwindow.html')
    mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => {
        quick = null
    })

    // quickWindow = new BrowserWindow({ width: 250, height: 400, frame: true, show: true })
    // quickWindow.loadURL("file://" + __dirname + '/src/quickwnd/quickwindow.html')
    // quickWindow.webContents.openDevTools()
    // quickWindow.on('closed', () => {
    //     quick = null
    // })


    // objProxy.exportAsRemoteObject("main-window", mainWindow)
    // objProxy.exportAsRemoteObject("quick-window", quickWindow)

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (quick === null) {
        createWindow()
    }
})




const { Tray } = require('electron')
let tray = null
app.on('ready', () => {
    tray = new Tray(__dirname + "/src/assert/ladder.png")
    tray.on('right-click', () => {
        console.log("right click")
        quickWindow.hide()
    })
    tray.on('click', () => {
        console.log("click")
        quickWindow.show()
    })
})






// let privateKey = `-----BEGIN RSA PRIVATE KEY-----
// MIIEpAIBAAKCAQEAr/3y/etPVpkEc77MkgBa6M3MvsIZi4Zk04P/BnSq++U5p4v7
// 7Zp+nu0Q7lp0xXfDMLpplc7CztAFiIVuTImZ7r1yNOPdzxmjb5EgRQU2Yxan1ulN
// eEq1hXVFqbcsLqZS7n2E2KCED7xiJPBqTLwFlmTin44MKn4KVRVtycW4vBm/Dmp4
// QQ3yPQWusARi35f9cItVYbDOycWzej8teHrvaJmDQL9js/3GGMRpGLXVjtTFSuLq
// /ey25ebk7umv9hfJfCx5ZYhdjJr56ZnStHGj+AGPAh/OtK8NE3feQL+/IScxZNxE
// 0Ly4V+5byyuH6ntL3bgp/8I0NQ5lsfr4dRIyEQIDAQABAoIBAHivv0idayTJfiIZ
// f5PHpo/rQTK3TGk/2jiqVeKJcw+WW/knp7WCsr4td+TcJyObQ0FRNELFLRZB1OmQ
// Btl5qxPq2jym3l69CDTj4qsyLd+5k5NvHe8V3HEOwJznveanrEtbzBP5z1YzK2KF
// c3/3mCVQPZCJCpLBKDi8nzM04cArCzO//KLYeOExsiC3C+048kVh3OmpBplTQIvw
// XnihdBhnGAlWMGQHUrD96Lqskp1LjV1eHLjz1durR4bX1Jvk3cd6PExgYASQ2tiv
// SNlGbanzAgJvRPjkMptqvDlQ/E+PZMaXJrb+U06X5AwuS7I7YBu6gSgFIa3d2yJo
// fQR4HtkCgYEA6hqvmvOtpUOAHDgH9NMBEDrvHpGBnMWgK0LJR5I3k5K3jMRaRj7V
// DZEv2D3MqsS3ruo3841n6gqusrwnujNmWpbh9do28LeCrTI47G+0eVhZZMwK4JZq
// G2btzbZck6nYD5UGSEdfe1WFGgtCi1cyKDrxy8FGR2ehSk7qtxa9T7MCgYEAwHPX
// wOhRmDZghC4iKHZl0/Y7sgxWP0w9LBQ61lH9nCWQ7+j2vxe4QBYy+sdmRZXYFFsc
// fe7P+XXsM5lOC3njCa7eg7wBb7iBmoG1N76EXqagEKlAk/rsWQRm11a3Ns9RS3OO
// r1z8Ef9lj+D1KnYO1KVHGRDpn+6L9qUP6rZDdSsCgYEAjK7syNmXiLE/07V4UpBb
// Gz3PZTdcBLJexqCkBPbBn1WUKGv3NC+eKUEO14yL6jO9jsgCR8K6p9MzmQWpeiRZ
// Zic2M2Cnk5E0XpDH1I5sjl+hmQlloAHEUiNQ1Ua566MtzG9qDxWVM7D5A+WwX7xO
// 0A5cMG49pbuJGfbC5rQroDECgYEAsnu9IN9UrQHhSTUv4K7NiWLXwizG4DVoljS8
// zH+F4QbGAHniPR9Wdbkg1ouPQgHSQC6voeuVXhoLUV9gjiwgb56KJ0p5Wo+XQyAA
// XQ6H3PBTiqAtkBAqmfQHHLcDfAWRs5QcRG7MKDTgkCtltFeBMZ2G7qxMv1KQ49H5
// jQg0T7kCgYBMTE1DxHawkIe4UhFwaGrHe4/kQwA6h1DxHMrWDW+imYM0DK1B2c9B
// OxFVrlmfTF4tz8RD40qpOiD603XOFSF3zJBcyXEZHdgF3/5sfipS7Pq9mQhGBZOw
// DAHUPThKNsXqGk+sizACa5KG0yZHKZ1L02sQKixPByUjw0xUyk/WZA==
// -----END RSA PRIVATE KEY-----`.replace(/\n/.gm, '')
// console.log(privateKey)





// var Client = require('ssh2').Client;
// var conn = new Client();
// conn.on('ready', function() {
//   console.log('Client :: ready');
//   conn.shell(function(err, stream) {
//     if (err) throw err;
//     stream.on('close', function() {
//       console.log('Stream :: close');
//       conn.end();
//     }).on('data', function(data) {
//       console.log('STDOUT: ' + data);
//     }).stderr.on('data', function(data) {
//       console.log('STDERR: ' + data);
//     });
//     stream.end('ls -l\nexit\n');
//   });
// }).connect({
//   host: 'gdgem.com',
//   port: 22,
//   username: 'root',
//   privateKey: privateKey
// });



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



// var http = require('http');
// var net = require('net');
// var url = require('url');

// function request(cReq, cRes) {
//     var u = url.parse(cReq.url);

//     console.log("request", u)

//     var options = {
//         hostname: u.hostname,
//         port: u.port || 80,
//         path: u.path,
//         method: cReq.method,
//         headers: cReq.headers
//     };

//     var pReq = http.request(options, function(pRes) {
//         cRes.writeHead(pRes.statusCode, pRes.headers);
//         pRes.pipe(cRes);
//     }).on('error', function(e) {
//         cRes.end();
//     });

//     cReq.pipe(pReq);
// }

// function connect(cReq, cSock) {
//     var u = url.parse('http://' + cReq.url);

//     console.log("CONNECT", cReq)

//     var pSock = net.connect(u.port, u.hostname, function() {
//         cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
//         pSock.pipe(cSock);
//     }).on('error', function(e) {
//         cSock.end();
//     });

//     cSock.pipe(pSock);
// }

// http.createServer()
//     .on('request', request)
//     .on('connect', connect)
//     .listen(1080, '0.0.0.0');