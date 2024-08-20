<template>
  <div
    class="section"
    v-shake="{ active: currentScore, intensity: currentScore }"
  >
    <div v-if="isGameReady" class="gameboard">
      <div class="score">
        <div class="score__pill bg-white text-black">{{ score }}</div>
        <div class="flex flex-col mt-3">
          <!-- <div class="text-center text-gray-800 mb-2">Score Targets</div> -->
          <div class="flex">
            <div
              v-for="(target, i) in scoreTargets"
              :key="target"
              class="score__pill items-start text-sm mx-1"
              :class="[
                { 'bg-bronze text-black': i === 0 },
                { 'bg-silver text-black': i === 1 },
                { 'bg-gold text-black': i === 2 },
              ]"
            >
              <svg
                v-if="score >= target"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              <span v-else>{{ target }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="board" :style="boardStyles">
        <template v-for="(row, rowIndex) in board">
          <div
            v-for="(slot, colIndex) in row"
            :key="'row' + rowIndex + 'col' + colIndex"
            :ref="'row' + rowIndex + 'col' + colIndex"
            class="tile tile--slot"
            :class="[
              {
                'tile--locked': slot.letter,
                'tile--highlight':
                  highlightedBoardLetters[rowIndex][colIndex] === 1,
                'tile--bonus': isBonusTile(rowIndex, colIndex),
              },
              isBonusTile(rowIndex, colIndex)
                ? `tile--bonus-${isBonusTile(rowIndex, colIndex)}`
                : null,
            ]"
          >
            <div
              type="board"
              :row="rowIndex"
              :col="colIndex"
              class="tile-slot tile__letter"
            >
              {{ slot.letter }}
            </div>
            <div class="tile__value">{{ slot.value }}</div>
          </div>
        </template>
      </div>

      <div class="bottom-row">
        <div class="next-tile">
          <div class="next-tile__heading">Current Tile</div>
          <next-tile
            v-if="!isGameOver"
            :tile="tile"
            :isTouch="isTouch"
            @highlightBoardLetter="highlightBoardLetter"
            @highlightBoardLetterReset="highlightBoardLetterReset([5, 5])"
            @highlightBinLetter="highlightBinLetter"
            @highlightBinLetterReset="highlightBinLetterReset"
            @setBoardTile="setBoardTile"
            @setBinTile="setBinTile"
          />
        </div>

        <div class="next-tile">
          <div class="next-tile__heading">Next Tile</div>
          <preview-tile v-if="previewTile" :tile="previewTile" />
        </div>

        <div v-if="binSize > 0" class="bin">
          <div class="bin__heading">Bin {{ bin.length }}/{{ binSize }}</div>
          <div
            class="tile tile--slot"
            :class="{
              'tile--locked': false,
              'tile--highlight': isHighlightedBinLetter,
            }"
          >
            <div type="bin" class="tile-slot tile__letter"></div>
          </div>
        </div>
      </div>

      <div
        class="relative mt-12 mb-8 text-white text-center opacity-80 text-xs z-0"
      >
        Photo by
        <a
          class="underline"
          href="https://unsplash.com/@birminghammuseumstrust?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >Birmingham Museums Trust</a
        >
        on
        <a
          class="underline"
          href="https://unsplash.com/s/photos/abstract-art-painting?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
          >Unsplash</a
        >
      </div>
    </div>
    <div v-else>
      <img class="rotate" src="@/assets/loader.svg" />
    </div>
  </div>
</template>

<script>
import { gameNumber } from "../common/helpers";
import Vue from "vue";
import { mapGetters } from "vuex";
import NextTile from "@/components/NextTile";
import PreviewTile from "@/components/PreviewTile";
import StatisticsModal from "@/components/StatisticsModal";
import WordScore from "@/components/WordScore";
import wordListJSON from "../json/7L-words.json";
import _ from "lodash";
const wordlist = JSON.parse(JSON.stringify(wordListJSON));

