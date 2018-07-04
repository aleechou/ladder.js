<template>

    <md-content id='pageSettings' class="main">
        <md-list>
            <md-list-item>
                <md-switch v-model="bGlobalProxy" @change="onSettingChanged('bGlobalProxy')">全局代理</md-switch>
            </md-list-item>
            <md-list-item>
                <md-switch v-model="bHookSystem" class="md-primary" @change="onSettingChanged('bHookSystem')">系统</md-switch>
            </md-list-item>
        </md-list>
    </md-content>


</template>


<script>
if(typeof nodeRequire!='undefined')
    var {ipcRenderer} = nodeRequire("electron")

export default {
    data: () => ({
        bGlobalProxy: false,
        bHookSystem: false,
    })

    , methods: {
        onSettingChanged(dataName) {
            ipcRenderer.send('setting', dataName, this[dataName])
        } ,
    }
}
</script>