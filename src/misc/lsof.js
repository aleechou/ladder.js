const child_process = require('child_process')

exports.i = function(port, callback){
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