<template>
  <div id="app">
    <Sidebar v-if="showSidebar" />
    <router-view />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Sidebar,
  },
  computed: {
    showSidebar() {
      const routeName = this.$route.name;
      return routeName === 'Configuration' || routeName === 'robot' || routeName === 'Navigation';
    },
  },
};
</script>

<style>
/* Add your styles here */
</style>