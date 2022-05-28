import { getCurrentPixel, prevChangedPixel } from '../state.js';
import { updatePixelArrayAndCanvas } from './draw.js';

export function handlePencilDrawing(event, color) {
    const mousePixel = getCurrentPixel(event);
    updatePixelArrayAndCanvas(mousePixel.x, mousePixel.y, color);

    // if input is continuous (prevChangedPixel has a value), fill in middle pixels
    if (prevChangedPixel.x) {
        pencilFillMiddlePixels(mousePixel, color);
    }
    // track pixel that was just changed to allow for next user input update to 
    // fill in middle pixels if input is continuous
    [prevChangedPixel.x, prevChangedPixel.y] = [mousePixel.x, mousePixel.y];
}

function pencilFillMiddlePixels(mousePixel, color) {
    const {x: x1, y: y1} = prevChangedPixel;
    const {x: x2, y: y2} = mousePixel;

    // calculate the x and y difference between the two pixels
    const [xDiff, yDiff] = [Math.abs(x1 - x2), Math.abs(y1 - y2)]
    // if  both x and y difference are 0, then the user clicked on the same 
    // pixel so no need to fill in middle pixels
    if (xDiff > 1 || yDiff > 1) {
        const xMin = Math.min(x1, x2);
        const yMin = Math.min(y1, y2);

        /*
        to make adding pixels simpler, we add along the longest axis.
        e.g. in this example between points a & b, the middle is 4 wide and 2 tall:
          a
           ▉▉
             ▉▉
               b

        if we add pixels along the x-axis, we just need to fill in the numbers 
        between a_x and b_x with a simple for loop (i.e. get the uniwue integers
        between a_x and b_x). then from those x values we can calculate the 
        y-values for each x-value with the equation of a line, y = mx + c

        if we add pixels along the y-axis, you need the y-values between the 2 
        y-values of a and b (very simple), and then also you need to calculate 
        how many pixels you need per y-value (could get quite complicated), and 
        then you need to calculate the x-value per y value for each y-value, 
        again using y = mx + c (rearranged to x = (y - c) / m)

        as you can see, if you calculate along the longest axis, there are 2 
        calculation steps, while if you go along the shortest axis there are 3 
        steps. thus we calculate along the longest axis
        */

        // if x-axis is the longest axis
        if (xDiff > yDiff) {
            const calcYFromLine = (x) => {
                // y = mx + c
                // y1 = m*x1 + c
                // y2 = m*x2 +c
                // y1 - y2 = (m*x1 + c) - (m*x2 +c)
                // y1 - y2 = m(x1 - x2)
                const m = (y1 - y2) / (x1 - x2);
                // y1 = m*x1 + c
                const c = y1 - m*x1;
                const y = m*x + c;
                return y;
            }
            const xArr = [];
            for (let i=xMin+1; i < xMin+xDiff; i++) {
                xArr.push(i);
            }
            for (let xVal of xArr) {
                const yVal = calcYFromLine(xVal);
                // if decimal part of yVal is 0.5, coordinate is  on edge of 2 
                // pixels, so fill in both pixels
                if (yVal % 1 === 0.5) {
                    updatePixelArrayAndCanvas(xVal, yVal+0.5, color);
                    updatePixelArrayAndCanvas(xVal, yVal-0.5, color);
                } else {
                    updatePixelArrayAndCanvas(xVal, Math.round(yVal), color); // rounding bc sometimes calulating integers can cause the number to be off by like 0.00000000000000001
                }

            }
        // if y-axis is the longest axis
        } else {
            const calcXFromLine = (y) => {
                // y = mx + c
                // y1 = m*x1 + c
                // y2 = m*x2 +c
                // y1 - y2 = (m*x1 + c) - (m*x2 +c)
                // y1 - y2 = m(x1 - x2)
                // m = (y1 - y2) / (x1 - x2)
                // if straight line up x1-x2 will equal zero but can't 
                // divide by 0 so just use rly small num instead
                const m = (y1 - y2) / (x1 - x2 === 0 ? 0.001 : x1 - x2);
                // y1 = m*x1 + c
                const c = y1 - m*x1;
                // y = m*x + c
                const x = (y - c) / m;
                return x;
            }
            const yArr = [];
            for (let i=yMin+1; i < yMin+yDiff; i++) {
                yArr.push(i);
            }
            for (const yVal of yArr) {
                const xVal = calcXFromLine(yVal);
                // if decimal part of xVal is 0.5, coordinate is  on edge of 2 
                // pixels, so fill in both pixels
                if (xVal % 1 === 0.5) {
                    updatePixelArrayAndCanvas(xVal+0.5, yVal, color);
                    updatePixelArrayAndCanvas(xVal-0.5, yVal, color);
                } else {
                    updatePixelArrayAndCanvas(Math.round(xVal), yVal, color); // rounding bc sometimes calulating integers can cause the number to be off by like 0.00000000000000001
                }

            }
        }
    }
}