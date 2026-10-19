export const cardSuit = (card) => Math.floor(card / 13),
  cardRank = (card) => (card % 13) + 1,
  cardRed = (card) => [1, 2].includes(cardSuit(card));
export const cardName = (card) =>
  `${["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"][card % 13]}${["♠", "♥", "♦", "♣"][cardSuit(card)]}`;
export function dealSolitaire(deck) {
  const stock = deck.map((id) => ({ id, up: false })),
    tableau = [];
  for (let i = 0; i < 7; i++) {
    const pile = stock.splice(0, i + 1);
    pile.at(-1).up = true;
    tableau.push(pile);
  }
  return {
    stock,
    waste: [],
    tableau,
    foundations: Array.from({ length: 4 }, () => []),
    moves: 0,
  };
}
export function solitaireCards(state, source) {
  const pile =
    source.type === "tableau"
      ? state.tableau[source.pile]
      : source.type === "foundation"
        ? state.foundations[source.pile]
        : state.waste;
  return pile.slice(
    source.type === "tableau" ? source.index : Math.max(0, pile.length - 1),
  );
}
export function solitaireCanMove(state, source, target) {
  if (source.type === target.type && source.pile === target.pile) return false;
  const cards = solitaireCards(state, source);
  if (!cards.length || cards.some((c) => !c.up)) return false;
  for (let i = 1; i < cards.length; i++)
    if (
      cardRed(cards[i].id) === cardRed(cards[i - 1].id) ||
      cardRank(cards[i].id) !== cardRank(cards[i - 1].id) - 1
    )
      return false;
  const card = cards[0];
  if (target.type === "foundation") {
    if (cards.length !== 1 || cardSuit(card.id) !== target.pile) return false;
    const pile = state.foundations[target.pile];
    return cardRank(card.id) === pile.length + 1;
  }
  if (target.type === "tableau") {
    const pile = state.tableau[target.pile],
      top = pile.at(-1);
    return top
      ? top.up &&
          cardRed(top.id) !== cardRed(card.id) &&
          cardRank(card.id) === cardRank(top.id) - 1
      : cardRank(card.id) === 13;
  }
  return false;
}
export function solitaireMove(state, source, target) {
  if (!solitaireCanMove(state, source, target)) return null;
  const next = structuredClone(state),
    cards = solitaireCards(next, source),
    pile =
      source.type === "tableau"
        ? next.tableau[source.pile]
        : source.type === "foundation"
          ? next.foundations[source.pile]
          : next.waste;
  pile.splice(
    source.type === "tableau" ? source.index : pile.length - 1,
    cards.length,
  );
  if (source.type === "tableau" && pile.length) pile.at(-1).up = true;
  (target.type === "foundation"
    ? next.foundations[target.pile]
    : next.tableau[target.pile]
  ).push(...cards);
  next.moves++;
  return next;
}
export function solitaireDraw(state) {
  const next = structuredClone(state);
  if (next.stock.length) {
    const card = next.stock.pop();
    card.up = true;
    next.waste.push(card);
  } else if (next.waste.length) {
    next.stock = next.waste.reverse().map((c) => ({ ...c, up: false }));
    next.waste = [];
  } else return null;
  next.moves++;
  return next;
}
