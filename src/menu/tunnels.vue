<template>
    <md-content class="main" style="flex-direction: column; padding-left: 10px; padding-right: 10px;">

        <div style="font-size:13; display: flex;">
            <v-checkbox small v-model="showDirectly" label="直接连接"></v-checkbox>
            <v-checkbox small v-model="showProxy" label="代理隧道"></v-checkbox>

            <v-btn small flat icon @click="add"><v-icon dark>add</v-icon></v-btn>
            <v-btn small flat icon @click="plus"><v-icon>remove</v-icon></v-btn>
        </div>

        <div class="tunnel-list" name="list" is="transition-group">
            <div style="width: 100%"
                    v-for="(tunnel, index) of activeTunnels"
                    v-if="tunnel.directly? showDirectly: showProxy"
                    :key="tunnel.reqid"
                    @click="expandeTunnelDetail(tunnel)"
                    ref="tunnelitems">
  
                    <div class="md-dense md-primary tunnel-summary" style="cursor: pointer; width: 100%; display: flex">
                        <div style="flex:1" v-bind:class="{'directly': !!tunnel.directly}">

                            <v-icon title="通过代理连接" v-if="!tunnel.directly" style="color: green;">swap_horiz</v-icon>

                            <span>{{tunnel.dstAddr}}</span>
                            <span style="color:gray">:{{tunnel.dstPort}}</span>
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
                                <md-button class="md-dense" title="将域名加入到白名单规则中。后续对该域名的请求，都经过代理服务器建立隧道">
                                    白名单
                                </md-button>
                                <md-button class="md-dense" title="将域名加入到黑名单规则中。后续对该域名的请求不再经过代理服务器">
                                    黑名单
                                </md-button>
                                <md-button class="md-dense md-accent" title="强行关闭这个正在工作的隧道" href="javascript:void(0)" @click="disconnect(tunnel)">
                                    断开
                                </md-button>
                            </div>
                        </div>
                    </transition>
            </div>
        </div>
        
    </md-content>
</template>


<script>
var {ipcRenderer} = typeof nodeRequire!='undefined'? nodeRequire("electron"): {on:()=>{}}

export default {
    name: 'Tunnels' ,
    data(){
        return {
            activeTunnels: [],
            tunnelRemains: 0,
            showDirectly: true,
            showProxy: true,
            tunnelId: 0
        }
    } ,
    props: ['cbTunnelCountChanged'] ,
    created(){
        ipcRenderer.on('tunnel-new', (from, info)=>{
            this.prependTunnel(info)
        })
        ipcRenderer.on('tunnel-closed', (from, reqid)=>{
            this.tunnelRemains --
            
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

            this.$nextTick(()=>{
                $('.tunnel-detail:not(.hasinit)').each(function (){
                    // tippy(this.querySelectorAll("[title]"), {
                    //     delay: 100,
                    //     arrow: true,
                    //     arrowType: 'round',
                    //     size: 'small',
                    //     duration: 200,
                    //     animation: 'scale'
                    // })

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

        randomIndex: function () {
            return Math.floor(Math.random() * this.activeTunnels.length)
        } ,
        add: function () {
            this.prependTunnel({
                directly: false, 
                dstAddr:'www.baidu.com', 
                srcApp:{pid:1234, name:'firefox'}, 
                dstPort:443, detail:false,
                reqid: this.tunnelId ++
            })
        } ,
        plus: function () {
            var i = this.randomIndex()
            console.log(i)
            this.activeTunnels.splice(i, 1)
        } ,
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
.md-list-item-container{
    font-size: 14 ;
}

.directly {
    color: gray;
}

.md-list-item-content {
    min-height: 40px;
}

v-btn.small {
    min-width: 20px;
    height: 18px;
    font-size: 10px
}

.md-tooltip {
    font-size: 10;
}

.tunnel-list{
    overflow-x: hidden;
    /* overflow-y: scroll; */
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