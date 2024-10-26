<template>
  <div v-if="tile" class="tile">
    <div class="tile__letter">{{ tile.letter }}</div>
    <div class="tile__value">{{ tile.value }}</div>
  </div>
</template>

<script>
export default {
  name: "tile",
  props: ["tile"],
};
</script>

<style lang="scss" scoped>
$tilesize: 1em;

.tile {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  font-size: $tilesize;
  height: $tilesize;
  margin: 0.05em;
  padding: 8px;
  position: relative;
  user-select: none;
  width: $tilesize;

  &__letter {
    align-items: center;
    color: #222;
    display: flex;
    font-size: 0.65em;
    font-weight: 700;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    text-transform: uppercase;
    width: 100%;
  }

  &__value {
    align-items: center;
    border-radius: 50%;
    bottom: 0.05em;
    color: #222;
    display: flex;
    font-size: 0.2em;
    font-weight: 700;
    height: 1.5em;
    justify-content: center;
    pointer-events: none;
    position: absolute;
    right: 0.05em;
    width: 1.5em;
  }
}
</style>
