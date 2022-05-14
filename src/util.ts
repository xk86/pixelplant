export type Color = { r: number; g: number; b: number; a: number };
function rgbaStr(color: Color) {
  return `rgba(${color.r},${color.g},${color.b},${color.a})`;
}
const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export default { rgbaStr, clamp };
