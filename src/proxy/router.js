const openlist = require('./openlist.pac')


var whiteList = [
    //".googleusercontent.com", ".ggpht.com", ".ytimg.com", ".googlevideo.com"
]
whiteList.forEach(openlist.add)


var matchCache = {}

exports.match = function(hostname) {
    if (matchCache[hostname] === undefined) {

        // 
        matchCache[hostname] = openlist.match(hostname)
    }

    return matchCache[hostname]
}


exports.addCache = function(hostname) {
    matchCache[hostname] = true
}