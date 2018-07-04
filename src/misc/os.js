const child_process = require('child_process')
const os = require('os')

exports.hookSystem = function(hook) {
    if( os.platform()=='darwin' ){
        child_process.exec(hook?
            "networksetup -setsocksfirewallproxy Wi-Fi 127.0.0.1 "+$Settings.proxy.port:
            "networksetup -setsocksfirewallproxystate Wi-Fi off"
        )
    }
}

exports.lsof = function(port, callback){
    child_process.exec(
        `lsof -i:${port} -P | grep "${port}->"`
        ,(err, stdout, stderr)=>{
            if(err) {
                console.error(stderr.toString())
                return callback(err)
            }
            var result = stdout.split(/ +/)
            callback(null, {
                pid: result[1] ,
                name: result[0] 
            })
    })
}