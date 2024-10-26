<template>
  <transition name="fade">
    <div
      v-show="isActive"
      class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 py-4 z-50"
      @click="$store.commit('setIsHelpActive', false)"
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
            <div class="uppercase text-center mb-4">How to play</div>
            <p>
              Drag and drop the green "Current Tile" onto an empty spot on the
              board.
            </p>
            <p>
              The aim of the game is to get a high score by making as many words
              as possible from a random assortment of tiles.
            </p>
            <p>
              If you receive a tile you don't want on your board you can place
              it in the bin. You have limited bin spaces so you them wisely!
            </p>
            <p>
              The game will end when all the board spaces are filled. Good luck
              and have fun!
            </p>
          </div>
          <div class="w-full mb-4">
            <div class="uppercase text-center mb-4">Scoring</div>
            <p>
              Scoring works the same as Scrabble. Single letter bonuses are
              calculated before the word bonuses. Five letter words will receive
              a 10 point bonus after all other bonuses are calculated.
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HelpModal",

  computed: {
    ...mapGetters({
      activeModal: "getActiveModal",
    }),

    isActive() {
      return this.activeModal === "help_modal";
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
