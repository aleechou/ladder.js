
<style>
.selected {
    background-color: rgb(102, 193, 247);
}
.server-li {
    height: 30px;
    padding-top: 6px;
    padding-left: 10px;
    cursor: pointer;
}
</style>
<template>
    <div style="display:flex;">

        <div>

            <ul v-for="item, row in config.tunnels" style="width:200px">
                <li class="server-li" v-bind:class="{ selected: row==currentServerIdx}" @click="onClickServer(row)">
                    {{serverTitle(item)}}
                </li>
            </ul>

            <div>
                <Button icon="plus" size="small" @click="addServer">添加</Button>
                <Button icon="trash-b" size="small" @click="removeCurrentServer">移除</Button>
            </div>
        </div>

        <Form label-position="right" :label-width="80">
            <FormItem label="隧道名称">
                <Input v-model="currentTunnel.title" :placeholder="serverTitle(currentTunnel)"></Input>
            </FormItem>
            <FormItem label="服务器">
                <Row>
                    <Col span="18">
                        <Input v-model="currentTunnel.server" placeholder="IP 或 域名"></Input>
                    </Col>
                    <Col span="6">
                        <Input v-model="currentTunnel.port" placeholder="<端口号>, 22">端口：</Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="用户">

                <Row>
                    <Col span="12">
                        <Input v-model="currentTunnel.username" placeholder="用户名">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </Col>
                    <Col span="12">
                        <Input type="password" v-model="currentTunnel.password" :disabled="!!currentTunnel.useKey" placeholder="密码">
                            <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        </Input>
                    </Col>
                </Row>
            </FormItem>

            <FormItem label="公钥">
                <Input :disabled="!currentTunnel.useKey" v-model="currentTunnel.pubKey" type="textarea" :autosize="{minRows: 1,maxRows: 5}" placeholder=""></Input>
            </FormItem>
            <FormItem label="私钥">
                <Input :disabled="!currentTunnel.useKey" v-model="currentTunnel.priKey" type="textarea" :autosize="{minRows: 1,maxRows: 5}" placeholder=""></Input>
            </FormItem>

            <FormItem label="使用密钥">
                <Switch v-model="currentTunnel.useKey">
                    <Icon type="android-done" slot="open"></Icon>
                    <Icon type="android-close" slot="close"></Icon>
                </Switch>    
            </FormItem>


            <FormItem label="隧道类型">
                <RadioGroup v-model="currentTunnel.type">
                    <Radio label="dynamic">
                        <span>动态(-D)</span>
                    </Radio>
                    <Radio label="local" sdisabled="true">
                        <span>本地主机转发(-L)</span>
                    </Radio>
                    <Radio label="remove" sdisabled="true">
                        <span>远程主机转发(-R)</span>
                    </Radio>
                </RadioGroup>
            </FormItem>


            <Row label="" v-show="currentTunnel.type=='dynamic'">
                (请求) ->
                本机:<Input v-model="currentTunnel.inPort" style="width:60px"></Input>
                ==隧道==>
                代理服务器
                -> 目标服务器
            </Row>

            <Row label="" v-show="currentTunnel.type=='local'">
                (请求) ->
                本机:<Input v-model="currentTunnel.inPort" style="width:60px"></Input>
                ==隧道==>
                代理服务器
                ->
                <Input v-model="currentTunnel.targetHost" style="width:120px"></Input>
                <Input v-model="currentTunnel.targetPort" style="width:60px"></Input>
            </Row>


            <Row label="" v-show="currentTunnel.type=='remote'">
                (请求) ->
                本机:<Input v-model="currentTunnel.inPort" style="width:60px"></Input>
                ==隧道==>
                代理服务器
                -> 目标服务器
            </Row>

            <Row>
                启动时自动连接:
                <Switch v-model="currentTunnel.connectOnStart">
                    <Icon type="android-done" slot="open"></Icon>
                    <Icon type="android-close" slot="close"></Icon>
                </Switch>
            </Row>

            <Row>
                断开后尝试自动重连:
                <Switch v-model="currentTunnel.autoReconnect">
                    <Icon type="android-done" slot="open"></Icon>
                    <Icon type="android-close" slot="close"></Icon>
                </Switch>  
            </Row>

        </Form>

    </div>
</template>


<script>
export default {
    data() {
        console.log(JSON.stringify($store))
        return {
            config: $store.config
            , currentServerIdx: 0
        }
    },

    computed: {
        currentTunnel() {
            if(!$store.config.tunnels.length) {
                console.log("auto newEmptyServerConfig()")
                console.log(JSON.stringify($store))
                $store.config.tunnels = [newEmptyServerConfig()]
                this.currentServerIdx = 0
            }
            return $store.config.tunnels[this.currentServerIdx]
        },
        currentTitle(){
            return this.methods.serverTitle(this.currentTunnel)
        }
    },

    methods: {
        addServer() {
            $store.config.tunnels.push(newEmptyServerConfig())
            this.currentServerIdx = $store.config.tunnels.length-1
        },
        removeCurrentServer() {
            $store.config.tunnels.splice(this.currentServerIdx)
            
            // 删除的是最后一个
            if(this.currentServerIdx>=$store.config.tunnels.length){
                this.currentServerIdx--
            }
        },
        serverTitle(serverConfig) {
            if(!serverConfig) return ''
            if(serverConfig.title)
                return serverConfig.title
            else if(serverConfig.server) {
                var title = (serverConfig.username||"") + "@" + serverConfig.server
                if(serverConfig.port!=22)
                    title+= " :" + serverConfig.port
                return title
            }
            else {
                return "<user>@<host or ip> :<port>"
            }
        }, 

        onClickServer(row) {
            this.currentServerIdx = row
        }
    }
}

function genServerConfigId() {
    return qnode.utils.md5(Date.now().toString()+Math.random())
}

function newEmptyServerConfig() {
    return {
                id: genServerConfigId(),
                title: "",
                server: "",
                port: 22,
                username: "root",
                password: "",
                pubKey: "",
                priKey: '',
                useKey: true,
                type: "dynamic",
                inPort: 7070,
                connectOnStart: false,
                autoReconnect: true
            }
}

</script>
