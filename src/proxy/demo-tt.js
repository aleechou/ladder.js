var SshClient = require('ssh2').Client
const net = require('net')


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
-----END RSA PRIVATE KEY-----`.replace(/\n/.gm, '')
    // console.log(privateKey)

var ssh_config = {
    host: 'ladder.chou.im',
    port: 22,
    username: 'root',
    privateKey: privateKey
}


var conn = new SshClient();
conn.on('ready', function() {

}).on('error', function(err) {
    callback({ code: "cannot-build-tunnel", cause: err })
}).connect(ssh_config)