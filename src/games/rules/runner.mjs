// Include the dinosaur's head: high birds require ducking instead of passing through it.
export function runnerHit(y, duck, obstacle) {
  const height = duck ? 24 : 61;
  return (
    obstacle.x < 145 &&
    obstacle.x + obstacle.w > 99 &&
    y - height + 5 < obstacle.y &&
    y - 4 > obstacle.y - obstacle.h
  );
}
