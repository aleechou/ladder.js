<template>
    <div class="main" style="flex-direction: column; padding-left: 10px; padding-right: 10px;">

        <div style="height:20px; display: flex;">
            显示隧道：
            <label>
                <input type="checkbox" v-model="showDirectly" >
                直连
            </label>
            <label style="margin-left:10;px">
                <input type="checkbox" v-model="showProxy" >
                代理
            </label>
        </div>

        <div class="tunnel-list" name="list" is="transition-group">
            <div style="width: 100%"
                    v-for="(tunnel, index) of activeTunnels"
                    v-if="tunnel.directly? showDirectly: showProxy"
                    :key="tunnel.reqid"
                    @click="expandeTunnelDetail(tunnel)"
                    ref="tunnelitems">
  
                    <div class="tunnel-summary" style="cursor: pointer; width: 100%; display: flex">
                        <div style="flex:1" v-bind:class="{'directly': !!tunnel.directly}">

                            <v-icon title="通过代理连接" v-if="!tunnel.directly" style="color: green;">swap_horiz</v-icon>

                            <span>{{tunnel.dstHost}}</span>
                            <span style="color:gray">:{{tunnel.dstPort}}</span>

                            [{{tunnel.status}}]

                        </div>
                    </div>

                    <transition name="fade">
                        <div v-show="tunnel.detail" class='tunnel-detail'>

                            <div style="display:flex">
                                <div style="flex:1">
                                    <b>Source:</b>
                                    {{tunnel.srcAddr}}:{{tunnel.srcPort}}
                                </div>

                                <div>
                                    <b>PID:</b>
                                    {{tunnel.srcApp.pid}}
                                </div>
                            </div>
                            <div>
                                <b>APP:</b>
                                <b style="margin-left:10px">{{tunnel.srcApp.name}}</b>
                            </div>
                            <div>
                                <span class="app-path">
                                    {{tunnel.srcApp.path}}
                                    {{tunnel.srcApp.argv}}
                                </span>
                            </div>

                            <div>
                                <a v-show="!userRuleHasExists(tunnel.dstAddr)" title="将该域名作为规则，添加到用户规则表。后续对该域名的请求，都经过代理服务器建立隧道" href="javascript:void(0)" @click="addToUserRules(tunnel.dstAddr)">
                                    加为规则表
                                </a>
                                <a style="margin-left:20;px" title="强行关闭这个正在工作的隧道" href="javascript:void(0)" @click="disconnect(tunnel)">
                                    断开
                                </a>
                            </div>
                        </div>
                    </transition>
            </div>
        </div>
        
    </div>
</template>


<script>
var {ipcRenderer} = typeof nodeRequire!='undefined'? nodeRequire("electron"): {on:()=>{}}

var addrRuleCache = {}
function regexpFromAddr(addr) {
    if( !addrRuleCache[addr] )
        addrRuleCache[addr] = "(^|\\.)" + addr.replace(/\./g, '\\.') + "$"
    return addrRuleCache[addr]
}

var mapReqid2Tunnel = {}

export default {
    name: 'Tunnels' ,
    data(){
        return {
            activeTunnels: [],
            tunnelRemains: 0,
            showDirectly: true,
            showProxy: true,
            tunnelId: 0,
            develop: !!$Settings.develop,
        }
    } ,
    props: ['cbTunnelCountChanged'] ,
    created(){
        ipcRenderer.on('tunnel-new', (from, info)=>{
            this.prependTunnel(info)
        })
        ipcRenderer.on('tunnel-status-changed', (from, reqid, status)=>{
            mapReqid2Tunnel[reqid].status = status
        })
        ipcRenderer.on('tunnel-closed', (from, reqid)=>{
            this.tunnelRemains --
            
            delete mapReqid2Tunnel[reqid]

            for(var i=0; i<this.activeTunnels.length; i++){
                if( this.activeTunnels[i].reqid == reqid ) {
                    this.activeTunnels.splice(i, 1)
                    break
                }
            }
        })
    } ,
    mounted() {} ,
    methods: {
        disconnect: function(tunnel){
            ipcRenderer.send('disconnect-tunnel', tunnel.reqid)
        } ,

        prependTunnel(info) {
            info.detail = false
            this.tunnelRemains ++
            this.activeTunnels.unshift(info)

            mapReqid2Tunnel[info.reqid] = info

            this.$nextTick(()=>{
                $('.tunnel-detail:not(.hasinit)').each(function (){
                    $(this).addClass('hasinit')
                })
            })
        } ,

        expandeTunnelDetail(currentTunnel) {
            if( currentTunnel.detail ){
                currentTunnel.detail = false
            }
            else {
                for(var tunnel of this.activeTunnels) {
                    tunnel.detail = tunnel==currentTunnel
                } 
            }
        } ,

        userRuleHasExists(addr) {
            var regexp = regexpFromAddr(addr)
            for(var rule of $UserRules){
                if( regexp == rule.txt ){
                    return true
                }
            }
            return false
        } ,
        addToUserRules(addr) {
            var regexp = regexpFromAddr(addr)
            $ipc.send('user-rule-new', regexp)
        }

    },
    watch:{
        tunnelRemains (val){
            this.$props.cbTunnelCountChanged && this.$props.cbTunnelCountChanged(val)
        }

    },
    computed:{
        tunnelClasses() {

        }
    }
}
</script>

<style>

.directly {
    color: gray;
}

v-btn.small {
    min-width: 20px;
    height: 18px;
    font-size: 10px
}

.tunnel-list{
    overflow-x: hidden;
    overflow-y: scroll;
}

.tunnel-detail {
    padding-left: 15px;
    padding-right: 15px;
    font-size:12;
}

.app-path {
    word-wrap: break-word;
    color: gray;
}
.app-path {
    color: black;
}

/* 隧道列表动画 */
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}

/* 隧道详情动画 */
/* .bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
} */

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>