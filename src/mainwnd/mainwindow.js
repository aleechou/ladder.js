const Vue = require("vue/dist/vue.js")
const iView = require("iview/dist/iview.js")
Vue.use(iView);

$(function() {
    new Vue({
        el: '#app',
        data() {
            return {
                activeName: 'pac'
            };
        },
        // computed: Vuex.mapState(['visible', 'a'])
    })
})