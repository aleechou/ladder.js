
        var consoleerror = console.error
        console.error = function(msg) {
            if (msg && msg.match && msg.match("Component names can only contain alphanumeric characters and the hyphen, and must start with a letter")) {
                return
            }
            return consoleerror.apply(console, arguments)
        }
        const Vue = require("vue/dist/vue.js")
Vue.component('mainwnd.tabs',require('/home/alee/project/ladder.js/src/mainwnd/tabs.vue').default);
require('/home/alee/project/ladder.js/src/mainwnd/mainwindow.js')