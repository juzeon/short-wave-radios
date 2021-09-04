<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title><v-icon large left>mdi-radio-tower</v-icon>国际短波广播频率查询系统</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {}
  }
}
</script>