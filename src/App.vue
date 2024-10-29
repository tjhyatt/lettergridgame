<template>
  <div id="app" class="bg-gray-800">
    <UserBar />
    <ExportModal />
    <ImportModal />
    <DataModal />
    <HelpModal />
    <StatisticsModal />
    <router-view />
  </div>
</template>

<script>
import ExportModal from "./components/modals/ExportModal.vue";
import ImportModal from "./components/modals/ImportModal.vue";
import HelpModal from "./components/modals/HelpModal.vue";
import DataModal from "./components/modals/DataModal.vue";
import StatisticsModal from "./components/modals/StatisticsModal.vue";
import UserBar from "./components/UserBar.vue";

export default {
  name: "App",

  components: {
    UserBar,
    ExportModal,
    ImportModal,
    HelpModal,
    DataModal,
    StatisticsModal,
  },
};
</script>

<style lang="scss">
@import "./scss/styles.scss";

html,
body {
  height: 100%;
  position: absolute;
  width: 100%;
}

#app {
  background-image: url(../static/bg.jpg);
  background-position: 50%;
  background-size: cover;
  font-family: "Oswald", Helvetica, Arial, sans-serif;
  min-height: 100vh;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