export default {
  name: "GameBoard",

  components: { PreviewTile, NextTile, StatisticsModal, WordScore },

  data() {
    return {
      gameNumber: gameNumber(),
      isGameReady: false,

      displayResults: [],
      highlightedBoardLetters: [],
      isHighlightedBinLetter: false,

      isFindingWords: false,
      results: [],

      totalScore: 0,
      currentScore: 0,

      roundWords: [],
      allWords: [],

      wordScoreX: 0,
      wordScoreY: 0,
      wordScorePoints: 0,
      wordScoreActive: false,
    };
  },

  computed: {
    ...mapGetters({
      bin: "getBin",
      binSize: "getBinSize",
      board: "getBoard",
      boardSize: "getBoardSize",
      bonusTiles: "getBonusTiles",
      isGameOver: "getIsGameOver",
      roundIndex: "getRoundIndex",
      score: "getScore",
      scoreTargets: "getScoreTargets",
      tile: "getNextTile",
      previewTile: "getPreviewTile",
      isStatsActive: "getIsStatsActive",
    }),

    boardStyles() {
      return `
        grid-template-columns: repeat(${this.boardSize[1]}, 1fr);
        grid-template-rows: repeat(${this.boardSize[0]}, 1fr);
      `;
    },

    isTouch() {
      if (
        "ontouchstart" in window ||
        navigator.MaxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      ) {
        return true;
      }

      return false;
    },
  },

  watch: {
    isGameOver(newValue) {
      if (newValue) {
        this.$store.commit("setIsStatsActive", true);
      }
    },
  },

  mounted() {
    this.$store.dispatch("initiateBoard");
    this.highlightBoardLetterReset(this.boardSize);

    setTimeout(() => {
      this.isGameReady = true;
    }, 1000);
  },

  methods: {
    findWords() {
      this.isFindingWords = true;

      const rows = this.boardSize[0];
      const columns = this.boardSize[1];
      const minWordLength = 2;
      const maxWordLength = 5;
      const columnsToCheck = columns - minWordLength + 1;
      const rowsToCheck = rows - minWordLength + 1;

      this.totalScore = 0;

      // check each row
      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        // check each column in row
        for (let columnIndex = 0; columnIndex < columnsToCheck; columnIndex++) {
          const possibleWords = columnsToCheck - columnIndex; // how many words can fit in space starting from column index

          // check for possible words starting at column index
          for (let wordCount = 0; wordCount < possibleWords; wordCount++) {
            // word length
            const wordLength = minWordLength + wordCount;

            let possibleWord = "";
            let value = 0;
            let indices = [];
            let wordBonus = [];

            // build the word
            for (
              let letter = columnIndex;
              letter < wordLength + columnIndex;
              letter++
            ) {
              // check if letter is on a bonus tile
              let letterBonus = "";

              this.bonusTiles.forEach((bonus) => {
                if (
                  bonus.pos.length &&
                  bonus.pos[0] === rowIndex &&
                  bonus.pos[1] === letter
                ) {
                  if (bonus.type === "dl" || bonus.type === "tl") {
                    letterBonus = bonus.type;
                  }

                  if (bonus.type === "tw" || bonus.type === "dw") {
                    wordBonus.push(bonus.type);
                  }
                }
              });

              possibleWord += this.board[rowIndex][letter].letter;
              indices.push([rowIndex, letter]);

              if (letterBonus === "dl") {
                value += this.board[rowIndex][letter].value * 2;
              } else if (letterBonus === "tl") {
                value += this.board[rowIndex][letter].value * 3;
              } else {
                value += this.board[rowIndex][letter].value;
              }
            }

            // check if word is valid
            let validWord = _.find(wordlist.words, (checkWord) => {
              return (
                checkWord === possibleWord.toUpperCase() &&
                possibleWord.length <= maxWordLength
              );
            });

            if (validWord) {
              if (wordBonus.length) {
                wordBonus.forEach((bonus) => {
                  if (bonus === "tw") {
                    value = value * 3;
                  }

                  if (bonus === "dw") {
                    value = value * 2;
                  }
                });
              }

              // check word length & add bonus
              if (validWord.length === 5) {
                value = value + 10;
              }

              if (validWord.length === 6) {
                value = value + 15;
              }

              if (validWord.length === 7) {
                value = value + 20;
              }

              this.allWords.push({
                word: validWord,
                score: value,
                indices: indices,
              });

              // this.totalScore += value
            }
          }
        }
      }

      // check each column
      for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        // check each row in column
        for (let rowIndex = 0; rowIndex < rowsToCheck; rowIndex++) {
          const possibleWords = rowsToCheck - rowIndex; // how many words can fit in space starting from row index

          // check for possible words starting at row index
          for (let wordCount = 0; wordCount < possibleWords; wordCount++) {
            // word length
            const wordLength = minWordLength + wordCount;

            let possibleWord = "";
            let value = 0;
            let indices = [];
            let wordBonus = [];

            // build the word
            for (
              let letter = rowIndex;
              letter < wordLength + rowIndex;
              letter++
            ) {
              // check if letter is on a bonus tile
              let letterBonus = "";

              this.bonusTiles.forEach((bonus) => {
                if (
                  bonus.pos.length &&
                  bonus.pos[0] === letter &&
                  bonus.pos[1] === columnIndex
                ) {
                  if (bonus.type === "dl" || bonus.type === "tl") {
                    letterBonus = bonus.type;
                  }

                  if (bonus.type === "tw" || bonus.type === "dw") {
                    wordBonus.push(bonus.type);
                  }
                }
              });

              possibleWord += this.board[letter][columnIndex].letter;
              indices.push([letter, columnIndex]);

              if (letterBonus === "dl") {
                value += this.board[letter][columnIndex].value * 2;
              } else if (letterBonus === "tl") {
                value += this.board[letter][columnIndex].value * 3;
              } else {
                value += this.board[letter][columnIndex].value;
              }
            }

            let validWord = _.find(wordlist.words, (checkWord) => {
              return (
                checkWord === possibleWord.toUpperCase() &&
                possibleWord.length <= maxWordLength
              );
            });

            if (validWord) {
              if (wordBonus.length) {
                wordBonus.forEach((bonus) => {
                  if (bonus === "tw") {
                    value = value * 3;
                  }

                  if (bonus === "dw") {
                    value = value * 2;
                  }
                });
              }

              // check word length & add bonus
              if (validWord.length === 5) {
                value = value + 10;
              }

              if (validWord.length === 6) {
                value = value + 15;
              }

              if (validWord.length === 7) {
                value = value + 20;
              }

              this.allWords.push({
                word: validWord,
                score: value,
                indices: indices,
              });
              // this.totalScore += value
            }
          }
        }
      }

      this.showResults(this.allWords);
    },

    async setBoardTile(tile, hoveredIndices) {
      this.$store.commit("setIsNextTileReady", false);

      let _tile = tile;

      if (tile.letter === "") {
        let str = prompt("Enter a letter", "");
        if (str && str.length === 1 && str.match(/[a-z]/i)) {
          _tile.letter = str.toLowerCase();
        } else {
          // display error message
          this.$store.commit("setIsNextTileReady", true);
          return;
        }
      }

      // check if letter contain pipe
      if (tile.letter.includes("|")) {
        let letterOptions = tile.letter.split("|");
        let str = prompt(
          `Enter a ${letterOptions[0]} or ${letterOptions[1]}`,
          ""
        );

        if (str && str.length === 1 && str.match(/[a-z]/i)) {
          // check if string is in letter options
          if (letterOptions.includes(str.toLowerCase())) {
            _tile.letter = str.toLowerCase();
          } else {
            // display error message
            this.$store.commit("setIsNextTileReady", true);
            return;
          }
        } else {
          this.$store.commit("setIsNextTileReady", true);
          return;
        }
      }

      this.roundWords = [];
      // this.board[hoveredIndices.row][hoveredIndices.col] = _tile
      this.$store.commit("updateBoard", {
        col: hoveredIndices.col,
        row: hoveredIndices.row,
        tile: _tile,
      });

      // find all words on row that includes col
      const rows = this.boardSize[0];
      const columns = this.boardSize[1];
      const minWordLength = 2;
      const maxWordLength = 5;
      const columnsToCheck = columns - minWordLength + 1;
      const rowsToCheck = rows - minWordLength + 1;
      const tileRowIndex = parseInt(hoveredIndices.row);
      const tileColIndex = parseInt(hoveredIndices.col);

      // check each column in row
      for (let columnIndex = 0; columnIndex < columnsToCheck; columnIndex++) {
        const possibleWords = columnsToCheck - columnIndex; // how many words can fit in space starting from column index

        // check for possible words starting at column index
        for (let wordCount = 0; wordCount < possibleWords; wordCount++) {
          // word length
          const wordLength = minWordLength + wordCount;

          let possibleWord = "";
          let value = 0;
          let indices = [];
          let wordBonus = [];

          // build the word
          for (
            let letter = columnIndex;
            letter < wordLength + columnIndex;
            letter++
          ) {
            // check if letter is on a bonus tile
            let letterBonus = "";

            this.bonusTiles.forEach((bonus) => {
              if (
                bonus.pos.length &&
                bonus.pos[0] === tileRowIndex &&
                bonus.pos[1] === letter
              ) {
                if (bonus.type === "dl" || bonus.type === "tl") {
                  letterBonus = bonus.type;
                }

                if (bonus.type === "tw" || bonus.type === "dw") {
                  wordBonus.push(bonus.type);
                }
              }
            });

            possibleWord += this.board[tileRowIndex][letter].letter;
            indices.push([tileRowIndex, letter]);

            if (letterBonus === "dl") {
              value += this.board[tileRowIndex][letter].value * 2;
            } else if (letterBonus === "tl") {
              value += this.board[tileRowIndex][letter].value * 3;
            } else {
              value += this.board[tileRowIndex][letter].value;
            }
          }

          // check if word is valid
          let validWord = _.find(wordlist.words, (checkWord) => {
            return (
              checkWord === possibleWord.toUpperCase() &&
              possibleWord.length <= maxWordLength
            );
          });

          if (validWord) {
            if (wordBonus.length) {
              wordBonus.forEach((bonus) => {
                if (bonus === "tw") {
                  value = value * 3;
                }

                if (bonus === "dw") {
                  value = value * 2;
                }
              });
            }

            // check word length & add bonus
            if (validWord.length === 5) {
              value = value + 10;
            }

            if (validWord.length === 6) {
              value = value + 15;
            }

            if (validWord.length === 7) {
              value = value + 20;
            }

            // only add words that include the tile
            let isUsingTile = false;

            indices.forEach((index) => {
              if (index[1] === tileColIndex) {
                isUsingTile = true;
              }
            });

            if (isUsingTile) {
              this.roundWords.push({
                word: validWord,
                score: value,
                indices: indices,
              });

              // this.$store.commit('updateScore', value)

              // this.totalScore += value
            }
          }
        }
      }

      // check each row in column
      for (let rowIndex = 0; rowIndex < rowsToCheck; rowIndex++) {
        const possibleWords = rowsToCheck - rowIndex; // how many words can fit in space starting from row index

        // check for possible words starting at row index
        for (let wordCount = 0; wordCount < possibleWords; wordCount++) {
          // word length
          const wordLength = minWordLength + wordCount;

          let possibleWord = "";
          let value = 0;
          let indices = [];
          let wordBonus = [];

          // build the word
          for (
            let letter = rowIndex;
            letter < wordLength + rowIndex;
            letter++
          ) {
            // check if letter is on a bonus tile
            let letterBonus = "";

            this.bonusTiles.forEach((bonus) => {
              if (
                bonus.pos.length &&
                bonus.pos[0] === letter &&
                bonus.pos[1] === tileColIndex
              ) {
                if (bonus.type === "dl" || bonus.type === "tl") {
                  letterBonus = bonus.type;
                }

                if (bonus.type === "tw" || bonus.type === "dw") {
                  wordBonus.push(bonus.type);
                }
              }
            });

            possibleWord += this.board[letter][tileColIndex].letter;
            indices.push([letter, tileColIndex]);

            if (letterBonus === "dl") {
              value += this.board[letter][tileColIndex].value * 2;
            } else if (letterBonus === "tl") {
              value += this.board[letter][tileColIndex].value * 3;
            } else {
              value += this.board[letter][tileColIndex].value;
            }
          }

          let validWord = _.find(wordlist.words, (checkWord) => {
            return (
              checkWord === possibleWord.toUpperCase() &&
              possibleWord.length <= maxWordLength
            );
          });

          if (validWord) {
            if (wordBonus.length) {
              wordBonus.forEach((bonus) => {
                if (bonus === "tw") {
                  value = value * 3;
                }

                if (bonus === "dw") {
                  value = value * 2;
                }
              });
            }
            if (validWord.length === 5) {
              value = value + 10;
            }

            if (validWord.length === 6) {
              value = value + 15;
            }

            if (validWord.length === 7) {
              value = value + 20;
            }

            // only add words that include the tile
            let isUsingTile = false;

            indices.forEach((index) => {
              if (index[0] === tileRowIndex) {
                isUsingTile = true;
              }
            });

            if (isUsingTile) {
              this.roundWords.push({
                word: validWord,
                score: value,
                indices: indices,
              });

              // this.$store.commit('updateScore', value)
              // this.totalScore += value
            }
          }
        }
      }

      if (this.roundWords.length) {
        await this.showResults(this.roundWords);
      }

      this.$store.commit("updateRound");
      this.$store.commit("setIsNextTileReady", true);
    },

    setBinTile(tile) {
      if (this.bin.length < this.binSize) {
        this.$store.commit("addToBin", tile);
        this.$store.commit("updateRound");
      }
    },

    highlightBoardLetter(rowIndex, colIndex) {
      this.highlightBoardLetterReset(this.boardSize);
      this.highlightedBoardLetters[rowIndex][colIndex] = 1;
    },

    highlightBinLetter() {
      this.isHighlightedBinLetter = true;
    },

    highlightLetter(rowH, colH) {
      this.highlightedBoardLetters.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (rowIndex === rowH && colIndex === colH) {
            this.highlightedBoardLetters[rowIndex][colIndex] = 1;
          }
        });
      });
    },

    highlightBoardLetterReset(boardSize) {
      let highlightedBoardLetters = _.range(boardSize[0]).map(() => {
        return _.range(boardSize[1]).map(() => {
          return 0;
        });
      });

      this.highlightedBoardLetters = highlightedBoardLetters;
    },

    highlightBinLetterReset() {
      this.isHighlightedBinLetter = false;
    },

    setTileHighlightQuery() {
      const query = this.$route.query.w;

      if (query) {
        const letters = query.split(",");
        letters.forEach((letter) => {
          this.highlightedBoardLetters[letter[0]][letter[1]] = 1;
        });
      }
    },

    isBonusTile(row, col) {
      let type = "";

      this.bonusTiles.forEach((bonus) => {
        if (bonus.pos && bonus.pos[0] === row && bonus.pos[1] === col) {
          type = bonus.type;
        }
      });

      return type;
    },

    async showResults(words) {
      await new Promise((resolve, reject) => {
        words.forEach((word, index) => {
          setTimeout(() => {
            this.displayResults.push(word);
            this.highlightBoardLetterReset([5, 5]);
            this.totalScore += word.score;

            let topCentre = 0;
            let leftCentre = 0;

            let firstTopCentre = 0;
            let firstLeftCentre = 0;
            let lastTopCentre = 0;
            let lastLeftCentre = 0;

            word.indices.forEach((letter, i) => {
              this.highlightLetter(letter[0], letter[1]);

              if (i === 0) {
                const tile = this.$refs[`row${letter[0]}col${letter[1]}`][0];

                // get tile position from the top on the document
                firstTopCentre = tile.offsetTop;

                // get centre of tile
                const top = tile.getBoundingClientRect().top + window.scrollY;
                const left = tile.getBoundingClientRect().left;
                const height = tile.getBoundingClientRect().height;
                const width = tile.getBoundingClientRect().width;

                firstTopCentre = top + height / 2;
                firstLeftCentre = left + width / 2;
              }

              if (i === word.indices.length - 1) {
                const tile = this.$refs[`row${letter[0]}col${letter[1]}`][0];

                // get centre of tile
                const top = tile.getBoundingClientRect().top + window.scrollY;
                const left = tile.getBoundingClientRect().left;
                const height = tile.getBoundingClientRect().height;
                const width = tile.getBoundingClientRect().width;

                lastTopCentre = top + height / 2;
                lastLeftCentre = left + width / 2;
              }
            });

            topCentre = (firstTopCentre + lastTopCentre) / 2;
            leftCentre = (firstLeftCentre + lastLeftCentre) / 2;

            this.showPoints(leftCentre, topCentre, word.score);

            this.$store.commit("updateScore", word.score);

            this.currentScore = word.score;
          }, 500 + 1000 * index);

          setTimeout(() => {
            this.highlightBoardLetterReset([5, 5]);
            this.isScoringOver = true;
            this.currentScore = 0;
            resolve();
          }, 500 + 1000 * words.length);
        });
      });
    },

    showPoints(x, y, score) {
      var ComponentClass = Vue.extend(WordScore);
      var instance = new ComponentClass({
        propsData: {
          x: x,
          y: y,
          score: score,
        },
      });

      instance.$mount();
      document.querySelector("#app").appendChild(instance.$el);

      setTimeout(() => {
        instance.remove();
      }, 3000);
    },
  },
};
</script>

