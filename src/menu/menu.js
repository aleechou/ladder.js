Vue.use(VueMaterial.default)

import MainWnd from './mainwnd.vue'

function InitApp () {
    window.$app = new Vue({
        el: '#app',
        components: {MainWnd}
    })
}

// in electron
if(typeof nodeRequire!='undefined') {
    var {ipcRenderer} = nodeRequire("electron")
    window.$ipc = ipcRenderer

    // 向主进程请求 settings
    $ipc.send('pull-settings')

    // 从主进程接收 settings
    $ipc.on('push-settings', (from, settings)=>{
        console.log(from, settings)
        window.$Settings = settings

        // 创建 App
        InitApp()
    })
}

// in browser
else {
    InitApp()
}
