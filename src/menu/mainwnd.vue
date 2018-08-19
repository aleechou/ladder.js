<template>
    <div>
        <settings ref='settings'></settings>
        <tunnels ref='tunnels' :cbTunnelCountChanged="cbTunnelCountChanged"></tunnels>
        <servers lanuch ref='servers'></servers>
        <rules ref='rules'></rules>
        <exit ref='exit'></exit>
        
        <v-bottom-nav>
            <v-btn @click="switchPage('settings')">
                <span>设置</span>
                <v-icon>build</v-icon>
            </v-btn>
            <v-btn id="item-posts" @click="switchPage('tunnels')">
                <v-icon class="material-icons">swap_horiz</v-icon>
                <span >隧道</span>
                <i class="badge" v-if="activeTunnels">{{ activeTunnels }}</i>
            </v-btn>
            <v-btn @click="switchPage('servers')">
                <span>服务器</span>
                <v-icon>filter_drama</v-icon>
            </v-btn>
            <v-btn @click="switchPage('rules')">
                <span>规则</span>
                <v-icon>check_circle_outline</v-icon>
            </v-btn>
            <v-btn @click="switchPage('exit')">
                <span>退出</span>
                <v-icon>power_settings_new</v-icon>
            </v-btn>
        </v-bottom-nav>
    </div>
</template>


<script>
import Settings from './settings.vue'
import Tunnels from './tunnels.vue'
import Servers from './servers.vue'
import Rules from './rules.vue'
import Exit from './exit.vue'

export default {
    data: () => ({
        activeTunnels:0 ,
    }),
    mounted () {
        $("[lanuch]")[0].style.display = 'flex'
    },
    methods: {
        switchPage (pageName) {
            $(".main").hide()
            this.$refs[pageName].$el.style.display = 'flex'
        } ,
        cbTunnelCountChanged(val) {
            this.activeTunnels = val
        }
    },
    components: {
        Settings
        , Tunnels
        , Servers
        , Rules
        , Exit
    }
}
</script>


<style>
.v-bottom-nav{
    -webkit-transform: translate(0, 0px);
    transform: translate(0, 0px);
}
.app {
    display: flex;
}
</style>