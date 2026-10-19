export function farkleScore(dice) {
  if (!dice.length || dice.some((n) => n < 1 || n > 6))
    return { score: 0, valid: false };
  const counts = Array(7).fill(0);
  dice.forEach((n) => counts[n]++);
  if (dice.length === 6 && counts.slice(1).every((n) => n === 1))
    return { score: 1500, valid: true };
  if (dice.length === 6 && counts.slice(1).filter((n) => n === 2).length === 3)
    return { score: 1500, valid: true };
  let score = 0,
    used = 0;
  for (let n = 1; n <= 6; n++) {
    const count = counts[n];
    if (count >= 3) {
      score += (n === 1 ? 1000 : n * 100) * 2 ** (count - 3);
      used += count;
    } else if (n === 1 || n === 5) {
      score += count * (n === 1 ? 100 : 50);
      used += count;
    }
  }
  return { score, valid: used === dice.length };
}
export function hasFarkleScore(dice) {
  if (dice.length === 6 && farkleScore(dice).valid) return true;
  return (
    dice.includes(1) ||
    dice.includes(5) ||
    [2, 3, 4, 6].some((n) => dice.filter((v) => v === n).length >= 3)
  );
}
export const yatzyNames = [
  "Ones",
  "Twos",
  "Threes",
  "Fours",
  "Fives",
  "Sixes",
  "Three of a kind",
  "Four of a kind",
  "Full house",
  "Small straight",
  "Large straight",
  "Five of a kind",
  "Chance",
];
export function yatzyScore(dice, category) {
  if (dice.length !== 5 || dice.some((n) => n < 1 || n > 6)) return 0;
  const counts = Array(7).fill(0);
  dice.forEach((n) => counts[n]++);
  const sum = dice.reduce((a, b) => a + b, 0),
    has = (sequence) => sequence.every((n) => counts[n]);
  if (category < 6) return counts[category + 1] * (category + 1);
  if (category === 6) return counts.some((n) => n >= 3) ? sum : 0;
  if (category === 7) return counts.some((n) => n >= 4) ? sum : 0;
  if (category === 8) return counts.includes(3) && counts.includes(2) ? 25 : 0;
  if (category === 9)
    return has([1, 2, 3, 4]) || has([2, 3, 4, 5]) || has([3, 4, 5, 6]) ? 30 : 0;
  if (category === 10)
    return has([1, 2, 3, 4, 5]) || has([2, 3, 4, 5, 6]) ? 40 : 0;
  if (category === 11) return counts.includes(5) ? 50 : 0;
  return sum;
}
export function yatzyTotal(scores, bonus = 0) {
  const upper = scores.slice(0, 6).reduce((a, b) => a + (b || 0), 0);
  return {
    upper,
    upperBonus: upper >= 63 ? 35 : 0,
    total:
      scores.reduce((a, b) => a + (b || 0), 0) + (upper >= 63 ? 35 : 0) + bonus,
  };
}
