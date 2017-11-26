const fs = require("fs")
const pt = require("path")

module.exports = function(webpackConfig, cwd, componentFolder) {

    var vuelst = {}
    walk(cwd + "/" + componentFolder, "", vuelst)

    function genShadowEntry(originEntry, shadowEntry) {

        var shadowContent = `
        var consoleerror = console.error
        console.error = function(msg) {
            if (msg && msg.match && msg.match("Component names can only contain alphanumeric characters and the hyphen, and must start with a letter")) {
                return
            }
            return consoleerror.apply(console, arguments)
        }
        `

        shadowContent += `const Vue = require("vue/dist/vue.js")\r\n`
        for (var tag in vuelst) {
            shadowContent += `Vue.component('${tag}',require('${vuelst[tag]}').default);\r\n`
        }
        shadowContent += `require('${cwd+'/'+originEntry}')`

        fs.writeFileSync(cwd + "/" + shadowEntry, shadowContent)
    }

    if (typeof webpackConfig.entry == "string") {
        var originEntry = webpackConfig.entry
        var shadowEntry = originEntry.replace(/\.js$/i, "") + "-shadow.js"
        webpackConfig.entry = shadowEntry.replace(/\.js$/i, "")

        genShadowEntry(originEntry, shadowEntry)
    } else if (typeof webpackConfig.entry == "object") {
        for (var name in webpackConfig.entry) {
            var originEntry = webpackConfig.entry[name]
            var shadowEntry = originEntry.replace(/\.js$/i, "") + "-shadow.js"
            webpackConfig.entry[name] = shadowEntry.replace(/\.js$/i, "")

            genShadowEntry(originEntry, shadowEntry)
        }
    }
}


function walk(path, ns, vuelst) {
    var prefix = ns
    if (prefix)
        prefix += "."
    for (filename of fs.readdirSync(path)) {
        var fullpath = path + "/" + filename
        var stat = fs.statSync(fullpath)
        if (stat.isDirectory()) {
            walk(fullpath, prefix + filename, vuelst)
        } else {
            var info = pt.parse(filename)
            if (info.ext.toLowerCase() == ".vue") {
                if(info.name.toLowerCase()=="index")
                    vuelst[ns] = fullpath.replace(/\.vue$/i, "")
                else
                    vuelst[prefix + info.name] = fullpath.replace(/\.vue$/i, "")
            }
        }
    }
}