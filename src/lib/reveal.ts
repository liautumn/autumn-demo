export function revealProgress(
  containerTop: number,
  containerHeight: number,
  stickyHeight: number,
): number {
  const travel = containerHeight - stickyHeight
  if (travel <= 0) return containerTop < 0 ? 1 : 0
  return Math.min(1, Math.max(0, -containerTop / travel))
}
