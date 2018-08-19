<template>
    <div class="main">

        <div style="flex:1">
            <div v-for="svr,idx in servers" class="server-setting">

                <div class="row">
                    <span class="expand">
                        <label>
                            <input type=checkbox v-model="svr.enable" @change="serverChanged(idx)">
                            启用
                        </label>
                    </span>
                    <span>
                        <a @click="removeServer(idx)" href="javascript:void(0)">删除</a>
                    </span>
                </div>

                <div class="row">
                    <span class="item-label">服务器：</span>
                    <input
                        v-model="svr.host"
                        class="expand"
                        placeholder="服务器域名或IP"
                        @change="serverChanged(idx)">
                    <input
                        v-model="svr.port"
                        style="width: 50px"
                        placeholder="SSH服务端口号"
                        @change="serverChanged(idx)">
                </div>
                <div class="row">
                    <span class="item-label">用户名：</span>
                    <input
                        v-model="svr.username"
                        class="expand"
                        placeholder="用户名"
                        @change="serverChanged(idx)">
                </div>
                <div class="row">
                    <span class="item-label">认证：</span>
                    <select
                        v-model="svr.auth"
                        @change="serverChanged(idx)">
                        <option value="password">使用密码</option>
                        <option value="key">使用秘钥</option>
                    </select>
                </div>
                <div class="row" v-show="svr.auth=='password'">
                    <span class="item-label">密码：</span>
                    <input
                        v-model="svr.password"
                        placeholder="密码（明文）"
                        class="expand"
                        label="密码"
                        @change="serverChanged(idx)">
                </div>
                <div class="row" v-show="svr.auth=='key'">
                    <span class="item-label">私钥：</span>
                    <textarea
                        v-model="svr.privateKey"
                        placeholder="Base64格式的id_rsa私钥"
                        class="expand"
                        style="height:70px"
                        label="密码"
                        @change="serverChanged(idx)">
                    </textarea>
                </div>

            </div>

        </div>

        <v-btn color="info" @click="addServer">
            <v-icon light>add</v-icon>
            添加服务器
        </v-btn>

    </div>
</template>

<style>
.item-label {
    width: 65px;
}

.server-setting {
    margin-top: 20px;
    margin-left: 15px;
    margin-right: 15px;
}
</style>


<script>
export default {
    data() {
        return {
            servers: $Settings.servers
        }
    } ,


    methods:{
        removeServer(idx){
            this.servers.splice(idx, 1)
            $ipc.send('server-remove', idx)
        },
        addServer() {
            var newServer = {
                "enable": false,
                "host": "",
                "port": 22,
                "username": "root",
                "auth": "password",
                "password": ''
            }
            this.servers.push(newServer)
            $ipc.send('server-new', newServer)
        },
        serverChanged(idx) {
            $ipc.send('server-save', idx, this.servers[idx])
        }
    }
}
</script>

