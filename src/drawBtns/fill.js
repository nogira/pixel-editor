import { image, tool, getCurrentPixel } from "../state.js";
import { getPixel, updatePixelArrayAndCanvas } from "./draw.js";

export async function handleFill(event) {
    /*
    TODO: fill

    when pixel is placed, get 3 pixels around it in the direction of the new 
    pixel, but not diagonals bc filling diagonals can result in crossing a 
    boundary line
          ▇
        ▇⚪️▇
         ⬆️
    there is the exception of the initial pixel, which goes in 4 directions

    full example:

              3
            3 2 3
          3 2 1(2)3
        3 2 1 0 1 2 3
          3 2 1 2 3
            3 2 3
              3

    if a pixel is placed by 2 different previous pixels (e.g. the 2 in brackets 
    above), it seems as though we can exclude this pixel from the next iteration
    of fills, as other pixels already have it covered. will have to test this 
    just to make sure.
    */
    const mousePixel = getCurrentPixel(event);
    // get the color of the pixel the mouse is on
    const firstPixelColor = getPixel(mousePixel.x, mousePixel.y);
    // change the color of the pixel the mouse is on to the current color
    const newColor = tool.left.color.rgba;
    updatePixelArrayAndCanvas(mousePixel.x, mousePixel.y, newColor);

    // console.log(mousePixel.x, mousePixel.y)
    // first check pixel above, down, left, and right
    const check = [
        {x: 0, y: -1},
        {x: 0, y: 1},
        {x: -1, y: 0},
        {x: 1, y: 0},
    ]
    // console.log(firstPixelColor);
    // console.log(getPixel(mousePixel.x, mousePixel.y-1))

    function arraysEqual(arr1, arr2) {
        for (let i=0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    let currentPixelsToCheck = [{...mousePixel}];
    while (currentPixelsToCheck.length > 0) {
        const nextPixels = new Set();
        // console.log(JSON.stringify(currentPixelsToCheck));
        for (const pixel of currentPixelsToCheck) {
            for (const direction of check) {
                const x = pixel.x + direction.x;
                const y = pixel.y + direction.y;
                if (0 <= x  && x < image.width && 0 <= y && y < image.height && arraysEqual(firstPixelColor, getPixel(x, y))) {
                    updatePixelArrayAndCanvas(x, y, newColor);
                    nextPixels.add({x, y});
                }
            }
            // sleep 10ms bc looks cool
            // await new Promise(resolve => setTimeout(resolve, 1));
        }
        currentPixelsToCheck = [...nextPixels];
        // sleep 10ms bc looks cool
        await new Promise(resolve => setTimeout(resolve, 20));
    }

    // TODO: then do 3 per new pixel based on direction

    // TODO: to test performance, try another algorithm where direction is 
    // excluded, and just does 4 per new pixels
    // - using set() vs not using set
    // - completely removing pixels that come up twice vs not removing them
    // - 3 directions vs 4 directions
}