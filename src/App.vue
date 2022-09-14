<template>
  <div id="app" class="bg-gray-800">
    <UserBar />
    <HelpModal />
    <StatisticsModal />
    <router-view />
  </div>
</template>

<script>
import HelpModal from './components/HelpModal.vue'
import StatisticsModal from './components/StatisticsModal.vue'
import UserBar from './components/UserBar.vue'

export default {
  name: 'App',

  components: { UserBar, HelpModal, StatisticsModal }
}
</script>

<style lang="scss">
@import './scss/styles.scss';

html,
body {
  height: 100%;
  position: absolute;
  width: 100%;
}

#app {
  background-attachment: fixed;
  // background-image: url(./assets/bg2_darken.jpg);
  background-position: 50%;
  background-size: cover;
  font-family: 'Oswald', Helvetica, Arial, sans-serif;
  min-height: 100vh;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
