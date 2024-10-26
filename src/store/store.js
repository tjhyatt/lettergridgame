import Vue from "vue";
import Vuex from "vuex";
import game from "./game.module";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    isHelpActive: false,
    isStatsActive: false,
    activeModal: "",
  },

  getters: {
    getIsHelpActive(state) {
      return state.isHelpActive;
    },

    getIsStatsActive(state) {
      return state.isStatsActive;
    },

    getActiveModal(state) {
      return state.activeModal;
    },
  },

  mutations: {
    setIsHelpActive: (state, payload) => {
      state.isHelpActive = payload;
    },

    setIsStatsActive: (state, payload) => {
      state.isStatsActive = payload;
    },

    setActiveModal: (state, payload) => {
      state.activeModal = payload;
    },
  },

  modules: {
    game,
  },
});
