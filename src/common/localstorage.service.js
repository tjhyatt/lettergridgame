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
  return JSON.parse(window.localStorage.getItem("gamehistory"));
};

export const createHistory = (data) => {
  window.localStorage.setItem("gamehistory", data);
};

export const addHistory = (game) => {
  const history = JSON.parse(window.localStorage.getItem("gamehistory"));
  const foundGame = history.games.some((game) => game.id === game.id);
  
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

    window.localStorage.setItem("gamehistory", JSON.stringify(newHistory));
  }
};
