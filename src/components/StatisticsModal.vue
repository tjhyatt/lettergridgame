<template>
  <transition name="fade">
    <div
      v-show="isActive"
      class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 py-4 z-50"
      @click="$store.commit('setIsStatsActive', false)"
    >
      <div class="w-full max-w-lg max-h-full h-auto bg-gray-50 rounded-sm p-4 overflow-auto" @click.stop="() => {}">
        <div class="flex flex-col">
          <button class="ml-auto" @click="$store.commit('setIsStatsActive', false)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
            </svg>
          </button>
          <div class="w-full mb-12">
            <div class="uppercase text-center mb-4">Results</div>
            <div class="flex justify-around">
              <div class="flex flex-col items-center">
                <div class="text-xs uppercase">Score</div>
                <div class="text-3xl">{{ score }}</div>
              </div>
              <div class="flex flex-col items-center">
                <div class="text-xs uppercase">Top</div>
                <div class="text-3xl">{{ highscore }}</div>
              </div>
              <div class="flex flex-col items-center">
                <div class="text-xs uppercase">Average</div>
                <div class="text-3xl">{{ average }}</div>
              </div>
              <div class="flex flex-col items-center">
                <div class="text-xs uppercase">Played</div>
                <div class="text-3xl">{{ played }}</div>
              </div>
            </div>
          </div>
          <div class="w-full h-80 mb-8">
            <div class="uppercase text-center mb-4">Game History</div>
            <canvas id="planet-chart"></canvas>
          </div>
          <div class="w-full mb-8">
            <div class="uppercase text-center">Next Game</div>
            <div class="text-3xl text-center">{{ timeToMidnight }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Chart from 'chart.js'
import { DateTime, Duration } from 'luxon'
import { planetChartData, fetchHistory } from '../common/data'
import { gameNumber } from '../common/helpers'
import { mapGetters } from 'vuex'

export default {
  name: 'PlanetChart',

  data () {
    return {
      history: null,
      timeToMidnight: null
    }
  },

  computed: {
    ...mapGetters({
      'isActive': 'getIsStatsActive'
    }),

    score () {
      if (!this.history) {
        return 0
      }

      const finishedGame = this.history.games.find(game => game.gameNumber === gameNumber())

      if (finishedGame) {
        return finishedGame.score
      }

      return '-'
    },

    highscore () {
      if (!this.history) {
        return 0
      }

      const scores = this.history.games.map(game => {
        return game.score
      })

      return Math.max(...scores)
    },

    average () {
      if (!this.history) {
        return 0
      }

      let total = 0
      this.history.games.forEach(game => {
        total += game.score
      })

      return (total / this.played).toFixed(1)
    },

    played () {
      return this.history ? this.history.games.length : 0
    }
  },

  watch: {
    isActive (newValue) {
      if (newValue) {
        this.history = fetchHistory()

        const ctx = document.getElementById('planet-chart')
        const chart = new Chart(ctx, planetChartData())

        chart.update()
      }
    }
  },

  mounted () {
    this.history = fetchHistory()

    if (this.history) {
      const ctx = document.getElementById('planet-chart')
      const chart = new Chart(ctx, planetChartData())

      chart.update()
    }

    let nextMidnight = new Date()
    nextMidnight.setHours(24, 0, 0, 0)

    const nextMidnightIso = this.toIsoString(nextMidnight)
    const nextMidnightLuxon = DateTime.fromISO(nextMidnightIso)

    setInterval(() => {
      const now = DateTime.now()
      const diff = nextMidnightLuxon.diff(now, ['hours'])

      this.timeToMidnight = Duration.fromObject({hours: diff.hours}).toFormat('hh:mm:ss')
    }, 1000)
  },

  methods: {
    toIsoString (date) {
      let tzo = -date.getTimezoneOffset()
      let dif = tzo >= 0 ? '+' : '-'
      let pad = function (num) {
        return (num < 10 ? '0' : '') + num
      }

      return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60)
    }
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s .1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
