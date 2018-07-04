<template>

    <md-content id='pageSettings' class="main">
        <md-list>
            <md-list-item>
                <md-switch v-model="proxy.global" @change="onSettingChanged('global')">全局代理</md-switch>
            </md-list-item>
            <md-list-item>
                <md-switch v-model="proxy.hookSystem" class="md-primary" @change="onSettingChanged('hookSystem')">系统</md-switch>
            </md-list-item>
        </md-list>
    </md-content>


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
            ipcRenderer.send('proxy-setting', dataName, this.proxy[dataName])
        } ,
    }
}


</script>