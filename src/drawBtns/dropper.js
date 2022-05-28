import { getCurrentPixel, tool } from "../state.js";
import { getPixel } from "./draw.js";
import { rgbToHsv } from "../colorConversion.js";

export function handleDropper(event) {
    // --GET POSITION OF MOUSE ON CANVAS--
    const mousePixel = getCurrentPixel(event);
    /*
    set current color to the color of the pixel the mouse is on

    we are always picking color for left click. why:
      1. if we pick for left click while on left click, and right for right, 
         then having dropper on right doesnt change left color
      2. if we pick for opposite click, then if pencil right eraser left, then 
         switch to dropper left to change left color, you instead change right 
         color.
    */
    const rgbaPixelColor = getPixel(mousePixel.x, mousePixel.y);
    tool.left.color.hsv = rgbToHsv(rgbaPixelColor[0], rgbaPixelColor[1], rgbaPixelColor[2]);
    tool.left.color.rgba = rgbaPixelColor;
    
}