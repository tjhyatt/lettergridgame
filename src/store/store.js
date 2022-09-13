import Vue from 'vue'
import Vuex from 'vuex'
import game from './game.module'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    isStatsActive: false
  },

  getters: {
    getIsStatsActive (state) {
      return state.isStatsActive
    }
  },

  mutations: {
    setIsStatsActive: (state, payload) => {
      state.isStatsActive = payload
    }
  },

  modules: {
    game
  }
})
