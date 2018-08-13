<template>

    <div
        class="main"
        icon="wifi_off"
        label="退出？">
        <button @click="exit">确定退出</button>
    </div>

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