(function(){module={exports:{}}; exports=module.exports;

var __vue_template__ = `"\n  <el-tabs v-model=\"activeName\" @tab-click=\"handleClick\">\n    <el-tab-pane label=\"用户管理\" name=\"first\">用户管理</el-tab-pane>\n    <el-tab-pane label=\"配置管理\" name=\"second\">配置管理</el-tab-pane>\n    <el-tab-pane label=\"角色管理\" name=\"third\">角色管理</el-tab-pane>\n    <el-tab-pane label=\"定时任务补偿\" name=\"fourth\">定时任务补偿</el-tab-pane>\n  </el-tabs>\n"`;
module.exports = {
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
;(typeof module.exports === "function"? module.exports.options: module.exports).template = __vue_template__;

return module.exports
})()