const openlist = require('./openlist.pac')


var whiteList = [
    // google
    ".googleusercontent.com", ".ggpht.com", ".ytimg.com", ".googlevideo.com", ".googleapis.com", ".gstatic.com"
    // facebook
    , ".fbcdn.net"
    // pornhub
    , ".pornhub.com", ".phncdn.com", ".rncdn1.com", ".rncdn2.com", ".rncdn3.com"
]
whiteList.forEach(openlist.add)


var matchCache = {}

exports.isBlocked = function(hostname) {
    if (matchCache[hostname] === undefined) {
        matchCache[hostname] = openlist.match(hostname)
    }
    return matchCache[hostname]
}


exports.addCache = function(hostname) {
    matchCache[hostname] = true
}