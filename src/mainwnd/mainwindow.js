// const $ = require("../lib/jquery")
// const request = require("request")
// const objProxy = require("../misc/ObjectIpcProxy")

const $ = require("jquery")
window.Vue = require("vue/dist/vue.js")
const Vuex = require("vuex")
const store = require('../store')
const stupid = require("stupid-vue")

stupid.outputFile = true

stupid.regiterFolder(__dirname, window.Vue)
    .then(() => {
        $(function() {
            new Vue({
                el: '#app',
                store,
                data() {
                    return {
                        activeName: 'pac'
                    };
                },
                // computed: Vuex.mapState(['visible', 'a'])
            })
        })
    })