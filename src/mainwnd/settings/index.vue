<template>
  <Tabs v-model="selectedTab" :animated="false">
      <TabPane label="服务器/隧道" name="server&tunnel">
        <mainwnd.settings.server-tunnel></mainwnd.settings.server-tunnel>
      </TabPane>
      <TabPane label="规则" name="reg">
        xxxx
      </TabPane>
  </Tabs>
</template>
<script>
  export default {
    data() {
      return $store.ui.mainwnd;
    }
  };
</script>