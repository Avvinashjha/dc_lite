export const ludoPath = [
  [6, 1],
  [6, 2],
  [6, 3],
  [6, 4],
  [6, 5],
  [5, 6],
  [4, 6],
  [3, 6],
  [2, 6],
  [1, 6],
  [0, 6],
  [0, 7],
  [0, 8],
  [1, 8],
  [2, 8],
  [3, 8],
  [4, 8],
  [5, 8],
  [6, 9],
  [6, 10],
  [6, 11],
  [6, 12],
  [6, 13],
  [6, 14],
  [7, 14],
  [8, 14],
  [8, 13],
  [8, 12],
  [8, 11],
  [8, 10],
  [8, 9],
  [9, 8],
  [10, 8],
  [11, 8],
  [12, 8],
  [13, 8],
  [14, 8],
  [14, 7],
  [14, 6],
  [13, 6],
  [12, 6],
  [11, 6],
  [10, 6],
  [9, 6],
  [8, 5],
  [8, 4],
  [8, 3],
  [8, 2],
  [8, 1],
  [8, 0],
  [7, 0],
  [6, 0],
];
export const ludoEntry = [0, 13, 26, 39],
  ludoSafe = [0, 8, 13, 21, 26, 34, 39, 47];
export const ludoHome = [
  [
    [7, 1],
    [7, 2],
    [7, 3],
    [7, 4],
    [7, 5],
    [7, 6],
  ],
  [
    [1, 7],
    [2, 7],
    [3, 7],
    [4, 7],
    [5, 7],
    [6, 7],
  ],
  [
    [7, 13],
    [7, 12],
    [7, 11],
    [7, 10],
    [7, 9],
    [7, 8],
  ],
  [
    [13, 7],
    [12, 7],
    [11, 7],
    [10, 7],
    [9, 7],
    [8, 7],
  ],
];
export const ludoYard = [
  [
    [2, 2],
    [2, 4],
    [4, 2],
    [4, 4],
  ],
  [
    [2, 10],
    [2, 12],
    [4, 10],
    [4, 12],
  ],
  [
    [10, 10],
    [10, 12],
    [12, 10],
    [12, 12],
  ],
  [
    [10, 2],
    [10, 4],
    [12, 2],
    [12, 4],
  ],
];
export function ludoPosition(player, token, progress) {
  if (progress < 0) return ludoYard[player][token];
  if (progress >= 56) return [7, 7];
  if (progress >= 51) return ludoHome[player][progress - 51];
  return ludoPath[(progress + ludoEntry[player]) % 52];
}
export const ludoCanMove = (progress, roll) =>
  progress === -1 ? roll === 6 : progress < 56 && progress + roll <= 56;
export function ludoMove(players, player, token, roll) {
  if (!ludoCanMove(players[player][token], roll)) return null;
  const next = players.map((a) => [...a]),
    from = next[player][token],
    to = from < 0 ? 0 : from + roll;
  next[player][token] = to;
  const captured = [];
  if (to < 51) {
    const absolute = (to + ludoEntry[player]) % 52;
    if (!ludoSafe.includes(absolute))
      for (let p = 0; p < 4; p++)
        if (p !== player)
          for (let t = 0; t < 4; t++) {
            const pos = next[p][t];
            if (
              pos >= 0 &&
              pos < 51 &&
              (pos + ludoEntry[p]) % 52 === absolute
            ) {
              next[p][t] = -1;
              captured.push([p, t]);
            }
          }
  }
  return {
    players: next,
    from,
    to,
    captured,
    won: next[player].every((n) => n === 56),
  };
}
