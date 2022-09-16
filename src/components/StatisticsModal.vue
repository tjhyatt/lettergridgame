<template>
  <transition name="fade">
    <div
      v-show="isActive"
      class="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 py-4 z-50"
      @click="$store.commit('setIsStatsActive', false)"
    >
      <div class="w-full max-w-lg max-h-full h-auto text-gray-900 bg-gray-100 rounded-sm p-4 overflow-auto" @click.stop="() => {}">
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
                <div v-if="isGameOver" class="relative mt-1">
                  <transition name="fade">
                    <div v-if="isScoreCopied" class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-500 bg-opacity-90 text-white text-xs uppercase py-1 w-20 text-center rounded-md">Score copied</div>
                  </transition>
                  <button
                    class="flex items-center text-xs text-white uppercase bg-green-600 hover:bg-green-700 transition-colors duration-150 rounded-md px-2 py-1"
                    @click="copyScoreToClipboard"
                  >
                    Share
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="ml-1 w-3 h-3">
                      <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
                    </svg>
                  </button>
                </div>
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
          <div class="w-full h-64 mb-8">
            <div class="uppercase text-center mb-4">Game History <span class="text-xs opacity-70">last 7</span></div>
            <canvas id="planet-chart"></canvas>
          </div>
          <div class="w-full my-8">
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
import { chartData, fetchHistory } from '../common/chartdata'
import { gameNumber } from '../common/helpers'
import { mapGetters } from 'vuex'

export default {
  name: 'StatisticsModal',

  data () {
    return {
      history: null,
      timeToMidnight: '00:00:00',
      nextMidnight: null,
      now: null,
      timer: null,
      isScoreCopied: false
    }
  },

  computed: {
    ...mapGetters({
      'isActive': 'getIsStatsActive',
      'isGameOver': 'getIsGameOver'
    }),

    score () {
      if (!this.history) return 0

      const finishedGame = this.history.games.find(game => game.gameNumber === gameNumber())

      if (finishedGame) {
        return finishedGame.score
      }

      return '-'
    },

    highscore () {
      if (!this.history) return 0

      const scores = this.history.games.map(game => {
        return game.score
      })

      return Math.max(...scores)
    },

    average () {
      if (!this.history) return 0

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
        const chart = new Chart(ctx, chartData())

        chart.update()
      }
    }
  },

  mounted () {
    this.history = fetchHistory()

    if (this.history) {
      const ctx = document.getElementById('planet-chart')
      const chart = new Chart(ctx, chartData())

      chart.update()
    }

    let midnight = new Date()
    midnight.setHours(24, 0, 0, 0)

    const nextMidnightIso = this.toIsoString(midnight)
    this.nextMidnight = DateTime.fromISO(nextMidnightIso)

    this.timer = setInterval(() => {
      this.now = DateTime.now()
      const diff = this.nextMidnight.diff(this.now, ['hours'])

      this.timeToMidnight = Duration.fromObject({hours: diff.hours}).toFormat('hh:mm:ss')

      if (this.now >= this.nextMidnight) {
        this.timeToMidnight = '00:00:00'
        clearInterval(this.timer)
      }
    }, 1000)
  },

  methods: {
    copyScoreToClipboard () {
      const scoreString = `Lettergrid #${gameNumber()} - Score: ${this.score}`

      navigator.clipboard.writeText(scoreString)

      this.isScoreCopied = true
      setTimeout(() => {
        this.isScoreCopied = false
      }, 3000)
    },

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
