<template>
  <div
    v-if="tile"
    class="tile tile--next"
    :class="[
      { 'tile--touch-dragging': isTouchDragging },
      { 'tile--click-dragging': isClickDragging },
    ]"
    :style="styles"
    @mousedown="clickStart"
    @mousemove="clickMove"
    @mouseup="clickEnd"
    @touchstart="touchStart"
    @touchmove="touchmove"
    @touchend="touchend"
  >
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

  methods: {
    resetTile() {
      this.hoveredTileType = null;
      this.hoveredTileIndices.row = null;
      this.hoveredTileIndices.col = null;

      this.$emit("highlightBoardLetterReset");
      this.$emit("highlightBinLetterReset");
    },

    clickStart(e) {
      this.isClicked = true;

      if (this.initPos.x === 0 && this.initPos.y === 0) {
        this.initPos.x = e.clientX;
        this.initPos.y = e.clientY;
      }
    },

    clickMove(e) {
      if (this.isClicked) {
        this.isClickDragging = true;

        this.pos.x += e.movementX;
        this.pos.y += e.movementY;

        const hoveredElements = document.elementsFromPoint(
          e.clientX,
          e.clientY
        );
        const hoveredTile = hoveredElements.find((el) => {
          return el.className === "tile-slot tile__letter";
        });

        if (hoveredTile) {
          this.hoveredTileType = hoveredTile.getAttribute("type")
            ? hoveredTile.getAttribute("type")
            : null;

          if (this.hoveredTileType === "board") {
            const row = hoveredTile.getAttribute("row");
            const col = hoveredTile.getAttribute("col");

            this.hoveredTileIndices.row = row;
            this.hoveredTileIndices.col = col;
            this.$emit("highlightBoardLetter", row, col);
          } else if (this.hoveredTileType === "bin") {
            const row = hoveredTile.getAttribute("row");

            this.hoveredTileIndices.row = row;
            this.hoveredTileIndices.col = null;
            this.$emit("highlightBinLetter", row);
          } else {
            this.resetTile();
          }
        } else {
          this.resetTile();
        }
      }
    },

    clickEnd() {
      this.isClicked = false;
      this.isClickDragging = false;

      if (this.hoveredTileType === "board") {
        this.$emit("setBoardTile", this.tile, this.hoveredTileIndices);

        this.pos = {
          x: 0,
          y: 0,
        };
      }

      if (this.hoveredTileType === "bin") {
        this.$emit("setBinTile", this.tile, this.hoveredTileIndices);
        this.pos = {
          x: 0,
          y: 0,
        };
      }

      this.resetTile();
    },

    touchStart(e) {
      if (this.initPos.x === 0 && this.initPos.y === 0) {
        this.initPos.x = e.changedTouches[0].clientX;
        this.initPos.y = e.changedTouches[0].clientY;
      }
    },

    touchmove(e) {
      e.preventDefault();
      this.isTouchDragging = true;

      this.pos.x = e.changedTouches[0].clientX - this.initPos.x;
      this.pos.y = e.changedTouches[0].clientY - this.initPos.y;

      const hoveredTile = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
      this.hoveredTileType = hoveredTile.getAttribute("type")
        ? hoveredTile.getAttribute("type")
        : null;

      if (this.hoveredTileType === "board") {
        const row = hoveredTile.getAttribute("row");
        const col = hoveredTile.getAttribute("col");

        this.hoveredTileIndices.row = row;
        this.hoveredTileIndices.col = col;
        this.$emit("highlightBoardLetter", row, col);
      } else if (this.hoveredTileType === "bin") {
        this.$emit("highlightBinLetter");
      } else {
        this.resetTile();
      }
    },

    touchend(e) {
      this.isTouchDragging = false;

      if (this.hoveredTileType === "board") {
        this.$emit("setBoardTile", this.tile, this.hoveredTileIndices);
        this.pos = {
          x: 0,
          y: 0,
        };
      }

      if (this.hoveredTileType === "bin") {
        this.$emit("setBinTile", this.tile, this.hoveredTileIndices);
        this.pos = {
          x: 0,
          y: 0,
        };
      }

      this.resetTile();
    },

    deselectTile() {
      this.hoveredTile = null;
      this.isClicked = false;
      this.isClickDragging = false;
      this.isTouchDragging = false;
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
  cursor: grab;
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

  &__value {
    bottom: 0.5em;
    color: #222;
    font-size: 0.9em;
    font-weight: 700;
    pointer-events: none;
    position: absolute;
    right: 0.5em;
  }

  &--next {
    animation: pulse linear infinite 3s;
  }

  &--touch-dragging {
    opacity: 0.5;
    pointer-events: none;
  }

  &--click-dragging {
    opacity: 0.5;

    &::before {
      content: "";
      height: 345px;
      position: absolute;
      transform: translate(-135px, -135px);
      width: 345px;
    }
  }
}

@keyframes pulse {
  0% {
    background: rgb(52, 232, 39);
  }
  50% {
    background: rgb(192, 255, 188);
  }
  100% {
    background: rgb(52, 232, 39);
  }
}
</style>
