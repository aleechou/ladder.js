Vue.use(VueMaterial.default)

import Settings from './settings.vue'
import Exit from './exit.vue'

new Vue({
    el: '#app',
    data: () => ({
        newPosts: 99
    }),
    mounted () {
        app.style.display = 'flex'
        this.$refs.settings.$el.style.display = 'flex'
    },
    methods: {
        switchPage (pageName) {
            $(".main").hide()
            this.$refs[pageName].$el.style.display = 'flex'
        } ,

    },
    components: {
        Settings
        , Exit
    }

})


