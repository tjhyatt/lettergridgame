import Vue from 'vue'
import Router from 'vue-router'
import GameBoard from '@/views/GameBoard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GameBoard',
      component: GameBoard
    }
  ]
})
