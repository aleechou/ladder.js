const fs = require('fs')
const filepath = __dirname+"/../data/settings.json"

try{
    module.exports = require(filepath)
}catch(e){
    module.exports = {
        servers: [] ,
        rules: [] ,
        proxy: {
            bind: '127.0.0.1' ,
            port: 1080 ,
            global: false ,
            hookSystem: true
        }
    }
}
module.exports.save = function() {
    fs.writeFile(filepath, JSON.stringify(module.exports, null, 4))
}