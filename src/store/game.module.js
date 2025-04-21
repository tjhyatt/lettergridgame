import Vue from "vue";
import Vuex from "vuex";
import gen from "random-seed";
import { isGameOver, gameNumber } from "../common/helpers";
import {
  getLocalSeed,
  setLocalSeed,
  getLocalState,
  setLocalState,
  addHistory,
} from "../common/localstorage.service";

const currentSeed = gameNumber();
const random = gen.create(currentSeed);

Vue.use(Vuex);

const state = {
  bin: [],
  binSize: 5,
  board: [],
  boardSize: [5, 5],
  bonusTiles: [],
  holdTile: {},
  isGameOver: false,
  isNextTileReady: true,
  roundIndex: 0,
  score: 0,
  scoreTargets: [],
  tiles: [],
};

const getters = {
  getBin(state) {
    return state.bin;
  },

  getBinSize(state) {
    return state.binSize;
  },

  getBoard(state) {
    return state.board;
  },

  getBoardSize(state) {
    return state.boardSize;
  },

  getBonusTiles(state) {
    return state.bonusTiles;
  },

  getHoldTile(state) {
    return state.holdTile;
  },

  getIsGameOver(state) {
    return state.isGameOver;
  },

  getRoundIndex(state) {
    return state.roundIndex;
  },

  getNextTile(state) {
    return state.isNextTileReady ? state.tiles[state.roundIndex] : null;
  },

  getPreviewTile(state) {
    return state.roundIndex + 1 < state.tiles.length && state.isNextTileReady
      ? state.tiles[state.roundIndex + 1]
      : null;
  },

  getScore(state) {
    return state.score;
  },

  getScoreTargets(state) {
    return state.scoreTargets;
  },
};

const mutations = {
  addToBin: (state, payload) => {
    state.bin.push(payload);
  },

  setBin: (state, payload) => {
    state.bin = payload;
  },

  setBinSize: (state, payload) => {
    state.binSize = payload;
  },

  setBoard: (state, payload) => {
    state.board = payload;
    state.isGameOver = isGameOver(state.board);

    setLocalState({
      bin: state.bin,
      binSize: state.binSize,
      board: state.board,
      bonusTiles: state.bonusTiles,
      holdTile: state.holdTile,
      isGameOver: state.isGameOver,
      roundIndex: state.roundIndex,
      score: state.score,
    });
  },

  setBoardSize: (state, payload) => {
    state.boardSize = payload;
  },

  setBonusTiles: (state, payload) => {
    state.bonusTiles = payload;
  },

  setHoldTile: (state, payload) => {
    state.holdTile = payload;
  },

  setIsGameOver: (state, payload) => {
    state.isGameOver = payload;
  },

  setRoundIndex: (state, payload) => {
    state.roundIndex = payload;
  },

  setScore: (state, payload) => {
    state.score = payload;
    state.isGameOver = isGameOver(state.board);

    setLocalState({
      bin: state.bin,
      binSize: state.binSize,
      board: state.board,
      bonusTiles: state.bonusTiles,
      holdTile: state.holdTile,
      isGameOver: state.isGameOver,
      roundIndex: state.roundIndex,
      score: state.score,
    });
  },

  setScoreTargets: (state, payload) => {
    state.scoreTargets = payload;
  },

  setTiles: (state, payload) => {
    state.tiles = payload;
  },

  setIsNextTileReady: (state, payload) => {
    state.isNextTileReady = payload;
  },

  updateBoard: (state, payload) => {
    const col = payload.col;
    const row = payload.row;
    const tile = payload.tile;

    state.board[row][col] = tile;
  },

  updateRound: (state, type) => {
    if (type !== "hold") {
      state.roundIndex++;
    }

    state.isGameOver = isGameOver(state.board);

    setLocalState({
      bin: state.bin,
      binSize: state.binSize,
      board: state.board,
      bonusTiles: state.bonusTiles,
      holdTile: state.holdTile,
      isGameOver: state.isGameOver,
      roundIndex: state.roundIndex,
      score: state.score,
    });

    if (state.isGameOver) {
      let award = 0;
      if (state.score >= state.scoreTargets[0]) {
        award = 1;
      }

      if (state.score >= state.scoreTargets[1]) {
        award = 2;
      }

      if (state.score >= state.scoreTargets[2]) {
        award = 3;
      }

      addHistory({
        n: currentSeed,
        s: state.score,
        a: award,
      });
    }
  },

  updateScore: (state, wordScore) => {
    state.score += wordScore;
  },
};

