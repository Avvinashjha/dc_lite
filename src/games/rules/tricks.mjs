export const suit = (card) => Math.floor(card / 13);
export const rank = (card) => (card % 13 === 0 ? 14 : (card % 13) + 1);
export const trickCardName = (card) =>
  `${["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"][card % 13]}${["♠", "♥", "♦", "♣"][suit(card)]}`;
export const heartsPoints = (card) =>
  suit(card) === 1 ? 1 : suit(card) === 0 && rank(card) === 12 ? 13 : 0;
export function trickWinner(trick, spades = false) {
  if (!trick.length) return null;
  let winner = trick[0];
  for (const play of trick.slice(1)) {
    const a = suit(play.card),
      b = suit(winner.card);
    if (
      (spades && a === 0 && b !== 0) ||
      (a === b && rank(play.card) > rank(winner.card))
    )
      winner = play;
  }
  return winner.player;
}
export function legalTrickCards(
  hand,
  trick,
  { game, broken = false, first = false } = {},
) {
  if (trick.length) {
    const follow = hand.filter((c) => suit(c) === suit(trick[0].card));
    let available = follow.length ? follow : [...hand];
    if (game === "hearts" && first) {
      const safe = available.filter((c) => heartsPoints(c) === 0);
      if (safe.length) available = safe;
    }
    return available;
  }
  if (game === "hearts" && first && hand.includes(40)) return [40];
  const restricted = game === "hearts" ? 1 : 0;
  if (!broken && hand.some((c) => suit(c) !== restricted))
    return hand.filter((c) => suit(c) !== restricted);
  return [...hand];
}
export function scoreHearts(round) {
  const shooter = round.indexOf(26);
  return shooter >= 0
    ? round.map((_, i) => (i === shooter ? 0 : 26))
    : [...round];
}
export function scoreSpades(
  bids,
  tricks,
  oldScores = [0, 0],
  oldBags = [0, 0],
) {
  const scores = [...oldScores],
    bags = [...oldBags];
  for (let team = 0; team < 2; team++) {
    const players = [team, team + 2],
      contract = players.reduce((s, p) => s + bids[p], 0),
      taken = players
        .filter((p) => bids[p] > 0)
        .reduce((s, p) => s + tricks[p], 0),
      total = players.reduce((s, p) => s + tricks[p], 0);
    for (const p of players)
      if (bids[p] === 0) scores[team] += tricks[p] === 0 ? 100 : -100;
    if (taken >= contract) {
      const over = Math.max(0, total - contract);
      scores[team] += contract * 10 + over;
      bags[team] += over;
      while (bags[team] >= 10) {
        bags[team] -= 10;
        scores[team] -= 100;
      }
    } else scores[team] -= contract * 10;
  }
  return { scores, bags };
}
