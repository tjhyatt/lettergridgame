<template>
  <div v-if="isActive" class="word-score" :style="style">
    {{ score }}
  </div>
</template>

<script>
export default {
  props: ['x', 'y', 'score'],

  data () {
    return {
      isActive: true
    }
  },

  computed: {
    style () {
      return {
        left: `${this.x}px`,
        top: `${this.y}px`
      }
    }
  },

  methods: {
    remove () {
      this.$destroy()
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
.word-score {
  animation: fadeIn 1.5s linear forwards;
  color: #39db4b;
  font-size: 30px;
  font-weight: bold;
  position: absolute;
  text-shadow: rgba(0,0,0,0.6) 0.1em 0.15em 0.15em;
  transform: translate(-50%, -50%);
  z-index: 10;
}

@keyframes fadeIn {
  0% {
    color: #39db4b;
    opacity: 1;
    transform: scale(1.5) translate(-50%, -30%);
  }
  20% {
    opacity: 1;
  }

  50% {
    opacity: 1;
    transform: scale(1.3) translate(-50%, -60%);
  }

  80% {
    opacity: 1;
  }

  100% {
    color: #fff;
    opacity: 0;
    transform: scale(1) translate(-50%, -90%);
  }
}
</style>
