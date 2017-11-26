window.initApp = function initApp() {
    new Vue({
        el: '#app',
        data() {
            return {
                activeName: 'pac'
            };
        },
    })
}