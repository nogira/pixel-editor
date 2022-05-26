// import { newPixArr } from "./newPixArr";

const px = 20;   // size of each pixel on the canvas

let imgWidth = 16;   // in pixels
let imgHeight = 16;   // in pixels

const canvas = document.getElementById("displayCanvas");
canvas.width = imgWidth * px;
canvas.height = imgHeight * px;
const ctx = canvas.getContext("2d");

const pixelArr = newPixArr();

/**
 * convert hsv color format to rgb
 * @param {*} hue: 0-360
 * @param {*} saturation 0-1
 * @param {*} value 0-1
 */
function hsvToRgb(hue, saturation, value) {
    // https://wikiless.org/wiki/HSL_and_HSV?lang=en
    const k = (x, h) => (x + (h/60)) % 6;
    const f = (x, h, s, v) => v - v * s * Math.max(0, Math.min(k(x, h), 4 - k(x, h), 1));

    const r = 255 * f(5, hue, saturation, value);
    const g = 255 * f(3, hue, saturation, value);
    const b = 255 * f(1, hue, saturation, value);

    return `rgb(${r}, ${g}, ${b})`;
}
// console.log(hsvToRgb(360, 0.66, 0.68)); // works :)

// h:0-360 s/v: 0-1
let HSV = {H: 222, S: 0.5, V: 0.5};
let currentColor = hsvToRgb(HSV.H, HSV.S, HSV.V);
let currentLeftTool = 'pencil';
let currentRightTool = 'eraser';
const eraserColor = "rgba(0, 0, 0, 0)";

// set SV box color
function setSVBoxColor(hue) {
    const SVCanvas = document.getElementById("SV");
    const ctx = SVCanvas.getContext("2d");
    // reset canvas
    ctx.clearRect(0, 0, 200, 140);

    // length
    for (let i = 0; i < 150; i++) {
        // width
        for (let j = 0; j < 200; j++) {
            const saturation = j / 200;
            const value = (-i + 150) / 150;
            ctx.fillStyle = hsvToRgb(hue, saturation, value);
            ctx.fillRect(j, i, 1, 1);
        }
    }
}
setSVBoxColor(HSV.H);

// 200 x 140
function handleSVChange(event) {
    if (event.buttons === 1) {
        const saturation = event.offsetX / 200;
        const value =  - (event.offsetY / 140) + 1;
        // console.log(saturation, value);
        HSV.S = saturation;
        HSV.V = value;
        currentColor = hsvToRgb(HSV.H, saturation, value);
    }
}
$("#SV").on({
    mousedown(event) {
        handleSVChange(event);
    },
    mousemove(event) {
        handleSVChange(event);
    }
});
// 20 x 140
function handleHueChange(event) {
    if (event.buttons === 1) {
        //          invert
        const hue = 360 - (event.offsetY / 150 * 360);
        HSV.H = hue;
        // console.log(hue);
        currentColor = hsvToRgb(hue, HSV.S, HSV.V);
        // update SV canvas
        setSVBoxColor(hue);
    }
}
$("#Hue").on({
    mousedown(event) {
        handleHueChange(event);
    },
    mousemove(event) {
        handleHueChange(event);
    }
});


/** --INITIALIZE IMAGE--
 * 
 *  example of 4px by 4px image
 * ```
 * [
 *     ['white', 'white', 'white', 'white'],
 *     ['white', 'white', 'white', 'white'],
 *     ['white', 'white', 'white', 'white'],
 *     ['white', 'white', 'white', 'white'],
 * ]
 * ```
 */ 
function newPixArr() {
    const pixelArr = [];
    for (let i = 0; i < imgHeight; i++) {
        pixelArr.push([]);
        for (let j = 0; j < imgWidth; j++) {
            pixelArr[i].push("rgba(0, 0, 0, 0)");
        }
    }
    return pixelArr
}


/* 🚨 🚨 🚨

TODO:
to pick right a left mouse tools, left click on tool selects it for left click, 
right click on tool selects it for right click

to indicate which tool is selected, for left click have top left triange of tool
colored some dark color, and for right click have bottom right trangle in a 
lighter version of the same color (bc left click is more important so having a 
darker color that stands out more helps with visual understanding)

🚨 🚨 🚨 */


//             THIS CODE IS KINDA USELESS FOR NOW
// let checkeredTrack = true;
// for (let i = 0; i < imgHeight; i++) {
//     pixelArr.push([]);
//     for (let j = 0; j < imgWidth; j++) {
//         if (checkeredTrack) {
//             pixelArr[i].push("red");
//             checkeredTrack = false;
//         } else {
//             pixelArr[i].push("blue");
//             checkeredTrack = true;
//         }
        
//     }
// }
// document.querySelector("h1").innerHTML = JSON.stringify(pixelArr);

// render base image
// for (let y = 0; y < imgHeight; y++) {
//     for (let x = 0; x < imgWidth; x++) {
//         const x0 = x * px
//         const y0 = y * px
//         const width = height = px
//         ctx.fillStyle = pixelArr[y][x];
//         ctx.fillRect(x0, y0, width, height);
//     }
// }