const actions = {
  generateScoreTargets: async ({ commit, dispatch }, payload) => {
    const boardSize = payload.rows * payload.columns;
    let boardSizeMultiplier = 1.1;

    switch (boardSize) {
      case 16:
        boardSizeMultiplier = 1.2;
        break;

      case 20:
        boardSizeMultiplier = 1.75;
        break;

      case 25:
        boardSizeMultiplier = 2.2;
        break;

      default:
        break;
    }

    const tileScore = payload.tiles.reduce((a, b) => ({
      value: a.value + b.value,
    }));
    let bonusMultiplier = 0;

    payload.bonusTiles.forEach((bonus) => {
      if (bonus.type === "dw") {
        bonusMultiplier += 10;
      }

      if (bonus.type === "dl") {
        bonusMultiplier += 5;
      }

      if (bonus.type === "tw") {
        bonusMultiplier += 15;
      }

      if (bonus.type === "tl") {
        bonusMultiplier += 10;
      }
    });

    bonusMultiplier *= boardSizeMultiplier;

    const bronze = Math.floor(
      (tileScore.value + bonusMultiplier) * boardSizeMultiplier
    );
    const silver = Math.floor(
      (tileScore.value + bonusMultiplier) * boardSizeMultiplier * 1.5
    );
    const gold = Math.floor(
      (tileScore.value + bonusMultiplier) * boardSizeMultiplier * 2
    );

    commit("setScoreTargets", [bronze, silver, gold]);
  },

  generateTiles: async ({ dispatch }, amount) => {
    let commonBucket = [
      "a",
      "a",
      "a",
      "a",
      "e",
      "e",
      "e",
      "e",
      "i",
      "i",
      "o",
      "o",
      "o",
      "s",
      "s",
      "s",
      "t",
      "t",
      "t",
      "u",
    ];
    let semiCommonBucket = [
      "b",
      "c",
      "d",
      "d",
      "g",
      "h",
      "l",
      "m",
      "n",
      "n",
      "p",
      "r",
      "r",
      "u",
      "y",
      "",
    ];
    let uncommonBucket = ["f", "v", "k", "w", ""];
    let rareBucket = ["q|j", "x|z", ""];
    const reserveBucket = [
      "a",
      "b",
      "c",
      "d",
      "d",
      "e",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    let generatedTiles = [];

    for (let i = 0; i < amount; i++) {
      let bucketNumber = random.intBetween(1, 100);
      let letter = "";

      if (bucketNumber >= 45) {
        if (commonBucket.length > 0) {
          const randomIndex = random.intBetween(0, commonBucket.length - 1);
          letter = commonBucket[randomIndex];

          commonBucket.splice(randomIndex, 1);
        } else {
          const randomIndex = random.intBetween(0, reserveBucket.length - 1);
          letter = reserveBucket[randomIndex];
        }
      }

      if (bucketNumber >= 15 && bucketNumber < 45) {
        if (semiCommonBucket.length > 0) {
          const randomIndex = random.intBetween(0, semiCommonBucket.length - 1);
          letter = semiCommonBucket[randomIndex];

          semiCommonBucket.splice(randomIndex, 1);
        } else {
          const randomIndex = random.intBetween(0, reserveBucket.length - 1);
          letter = reserveBucket[randomIndex];
        }
      }

      if (bucketNumber >= 6 && bucketNumber < 15) {
        if (uncommonBucket.length > 0) {
          const randomIndex = random.intBetween(0, uncommonBucket.length - 1);
          letter = uncommonBucket[randomIndex];

          uncommonBucket.splice(randomIndex, 1);
        } else {
          const randomIndex = random.intBetween(0, reserveBucket.length - 1);
          letter = reserveBucket[randomIndex];
        }
      }

      if (bucketNumber >= 0 && bucketNumber < 6) {
        if (rareBucket.length > 0) {
          const randomIndex = random.intBetween(0, rareBucket.length - 1);
          letter = rareBucket[randomIndex];

          rareBucket.splice(randomIndex, 1);
        } else {
          const randomIndex = random.intBetween(0, reserveBucket.length - 1);
          letter = reserveBucket[randomIndex];
        }
      }

      const tile = await dispatch("makeTile", letter);
      generatedTiles.push(tile);
    }

    return generatedTiles;
  },

  generateBonuses: ({ commit }, { rows, columns }) => {
    let bonusSpaces = [];
    for (let indexRow = 0; indexRow < rows; indexRow++) {
      for (let indexCol = 0; indexCol < columns; indexCol++) {
        bonusSpaces.push([indexRow, indexCol]);
      }
    }

    const bonusTypes = ["dw", "tw", "dl", "tl"];
    let randomBonusTypes = [];

    randomBonusTypes.push(bonusTypes[random.intBetween(0, 3)]);
    randomBonusTypes.push(bonusTypes[random.intBetween(0, 3)]);
    randomBonusTypes.push(bonusTypes[random.intBetween(0, 3)]);
    randomBonusTypes.push(bonusTypes[random.intBetween(0, 3)]);

    const uniqRandomBonusTypes = Array.from(new Set(randomBonusTypes));

    let bonusTiles = uniqRandomBonusTypes.map((type) => {
      let bonusSpacesIndex = random.intBetween(0, bonusSpaces.length - 1);

      let bonus = {
        pos: bonusSpaces[bonusSpacesIndex],
        type: type,
      };

      bonusSpaces.splice(bonusSpacesIndex, 1);
      return bonus;
    });

    commit("setBonusTiles", bonusTiles);
    return bonusTiles;
  },

  makeTile: async ({ dispatch }, letter) => {
    let value = 1;

    switch (letter) {
      case "a":
      case "e":
      case "i":
      case "o":
      case "u":
        value = 1;
        break;

      case "d":
      case "l":
      case "n":
      case "r":
      case "s":
      case "t":
        value = random.intBetween(1, 2);
        break;

      case "b":
      case "c":
      case "f":
      case "g":
      case "h":
      case "m":
      case "p":
      case "y":
      case "":
        value = random.intBetween(2, 4);
        break;

      case "v":
      case "k":
      case "w":
        value = random.intBetween(5, 6);
        break;

      case "j":
      case "q":
      case "x":
      case "z":
      case "q|j":
      case "x|z":
        value = random.intBetween(7, 8);
        break;

      default:
        value = 1;
        break;
    }

    return { letter: letter, value: value };
  },

  initiateBoard: async ({ commit, dispatch }, payload) => {
    const localSeed = getLocalSeed();
    const localState = getLocalState();
    const columns = random.intBetween(4, 5);
    const rows = random.intBetween(3, 5);
    const binSize = random.intBetween(3, 8);
    const tileAmount = columns * rows + binSize;

    commit("setBoardSize", [rows, columns]);

    const tiles = await dispatch("generateTiles", tileAmount);
    commit("setTiles", tiles);

    let board = [];
    for (let indexRow = 0; indexRow < rows; indexRow++) {
      board[indexRow] = [];

      for (let indexCol = 0; indexCol < columns; indexCol++) {
        board[indexRow][indexCol] = {};
      }
    }

    const bonusTiles = await dispatch("generateBonuses", {
      rows: rows,
      columns: columns,
    });
    dispatch("generateScoreTargets", {
      tiles: tiles,
      bonusTiles: bonusTiles,
      rows: rows,
      columns: columns,
    });

    if (currentSeed === localSeed) {
      commit("setBin", localState.bin);
      commit("setBinSize", localState.binSize);
      commit("setBoard", localState.board);
      commit("setHoldTile", localState.holdTile);
      commit("setRoundIndex", localState.roundIndex);
      commit("setScore", localState.score);
    } else {
      commit("setBinSize", binSize);
      commit("setBoard", board);
    }

    setLocalSeed(currentSeed);
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