<style lang="scss" scoped>
$tilesize: 5em;
$tilegap: 0.5em;
$tilecount: 5;
// $boardwidth: ($tilesize * $tilecount) + ($tilegap * $tilecount);

.section {
  align-items: center;
  display: flex;
  font-size: 0.75em;
  min-height: 100vh;
  justify-content: center;

  @media screen and (min-width: 480px) {
    font-size: 0.85em;
  }

  @media screen and (min-width: 768px) {
    font-size: 1em;
  }
}

.gameboard {
  padding: 100px 0 60px;
}

.game-details {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  font-size: 1.25em;
  justify-content: space-between;
  margin: 0 0 0.6em;
  width: 100%;

  .date {
    color: #fff;
    font-size: 0.6em;
    margin: 6px 0 0;
  }
}

.bin {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 50%;

  &__heading {
    background: #fff;
    border-radius: 0.3em;
    color: #222;
    font-size: 0.75em;
    font-weight: 700;
    margin: 0 0 5px;
    padding: 0.5em 1.3em;
    text-transform: uppercase;
    width: max-content;
  }

  .tile {
    background-image: url(../assets/trash.svg);
    background-position: 50%;
    background-repeat: no-repeat;

    &--locked {
      background-image: none;
    }
  }
}

.next-tile {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 50%;

  &__heading {
    background: #fff;
    border-radius: 0.3em;
    color: #222;
    font-size: 0.75em;
    font-weight: 700;
    margin: 0 0 5px;
    padding: 0.5em 1.3em;
    text-transform: uppercase;
    width: max-content;
  }
}

