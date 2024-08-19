<template>
  <div v-if="tile" class="tile tile--preview" :style="styles">
    <div v-if="tileType === 'single'" class="tile__letter">
      {{ tileLetter }}
    </div>
    <div v-if="tileType === 'double'" class="tile__double-letter">
      <div class="tile__top">{{ tileLetter[0] }}</div>
      <div class="tile__divider">or</div>
      <div class="tile__bottom">{{ tileLetter[1] }}</div>
    </div>
    <div class="tile__value">{{ tile.value }}</div>
  </div>
</template>

<script>
export default {
  props: ["isTouch", "tile"],

  data() {
    return {
      hoveredTileIndices: {
        row: null,
        col: null,
      },
      hoveredTileType: null,
      isClicked: false,
      isClickDragging: false,
      isTouchDragging: false,
      initPos: {
        x: 0,
        y: 0,
      },
      pos: {
        x: 0,
        y: 0,
      },
    };
  },

  computed: {
    styles() {
      return {
        transform: `translate(${this.pos.x}px, ${this.pos.y}px)`,
      };
    },

    tileType() {
      // check if string contains pipe
      if (this.tile.letter.indexOf("|") !== -1) {
        return "double";
      } else {
        return "single";
      }
    },

    tileLetter() {
      if (this.tileType === "single") {
        return this.tile.letter;
      } else {
        return this.tile.letter.split("|");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$tilesize: 5em;
$tilegap: 0.5em;

.tile {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.25em;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  cursor: not-allowed;
  height: $tilesize;
  position: relative;
  user-select: none;
  width: $tilesize;
  z-index: 10;

  &__heading {
    background: #fff;
    color: #222;
    font-size: 0.8em;
    font-weight: 700;
    margin: 0 0 5px;
    padding: 0.5em;
    text-transform: uppercase;
  }

  &__letter {
    align-items: center;
    color: #222;
    display: flex;
    font-size: 2.4em;
    font-weight: 700;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    text-transform: uppercase;
    width: 100%;
  }

  &__double-letter {
    align-items: center;
    color: #222;
    display: flex;
    font-size: 2em;
    font-weight: 700;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    text-transform: uppercase;
    width: 100%;
  }

  &__top {
    left: 15%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  &__bottom {
    left: 65%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  &__divider {
    font-size: 0.4em;
  }

  &--preview {
    background: rgb(195, 195, 195);
    scale: 0.85;
    // opacity: 0.8;
    pointer-events: none;
    z-index: 0;
  }

  &__value {
    bottom: 0.5em;
    color: #222;
    font-size: 0.9em;
    font-weight: 700;
    pointer-events: none;
    position: absolute;
    right: 0.5em;
  }
}
</style>
