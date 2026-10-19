export function battingOutcome(error, window = 0.19) {
  const e = Math.abs(error);
  if (e > window)
    return {
      runs: 0,
      wicket: true,
      label: error < 0 ? "Too early" : "Too late",
    };
  if (e < window * 0.19)
    return { runs: 6, wicket: false, label: "Perfect · SIX!" };
  if (e < window * 0.43)
    return { runs: 4, wicket: false, label: "Beautiful · FOUR!" };
  if (e < window * 0.7) return { runs: 2, wicket: false, label: "Two runs" };
  return { runs: 1, wicket: false, label: "A single" };
}
export function deliveryPoint(
  progress,
  { bounceAt = 0.64, bounceHeight = 53 } = {},
) {
  const p = Math.max(0, Math.min(1.08, progress)),
    x = 700 - 560 * p;
  const y =
    p < bounceAt
      ? 205 + 147 * (p / bounceAt) ** 1.6
      : 352 -
        bounceHeight *
          Math.sin((Math.PI * 0.8 * (p - bounceAt)) / (1 - bounceAt));
  return { x, y };
}
export const overs = (balls) => `${Math.floor(balls / 6)}.${balls % 6}`;

// Variation is chosen before release; no hidden dice roll decides a player's contact.
export function makeDelivery(
  rng = Math.random,
  difficulty = "regular",
  balls = 0,
) {
  const styles = [
    ["Yorker", 0.77, 27],
    ["Good length", 0.65, 59],
    ["Short ball", 0.49, 93],
    ["Slower ball", 0.61, 54],
  ];
  const [style, bounceAt, bounceHeight] =
    styles[Math.floor(rng() * styles.length)];
  const pace =
    difficulty === "fast" ? 0.8 : difficulty === "relaxed" ? 1.22 : 1;
  return {
    style,
    bounceAt: bounceAt + (rng() - 0.5) * 0.04,
    bounceHeight: bounceHeight + (rng() - 0.5) * 8,
    duration:
      (((style === "Slower ball" ? 1.7 : 1.05) + rng() * 0.43) * pace) /
      Math.min(1.3, 1 + balls * 0.007),
    windup: 0.6 + rng() * 0.65,
  };
}
