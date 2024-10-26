<template>
  <div class="table-wrapper">
    <table class="table">
      <tr
        v-for="(row, index) in rows"
        :key="row._id"
        class="table-row"
        :class="'table-row--rank-' + (index + 1)"
        @click="viewGame(row)"
      >
        <td>
          <div class="table-row__rank">
            {{ index + 1
            }}{{
              index === 0
                ? "st"
                : index === 1
                  ? "nd"
                  : index === 2
                    ? "rd"
                    : "th"
            }}
          </div>
        </td>
        <td style="width: 100%">
          <div class="table-row__word">
            {{ row.word }}
          </div>
        </td>
        <td style="width: 135px">
          <div class="table-row__value">
            {{ row.value }}
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "VHighscores",

  props: ["rows"],

  computed: {
    env() {
      return process.env;
    },
  },

  methods: {
    viewGame(word) {
      let posArray = word.pos;

      let query = "?w=";
      posArray.forEach((tilePos) => {
        query += tilePos[0].toString() + tilePos[1].toString() + ",";
      });

      this.$router.push(`/game/${word.gameId}/${word.boardId}/${query}`);
    },
  },
};
</script>

<style scoped lang="scss">
.table-wrapper {
  color: #fff;
  display: flex;
  flex-direction: column;
  margin: auto;
}

.table {
  text-align: left;
  width: 100%;

  .table-row {
    align-items: center;
    background: rgb(250, 250, 250);
    border-radius: 3px;
    color: #222;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    margin: 2px 0;
    padding: 6px 0px;
    transition: all 200ms ease-in-out;

    &:hover {
      background: rgb(231, 231, 231);
    }

    &--rank-1 {
      font-size: 1.6em;
    }

    &--rank-2 {
      font-size: 1.45em;
    }

    &--rank-3 {
      font-size: 1.25em;
    }

    &__rank {
      align-items: center;
      border-radius: 50%;
      color: #222;
      display: flex;
      flex-shrink: 0;
      font-size: 0.9em;
      height: 25px;
      justify-content: center;
      margin: 0 12px;
      width: 25px;
    }

    // &__word {
    //   margin: 0 12px;
    // }

    &__value {
      font-size: 1.2em;
      margin: auto 12px auto auto;
      text-align: center;
      width: 50px;
    }

    &__avatar {
      background: pink;
      border-radius: 50%;
      flex-shrink: 0;
      height: 1em;
      margin: 0 4px 0 0;
      overflow: hidden;
      width: 1em;

      img {
        height: 100%;
        object-fit: cover;
        width: 100%;
      }
    }

    &__username {
      line-height: normal;
      margin: 0 12px 0.2em 0;
      max-width: 180px;
      word-wrap: break-word;
    }

    &__date {
      font-size: 12px;
      margin: auto;
      opacity: 0.8;
      text-align: center;
      width: 35px;
    }
  }
}

.loader {
  display: flex;
  justify-content: center;
}

/deep/ .rotate {
  animation: rotate linear infinite 3s;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
