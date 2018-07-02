<template>

    <md-empty-state
        class="main"
        md-icon="wifi_off"
        md-label="退出？">
        <md-button class="md-accent md-raised" @click="exit">确定退出</md-button>
    </md-empty-state>

</template>


<script>
if(typeof(nodeRequire)!='undefined')
    var {ipcRenderer} = nodeRequire('electron')
    
export default {
    methods: {
        exit () {
            ipcRenderer.send('exit')
        }
    }
}
</script>