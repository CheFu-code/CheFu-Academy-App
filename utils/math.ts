export function clampAndStep(
    val: number,
    min: number,
    max: number,
    step: number
): number {
    val = Math.max(min, Math.min(max, val));
    return Math.round(val / step) * step;
}
