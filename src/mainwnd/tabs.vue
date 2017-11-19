<template>
  <Tabs value="name1" :animated=false>
      <TabPane label="标签一" name="name1">标签一的内容1</TabPane>
      <TabPane label="标签二" name="name2">标签二的内容</TabPane>

      <TabPane label="标签三" name="name3">标签三的内容</TabPane>
  </Tabs>
</template>
<script>
  export default {
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
</script>