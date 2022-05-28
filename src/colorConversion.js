/**
 * convert hsv color format to rgb
 * @param {number} hue: 0-360
 * @param {number} saturation 0-1
 * @param {number} value 0-1
 * @param {number} alpha 0-1
 * @returns {Array<number>} [red, green, blue, alpha] vals 0-255
 */
export function hsvaToRgba(hue, saturation, value, alpha) {
    // https://wikiless.org/wiki/HSL_and_HSV?lang=en
    const k = (x, h) => (x + (h/60)) % 6;
    const f = (x, h, s, v) => v - v * s * Math.max(0, Math.min(k(x, h), 4 - k(x, h), 1));

    const r = 255 * f(5, hue, saturation, value);
    const g = 255 * f(3, hue, saturation, value);
    const b = 255 * f(1, hue, saturation, value);
    const a = 255 * alpha;

    return new Uint8ClampedArray([r, g, b, a]);
}
/**
 * 
 * @param {number} red 0-255
 * @param {number} green 0-255
 * @param {number} blue 0-255
 * @returns {{h: number, s: number, v: number}} h:0-360, s:0-1, v:0-1
 */
export function rgbToHsv(red, green, blue) {
    // https://math.stackexchange.com/questions/556341/rgb-to-hsv-color-conversion-algorithm
    const r = red / 255;
    const g = green / 255;
    const b = blue / 255;
    const C_max = Math.max(r, g, b);
    const C_min = Math.min(r, g, b);
    // VALUE
    const v = C_max;
    if (C_min == C_max) {
        return {h: 0, s: 0, v: v};
    }
    const D = C_max - C_min;
    // SATURATION
    const s = D / C_max;
    // HUE
    let h = 60;
    if (r == C_max) {
        h *= ((g - b) / D) % 6;
    } else if (g == C_max) {
        h *= ((b - r) / D) + 2;
    } else if (b == C_max) {
        h *= ((r - g) / D) + 4;
    }
    return {h: h, s: s, v: v};
}
export function rgbaArrToStr(arr) {
    return `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]})`;
}