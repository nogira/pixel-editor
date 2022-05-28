import { image } from "../state.js";
import { rgbaArrToStr } from "../colorConversion.js";

/*
1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3
4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6
7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9

x=1, y=1
width=3

idx_r = width * y * 4 + (x * 4)
        = 3     * 1 * 4 + (1 * 4)
        = 12 + 4
        = 16 ✅

x=0, y=2
width=3

idx_r = width * y * 4 + (x * 4)
        = 3     * 2 * 4 + (0 * 4)
        = 24 ✅
*/
const getRedIndex = (x, y) => (image.width * y * 4) + (x * 4);

/**
 * edit pixel array of image
 * @param {*} x x-coordinate of pixel
 * @param {*} y y-coordinate of pixel
 * @param {*} r red (0-255)
 * @param {*} g green (0-255)
 * @param {*} b blue (0-255)
 * @param {*} a transparency (0-255)
 */
export function editPixel(x, y, color) {
    const r_index = getRedIndex(x, y);
    const r = color[0];
    const g = color[1];
    const b = color[2];
    const a = color[3];
    image.array[r_index] = r;
    image.array[r_index + 1] = g;
    image.array[r_index + 2] = b;
    image.array[r_index + 3] = a;
}
/**
 * 
 * @param {number} x x-coordinate of pixel
 * @param {number} y y-coordinate of pixel
 * @returns {Array<number>} rgba array of pixel
 */
export function getPixel(x, y) {
    const r_index = getRedIndex(x, y);
    return [
        image.array[r_index],
        image.array[r_index + 1],
        image.array[r_index + 2],
        image.array[r_index + 3]
    ];
}

function drawPixelOnCanvas(x, y, color) {
    const px = image.px;
    image.ctx.clearRect(x * px, y * px, px, px);
    // set the color of the pixel about to be drawn
    image.ctx.fillStyle = rgbaArrToStr(color);
    //           x0,     y0,  width, height
    image.ctx.fillRect(x * px, y * px, px, px);
}

export function updatePixelArrayAndCanvas(pixelX, pixelY, color) {
    editPixel(pixelX, pixelY, color);
    drawPixelOnCanvas(pixelX, pixelY, color);
}