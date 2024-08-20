<template>
  <div class="absolute top-0 left-0 right-0 flex items-center h-16 z-40">
    <div class="flex flex-grow px-6">
      <div class="text-black opacity-80 text-xl">
        Lettergrid - Daily #{{ gameNumber }}
      </div>

      <div class="flex items-center text-black opacity-80 ml-auto">
        <button @click="$store.commit('setIsHelpActive', true)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-8 h-8 px-1"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button class="ml-1" @click="$store.commit('setIsStatsActive', true)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-8 h-8 px-1"
          >
            <path
              d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { gameNumber } from "../common/helpers";
export default {
  data() {
    return {
      gameNumber: gameNumber(),
    };
  },
};
</script>

<style></style>