.board {
  display: grid;
  grid-column-gap: $tilegap;
  grid-row-gap: $tilegap;
  position: relative;

  &__find-words-btn {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }

  .tile--bonus::before {
    align-items: center;
    border-radius: 50%;
    box-shadow: rgba(#000, 0.6) 0.1em 0.15em 0.15em;
    color: #fff;
    display: flex;
    font-size: 0.75em;
    justify-content: center;
    height: 2em;
    left: 0.25em;
    position: absolute;
    top: 0.25em;
    width: 2em;
  }

  .tile--bonus-dw::before {
    background: #10be4a;
    content: "DW";
  }

  .tile--bonus-tw::before {
    background: #ffac11;
    content: "TW";
  }

  .tile--bonus-tl::before {
    background: #a011ff;
    content: "TL";
  }

  .tile--bonus-dl::before {
    background: #1178ff;
    content: "DL";
  }
}

.bottom-row {
  display: flex;
  margin: 15px 0 0;
  position: relative;
  text-align: center;
  z-index: 10;
}

.score {
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 1.3em;
  margin: 0 0 0.75em;

  &__pill {
    border-radius: 20px;
    padding: 0.1em 0.8em 0.2em;
    user-select: none;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.8);
  }

  &__help {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #ffffff;
    border-radius: 20px;
    color: #ffffff;
    font-size: 0.8em;
    padding: 0.35em 0.8em 0.4em;
    text-transform: uppercase;
  }
}

.tile {
  background: rgba(255, 255, 255, 1);
  border-radius: 0.25em;
  // box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
  box-sizing: border-box;
  cursor: grab;
  height: $tilesize;
  position: relative;
  width: $tilesize;

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

  &__value {
    bottom: 0.5em;
    color: #222;
    font-size: 0.9em;
    font-weight: 700;
    pointer-events: none;
    position: absolute;
    right: 0.5em;
  }

  &--highlight {
    background: rgba(44, 122, 239, 0.9);

    .tile__letter,
    .tile__value {
      color: #fff;
    }
  }

  &--slot {
    cursor: auto;
    user-select: none;
  }

  &--locked {
    pointer-events: none;
  }

  &--hover {
    background: #2962ff;
  }
}

.btn {
  appearance: none;
  border: none;
  border-radius: 0.25em;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 6px 16px;
  text-transform: uppercase;

  &--primary {
    background: rgba(41, 98, 255, 1);
    transition: background 200ms ease-in-out;

    &:hover {
      background: rgb(36, 86, 223);
    }
  }
}

.result-total {
  border-top: 1px solid #fff;
  color: #fff;
  letter-spacing: 0.075em;
  padding: 0 20px;
  text-transform: uppercase;
}

.rotate {
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
