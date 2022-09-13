<template>
  <div class="absolute top-0 left-0 right-0 flex items-center h-12 z-40">
    <div class="flex flex-grow px-4">
      <div class="text-white text-xl">
        Lettergrid Game - Daily #{{ gameNumber }}
      </div>

      <button class="text-white ml-auto" @click="$store.commit('setIsStatsActive', true)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { gameNumber } from '../common/helpers'
export default {
  data () {
    return {
      gameNumber: gameNumber()
    }
  }
}
</script>

<style>

</style>
