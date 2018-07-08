<template>
    <div id='pageSettings' class="main">

        <div>
            <v-switch label="全局代理" v-model="proxy.global" @change="onSettingChanged('global')"></v-switch>
        </div>
        <div>
            <v-switch label="设置为操作系统的代理" v-model="proxy.asSystemProxy" @change="onSettingChanged('asSystemProxy')"></v-switch>
        </div>
        <div>
            <v-switch label="设置为Git的代理" v-model="proxy.asGitProxy" @change="onSettingChanged('asGitProxy')"></v-switch>
        </div>

    </div>


</template>


<script>
if(typeof nodeRequire!='undefined')
    var {ipcRenderer} = nodeRequire("electron")

export default {
    name: 'Settings' ,
    data: () => ({
        proxy: $Settings.proxy
    })

    , methods: {
        onSettingChanged(dataName) {
            console.log(dataName)
            ipcRenderer.send('proxy-setting', dataName, this.proxy[dataName])
        } ,
    }
}
</script>

<style>
#pageSettings {
    flex-direction: column;
}
</style>