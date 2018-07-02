<template>

    <md-content id='pageSettings' class="main">
        <md-switch v-model="bGlobalProxy" @change="onSettingChanged('bGlobalProxy')">全局代理</md-switch>
        <md-switch v-model="bHookSystem" class="md-primary" @change="onSettingChanged('bHookSystem')">系统</md-switch>
    </md-content>

</template>


<script>
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