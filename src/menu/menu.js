import MainWnd from './mainwnd.vue'

function InitApp () {
    window.$app = new Vue({
        el: 'v-app',
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
    $ipc.on('push-settings', (from, data)=>{
        // console.log(from, settings)
        window.$Settings = data[0]
        window.$UserRules = data[1]

        console.log(window.$UserRules)

        // 创建 App
        InitApp()
    })
}

// in browser
else {
    InitApp()
}
