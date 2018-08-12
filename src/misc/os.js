const child_process = require('child_process')
const os = require('os')

/**
 * 将 ladder.js 设置为操作系统的代理
 * @param {bool} hook 
 */
exports.hookSystem = function(hook) {
    if( os.platform()=='darwin' ){
        child_process.exec(hook?
            "networksetup -setsocksfirewallproxy Wi-Fi 127.0.0.1 "+$Settings.proxy.port:
            "networksetup -setsocksfirewallproxystate Wi-Fi off"
        )
    }
}

exports.lsof = function(port){
    return new Promise((resolve)=>{
        child_process.exec(
            `lsof -i:${port} -P`
            ,(err, stdout, stderr)=>{
                if(err) {
                    console.error(stderr.toString())
                    return resolve()
                }

                stdout.split("\n").forEach((line)=>{
                    if( line.match(":"+port+"->") ){
                        resolve(line.split(/ +/)[1])
                    }
                })
        })
    })
}

exports.ps = function(pid){
    return new Promise(async (resolve)=>{
        var path = await exports.exec("ps -o comm= "+pid)
        if(!path) {
            return {pid: pid}
        }

        var full = await exports.exec("ps -o command= "+pid)
        var argv = full.slice(path.length).trim()
        var name = path.split(/[\/\\]/).pop()

        resolve({
            pid: pid ,
            path: (path||"").trim(),
            argv: (argv||"").trim(),
            name: (name||"").trim()
        })
    });
}

exports.exec = function(cmd) {
    return new Promise((resolve)=>{
        child_process.exec(
            cmd, (err, stdout, stderr)=>{
                if(err) {
                    console.error(">>", stderr.toString())
                    return resolve()
                }
                resolve(stdout)
        })
    })
}