<template>
    <div class="main">

        <h3>用户规则</h3>
        
        <div class="list-user-rules">
            <div class="row listitem-user-rule" v-for="rule,idx of rules">
                <input class="checkbox" type=checkbox :checked="rule.enable? 'checked': ''" @click="enableChanged(idx)" >
                <span v-show="editingIndex!=idx" style="flex:1" @click='startEditRule(idx)'>{{rule.txt}}</span>
                <input class="ipt-rule-edit" :idx=idx v-show="editingIndex==idx" style="flex:1" v-model="rule.txt"
                        @keyup.enter="saveRule()"
                        @blur="saveRule()">

                <a v-show="editingIndex==idx" @click="deleteRule(idx)">删除</a>
            </div>
        </div>

    </div>    
</template>


<script>
var {ipcRenderer} = typeof nodeRequire!='undefined'? nodeRequire("electron"): {on:()=>{}}

export default {
    data() {
        return {
            rules: $UserRules ,
            editingIndex: -1
        }
    }, 
    created () {
        ipcRenderer.on('user-rule-new', (from, idx, rule)=>{
            this.rules.push(rule)
        })
    } ,
    methods: {
        enableChanged(idx) {
            var rule = this.rules[idx]
            rule.enable = !rule.enable

            // 向主进程请求 settings
            $ipc.send('user-rule-changed', idx, rule)
        } ,

        deleteRule(idx){
            this.rules.splice(idx,1)
            $ipc.send('user-rule-delete', idx)
        } ,

        startEditRule(idx) {
            this.editingIndex = idx
            setTimeout(()=> $(".ipt-rule-edit[idx="+idx+"]")[0].focus(), 0)
        } ,

        cancelEditRule() {
            this.editingIndex = -1
        },

        saveRule(idx) {
            $ipc.send('user-rule-changed', this.editingIndex, this.rules[this.editingIndex])
            this.editingIndex = -1
        }
    }
}
</script>


<style>
.list-user-rules {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 10px;
    margin-right: 10px;
    overflow-y: scroll;
    height: 100%;
}
.listitem-user-rule {
    display: flex;
    margin-bottom: 4px;
}
.listitem-user-rule input.checkbox {
    margin-right: 4px;
}
</style>