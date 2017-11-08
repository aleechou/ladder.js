const Vuex = require("vuex")

Vue.use(Vuex)

module.exports = new Vuex.Store({
    state: {
        visible: false,
        a: {
            b: 1
        }
    },
    mutations: {
        "toggle-visible" (state) {
            console.log(" state.visible", state.visible)
            state.visible = !state.visible
            console.log(" state.visible", state.visible)
        }
    }
})