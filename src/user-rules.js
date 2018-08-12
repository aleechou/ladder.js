const fs = require('fs')
const filepath = __dirname+"/../data/user-rules.json"

try{
    exports.rules = require(filepath)
}catch(e){
    exports.rules = [
        {txt: '(^|\\.)github\\.com:(443|80)$', enable: true, regexp:null } ,
        {txt: '(^|\\.)githubusercontent\\.com:(443|80)$', enable: true, regexp:null } ,
        {txt: '(^|\\.)githubapp\\.com:(443|80)$', enable: true, regexp:null }
    ]
}

exports.format = function(i) {
    exports.rules[i].regexp = new RegExp(exports.rules[i].txt)
}

exports.needProxy = function( addr ){
    for(var rule of exports.rules) {
        if( rule.regexp && rule.regexp && rule.regexp.test(addr) ){
            return rule
        }
    }
    return null
}


exports.add = function(txtexp) {

    var rule = {
        txt: txtexp ,
        enable: true ,
        regexp: new RegExp(txtexp)
    }

    exports.rules.push(rule)

    // 断开已经匹配的 直连隧道
    for(var reqid in $WorkersPool){
        var info = $WorkersPool[reqid].info
        if( info.directly && rule.regexp.test(info.dstAddr) ) {
            $WorkersPool[reqid].kill()
        }
    }

    return [exports.rules.length, rule]
}
exports.remove = function(idx) {
    var rule = exports.rules[idx]
    exports.rules.splice(idx,1)

    // 断开已经匹配的 代理隧道
    for(var reqid in $WorkersPool){
        var info = $WorkersPool[reqid].info
        if( info.byUserRule == rule.txt ) {
            $WorkersPool[reqid].kill()
        }
    }
}

exports.save = function() {
    fs.writeFile(filepath, JSON.stringify(exports.rules, null, 4))
}



// 
for(var i=0; i<exports.rules.length; i++) {
    exports.format(i)
}
