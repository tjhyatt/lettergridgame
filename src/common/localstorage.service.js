export const getLocalSeed = () => {
  return window.localStorage.getItem("gamenumber");
};

export const setLocalSeed = (gamenumber) => {
  return window.localStorage.setItem("gamenumber", gamenumber);
};

export const getLocalState = () => {
  const state = window.localStorage.getItem("gamestate");

  if (state) {
    return JSON.parse(state);
  }

  return {};
};

export const setLocalState = (state) => {
  return window.localStorage.setItem("gamestate", JSON.stringify(state));
};

export const resetLocalState = () => {
  window.localStorage.removeItem("gamestate");
  window.localStorage.removeItem("gamenumber");
};

export const getHistory = () => {
  const history = JSON.parse(window.localStorage.getItem("gamehistory"));
  const refactoredHistory = JSON.parse(window.localStorage.getItem("h"));

  if (history && !refactoredHistory) {
    refactorHistory(history);
  }

  return refactoredHistory;
};

export const refactorHistory = (history) => {
  const refactored = history.games.map((game) => {
    let award = 0;

    switch (game.award) {
      case "Gold":
        award = 3;
        break;

      case "Silver":
        award = 2;
        break;

      case "Bronze":
        award = 1;
        break;

      case "No award":
        award = 0;
        break;
    }

    return {
      n: game.gameNumber,
      a: award,
      s: game.score,
    };
  });

  history.games = refactored;

  createHistory(JSON.stringify(history));
};

export const createHistory = (data) => {
  window.localStorage.setItem("h", data);
};

export const addHistory = (game) => {
  const history = JSON.parse(window.localStorage.getItem("h"));
  let foundGame = null;

  if (history) {
    foundGame = history.games.find((hist) => hist.n === game.n);
  }

  if (!foundGame) {
    let newHistory = {};

    if (history) {
      newHistory = history;
      newHistory.games.push(game);
    } else {
      newHistory = {
        games: [game],
      };
    }

    window.localStorage.setItem("h", JSON.stringify(newHistory));
  }
};

export const clearData = () => {
  window.localStorage.removeItem("gamestate");
  window.localStorage.removeItem("gamenumber");
  window.localStorage.removeItem("h");
};
