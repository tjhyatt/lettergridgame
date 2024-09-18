import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store/store'
import VueLuxon from 'vue-luxon'
import VueMatomo from 'vue-matomo'

Vue.use(VueLuxon)

Vue.config.productionTip = false

Vue.use(VueMatomo, {
  host: 'https://matomo.tjhyatt.com/',
  siteId: 5,
  router: router,
})

Vue.directive('shake', function (el, binding) {
  var shakeIntensity = binding.value.intensity ? binding.value.intensity : 0
  var blurIntensity = 1
  var shakeSpeed = 20
  var duration = 900

  if (shakeIntensity < 12) {
    shakeIntensity = 1
    blurIntensity = 1
  } else if (shakeIntensity >= 12 && shakeIntensity < 20) {
    shakeIntensity = 2
  } else if (shakeIntensity >= 20 && shakeIntensity < 30) {
    shakeIntensity = 4
  } else {
    shakeIntensity = 8
  }

  if (binding.value.active && binding.value.intensity) {
    el.style.transition = `transform ${shakeSpeed}ms ease-in-out`
    el.style.filter = `blur(${blurIntensity}px)`

    var ticks = 0
    var shaking = setInterval(() => {
      ticks++
      var percentageRemaining = 1 - 1 / (duration / (ticks * shakeSpeed))
      shakeIntensity = shakeIntensity * easeOutQuad(percentageRemaining)
      blurIntensity = blurIntensity * easeOutQuad(percentageRemaining)
      el.style.filter = `blur(${blurIntensity}px)`
      el.style.transform = `translate(${getRandomFloat(-shakeIntensity, shakeIntensity)}px, ${getRandomFloat(-shakeIntensity, shakeIntensity)}px)`

      if (percentageRemaining <= 0) {
        clearInterval(shaking)
        el.style.transform = `translate(0px, 0px)`
        el.style.filter = `blur(0px)`
      }
    }, shakeSpeed)
  }

  function getRandomFloat(min, max) {
    if (max === 0) {
      return 0
    } else {
      return Math.random() * (max - min + 1) + min
    }
  }

  function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

window._paq.push(['trackPageView'])