function drawPixelOnCanvas(x, y, color) {
    ctx.clearRect(x * px, y * px, px, px);
    // set the color of the pixel about to be drawn
    ctx.fillStyle = color;
    //           x0,     y0,  width, height
    ctx.fillRect(x * px, y * px, px, px);
}


// ------MOUSE POSITON AND CLICK------


let prevChangedPixel = null;

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
function updatePixelArrayAndCanvas(pixelX, pixelY, color) {
    // console.log(pixelX, pixelY);
    pixelArr[pixelY][pixelX] = color;
    drawPixelOnCanvas(pixelX, pixelY, color);
}
function handlePencilDrawing(event, color) {
    const mousePixel = {};
    // --update position of mouse on canvas--
    {
        // get the position of the canvas
        const rect = canvas.getBoundingClientRect();
        // minus 1 bc border
        const mousePosX = event.clientX - rect.left - 1;
        const mousePosY = event.clientY - rect.top - 1;
        const posToPixel = (pos) => Math.floor(pos / px);
        mousePixel.x = posToPixel(mousePosX);
        mousePixel.y = posToPixel(mousePosY);
    }
    updatePixelArrayAndCanvas(mousePixel.x, mousePixel.y, color);

    // if input is continuous, fill in middle pixels
    if (prevChangedPixel !== null) {
        pencilFillMiddlePixels(mousePixel, color);
    }
    // track pixel that was just changed to allow for next user input update to 
    // fill in middle pixels if input is continuous
    prevChangedPixel = {...mousePixel};
}


function handleMouseDown(event) {
    switch (event.buttons) {
        // left click
        case 1:
            switch (currentLeftTool) {
                case 'pencil':
                    handlePencilDrawing(event, currentColor);
                    break;
                case 'eraser':
                    handlePencilDrawing(event, eraserColor);
            }
            break;

        // right click
        case 2:
            switch (currentRightTool) {
                case 'pencil':
                    handlePencilDrawing(event, currentColor);
                    break;
                case 'eraser':
                    handlePencilDrawing(event, eraserColor);
            }
            break;
    }
}

$(canvas).on({
    mousedown(event) {
        handleMouseDown(event);
    },
    mousemove(event) {
        handleMouseDown(event);
    }
});
$(document).mouseup(() => {
    prevChangedPixel = null;
});

// prevent right click menu on canvas so can use for secondary tools (e.g. pencil on left click, eraser on right click)
$(canvas).on('contextmenu', e => e.preventDefault());




// --DOWNLOAD IMAGE--

function drawPixelOnImgCanvas(x, y, color, ctx) {
    ctx.clearRect(x, y, 1, 1);
    // set the color of the pixel about to be drawn
    ctx.fillStyle = color;
    //          x0,y0,width,height
    ctx.fillRect(x, y, 1, 1);
}

// Convert canvas to image
$('#save-img').click(() => {
    // create a new image at correct scale
    const imgCanvas = document.createElement('canvas')
    imgCanvas.width = imgWidth;
    imgCanvas.height = imgHeight;
    const imgCtx = imgCanvas.getContext("2d");

    for (let i=0; i < imgHeight; i++) {
        for (let j=0; j < imgWidth; j++) {
            drawPixelOnImgCanvas(j, i, pixelArr[i][j], imgCtx);
        }
    }

    const dataURL = imgCanvas.toDataURL("image/png");
    downloadImage(dataURL, 'pixel art.png');
});

// Save | Download image
function downloadImage(data, filename = 'untitled.png') {
    const a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}


$('#open-img').click(() => {
    // var dataURL = canvas.toDataURL("image/png");
    $("#upload-img").click()
    // downloadImage(dataURL, 'pixel art.png');
});
// document.getElementById('upload-img').addEventListener("input", (e) => {
//     const input = document.getElementById('upload-img')
//     var img = new Image();
//     img.onload = function() {
//         var ctx = document.getElementById('ctx').getContext('2d');
//         ctx.drawImage(img, 0, 0);
//     }
//     img.src = URL.createObjectURL(input.files[0]);
    
// });


$('#upload-img').on("input", function(e) {
    const img = new Image();
    img.onload = function draw() {
        // canvas.width = this.width;
        // canvas.height = this.height;
        ctx.drawImage(this, 0,0);
    };
    img.onerror = function failed() {
        console.error("The provided file couldn't be loaded as an Image media");
    };
    img.src = URL.createObjectURL(this.files[0]);
});


$('.tools').on('contextmenu', e => e.preventDefault());

function handleToolSwitch(event) {
    const toolId = event.currentTarget.id;
    switch (event.buttons) {
        // left click
        case 1:
            $('.left-btn').removeClass('left-btn');
            $(`#${toolId}`).addClass('left-btn');
            currentLeftTool = toolId;
            break;
        // right click
        case 2:
            $('.right-btn').removeClass('right-btn');
            $(`#${toolId}`).addClass('right-btn');
            currentRightTool = toolId;
            break;
    }
}
$('#pencil').on('mousedown', handleToolSwitch);
$('#eraser').on('mousedown', handleToolSwitch);
$('#dropper').on('mousedown', handleToolSwitch);

let palleteHidden = true;
$('#pallete').click(() => {
    palleteHidden = !palleteHidden;
    $("#pick-color").prop("hidden", palleteHidden);

});