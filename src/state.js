import { rgbToHsv } from "./colorConversion.js";

export const canvas = document.getElementById("displayCanvas");
export const image = {
    ctx: canvas.getContext("2d"),
    array: null,
    // width in pixels
    width: null,
    // height in pixels
    height: null,
    // width/height of each pixel on the canvas
    px: 20,
}
export function initCanvas(width, height) {
    // create image array of zeros
    image.array = new Uint8ClampedArray(height * width * 4);
    image.width = width;
    image.height = height;
    canvas.width = width * image.px;
    canvas.height = height * image.px;
}
initCanvas(16, 16);

export const tool = {
    left: {
        type: 'pencil',
        color: {
            rgba: new Uint8ClampedArray([200,100,100,255]),
            hsv: rgbToHsv(200, 100, 100),
        },
    },
    right: {
        type: 'eraser',
        color: {
            rgba: new Uint8ClampedArray([100,100,200,255]),
            hsv: rgbToHsv(100, 100, 200),
        },
    },
}

/**
 * // --GET POSITION OF MOUSE ON CANVAS--
 * @param {*} event 
 * @returns {{x: number, y: number}} current pixel position of mouse
 */
export function getCurrentPixel(event) {
    // get the position of the canvas
    const rect = canvas.getBoundingClientRect();
    // minus 1 bc border
    const mousePosX = event.clientX - rect.left - 1;
    const mousePosY = event.clientY - rect.top - 1;
    const posToPixel = (pos) => Math.floor(pos / image.px);
    return {
        x: posToPixel(mousePosX),
        y: posToPixel(mousePosY),
    };
}

export let prevChangedPixel = {};