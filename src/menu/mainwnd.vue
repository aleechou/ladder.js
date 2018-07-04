<template>
    <div>
        <settings ref='settings'></settings>
        <tunnels ref='tunnels' :cbTunnelCountChanged="cbTunnelCountChanged"></tunnels>
        <servers ref='servers'></servers>
        <rules ref='rules'></rules>
        <exit ref='exit'></exit>
        
        <md-bottom-bar md-type="shift">
            <md-bottom-bar-item md-label="设置" md-icon="build" @click="switchPage('settings')"></md-bottom-bar-item>
            <md-bottom-bar-item id="item-posts" @click="switchPage('tunnels')">
                <md-icon class="md-bottom-bar-icon material-icons">swap_horiz</md-icon>
                <span class="md-bottom-bar-label">隧道</span>
                <i class="badge" v-if="activeTunnels">{{ activeTunnels }}</i>
            </md-bottom-bar-item>
            <md-bottom-bar-item md-label="服务器" md-icon="filter_drama" @click="switchPage('servers')"></md-bottom-bar-item>
            <md-bottom-bar-item md-label="规则" md-icon="check_circle_outline" @click="switchPage('rules')"></md-bottom-bar-item>
            <md-bottom-bar-item md-label="退出" md-icon="power_settings_new" @click="switchPage('exit')"></md-bottom-bar-item>
        </md-bottom-bar>
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
        app.style.display = 'flex'
        this.$refs.tunnels.$el.style.display = 'flex'
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
