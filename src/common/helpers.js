import { DateTime } from "luxon";

export const isGameOver = (board) => {
  let isGameOver = true;

  if (board.length === 0) {
    return false;
  }

  board.forEach((row) => {
    row.forEach((col) => {
      if (Object.keys(col).length === 0) {
        isGameOver = false;
      }
    });
  });

  return isGameOver;
};

export const gameNumber = () => {
  const epoch = DateTime.local(2022, 9, 12);
  const currentDate = DateTime.now();
  return (Math.floor(currentDate.diff(epoch, "days").days) + 1).toString();
};
