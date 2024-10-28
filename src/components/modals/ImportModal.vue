<template>
  <transition name="fade">
    <div
      v-show="isActive"
      class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 py-4 z-50"
      @click="$store.commit('setActiveModal', '')"
    >
      <div
        class="w-full max-w-lg max-h-full h-auto text-gray-900 bg-gray-100 rounded-lg p-4 overflow-auto"
        @click.stop="() => {}"
      >
        <div class="flex flex-col text-center">
          <button class="ml-auto" @click="$store.commit('setActiveModal', '')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          <div class="w-full mb-8">
            <div class="uppercase text-center mb-4">Import Data</div>
            <p>
              Importing data will override any game data currently saved. Click
              the button below and import the file called
              'letter_grid_data.txt'.
            </p>

            <button
              class="flex mx-auto mt-8 items-center justify-center py-1 px-3 gap-1 bg-black text-white rounded-full text-sm"
              @click="importData"
            >
              Import Data
            </button>
            <input
              class="hidden"
              type="file"
              name="data"
              id="data"
              ref="gamedata"
              accept=".txt"
              @change="importedData"
            />

            <p v-if="isError" class="text-sm text-red-600 mt-2">
              Import failed. Please ensure you've selected the correct file.
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { createHistory } from "../../common/localstorage.service";

export default {
  name: "HelpModal",

  data() {
    return {
      isError: false,
    };
  },

  computed: {
    ...mapGetters({
      activeModal: "getActiveModal",
    }),

    isActive() {
      return this.activeModal === "import_modal";
    },
  },

  methods: {
    importData() {
      this.$refs.gamedata.click();
    },

    importedData(event) {
      this.isError = false;

      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        const json = atob(base64String);

        try {
          JSON.parse(decodeURIComponent(json));

          createHistory(decodeURIComponent(json));

          this.$store.commit("setActiveModal", "stat_modal");
        } catch (e) {
          this.isError = true;
          return false;
        }
      };

      reader.readAsDataURL(file);
    },
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s 0.1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

p {
  @apply mb-3;
}
</style>
