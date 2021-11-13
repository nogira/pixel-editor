const px = 20;   // size of each pixel on the canvas

let imgWidth = 16;   // in pixels
let imgHeight = 16;   // in pixels

const canvas = document.getElementById("imgCanvas");
canvas.width = imgWidth * px
canvas.height = imgHeight * px
const ctx = canvas.getContext("2d");

let currentColor = "gray";
let currentTool = 'Pencil'

// init image
const img = [];
for (let i = 0; i < imgHeight; i++) {
    img.push([]);
    for (let j = 0; j < imgWidth; j++) {
        img[i].push("white");
    }
}
//             THIS CODE IS KINDA USELESS FOR NOW
// let checkeredTrack = true;
// for (let i = 0; i < imgHeight; i++) {
//     img.push([]);
//     for (let j = 0; j < imgWidth; j++) {
//         if (checkeredTrack) {
//             img[i].push("red");
//             checkeredTrack = false;
//         } else {
//             img[i].push("blue");
//             checkeredTrack = true;
//         }
        
//     }
// }
// document.querySelector("h1").innerHTML = JSON.stringify(img);

// render base image
// for (let y = 0; y < imgHeight; y++) {
//     for (let x = 0; x < imgWidth; x++) {
//         const x0 = x * px
//         const y0 = y * px
//         const width = height = px
//         ctx.fillStyle = img[y][x];
//         ctx.fillRect(x0, y0, width, height);
//     }
// }
function updatePixelOfRender(x, y) {
    const x0 = x * px;
    const y0 = y * px;
    const [width, height] = [px, px];
    ctx.fillStyle = img[y][x];
    ctx.fillRect(x0, y0, width, height);
}


//             MOUSE POSITON AND CLICK

const mousePixel = {x: 0, y: 0};
let prevChangedPixel = null;

function updatePositionOfMouseOnCanvas(event) {
    const rect = canvas.getBoundingClientRect();
    // minus 1 bc border
    const mousePosX = event.clientX - rect.left - 1;
    const mousePosY = event.clientY - rect.top - 1;
    
    function posToPixel(pos) {
        return Math.floor(pos / px);
    }
    mousePixel.x = posToPixel(mousePosX);
    mousePixel.y = posToPixel(mousePosY);

    // console.log('Mouse position: ' + mousePosX + ',' + mousePosY);
    // console.log('Pixel: ' + mousePixel.x + ',' + mousePixel.y);
}
function pencilFillMiddlePixels() {
    const {x: x1, y: y1} = prevChangedPixel;
    const {x: x2, y: y2} = mousePixel;

    const [xDiff, yDiff] = [Math.abs(x1 - x2), Math.abs(y1 - y2)]
    if (xDiff > 1 || yDiff > 1) {
        const xMin = Math.min(x1, x2)
        const yMin = Math.min(y1, y2)

        
        if (xDiff > yDiff) {
            const calcYFromLine = (x) => {
                // y = mx + c
                // y1 = m*x1 + c
                // y2 = m*x2 +c
                // y1 - y2 = (m*x1 + c) - (m*x2 +c)
                // y1 - y2 = m(x1 - x2)
                const m = (y1 - y2) / (x1 - x2)
                // y1 = m*x1 + c
                const c = y1 - m*x1
                const y = m*x + c
                return y
            }
            const xArr = [];
            for (let i=xMin+1; i < xMin+xDiff; i++) {
                xArr.push(i)
            }
            for (let xVal of xArr) {
                const yVal = calcYFromLine(xVal)
                if (yVal%1 === 0.5) {
                    updatePixelOfArrayAndRender(xVal, yVal+0.5)
                    updatePixelOfArrayAndRender(xVal, yVal-0.5)
                    // console.log(xVal, yVal+0.5)
                    // console.log(xVal, yVal-0.5)
                } else {
                    updatePixelOfArrayAndRender(xVal, Math.round(yVal))
                }

            }
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
                const m = (y1 - y2) / (x1 - x2 === 0 ? 0.001 : x1 - x2)
                // y1 = m*x1 + c
                const c = y1 - m*x1
                // y = m*x + c
                const x = (y - c) / m
                return x
            }
            const yArr = [];
            for (let i=yMin+1; i < yMin+yDiff; i++) {
                yArr.push(i)
            }
            // console.log(yArr)
            for (const yVal of yArr) {
                const xVal = calcXFromLine(yVal)
                // console.log(xVal, yVal);
                if (xVal%1 === 0.5) {
                    updatePixelOfArrayAndRender(xVal+0.5, yVal)
                    updatePixelOfArrayAndRender(xVal-0.5, yVal)
                    // console.log(yVal, yVal+0.5)
                    // console.log(yVal, yVal-0.5)
                } else {
                    updatePixelOfArrayAndRender(Math.round(xVal), yVal)
                }

            }
        }
    }
}
function updatePixelOfArrayAndRender(pixelX, pixelY) {
    img[pixelY][pixelX] = currentColor;
    updatePixelOfRender(pixelX, pixelY);
}
function pencilDraw(event) {
    updatePositionOfMouseOnCanvas(event);
    
    updatePixelOfArrayAndRender(mousePixel.x, mousePixel.y);

    // console.log('prev', prevChangedPixel, 'now', mousePixel)
    // console.log(prevChangedPixel)
    if (prevChangedPixel !== null) {
        
        pencilFillMiddlePixels();
    }
    // console.log("assign mousePixel to prevChangedPixel")
    prevChangedPixel = {...mousePixel};
}


$(canvas).on({
    mousedown(event) {
        // if statement is to make sure its left-click, not right-click
        if (event.buttons === 1) { pencilDraw(event); }
    },
    mousemove(event) {
        if (event.buttons === 1) { pencilDraw(event); }
    }
});
$(document).mouseup(() => {
    prevChangedPixel = null;
});


$(canvas).on('contextmenu', e => e.preventDefault());




// DOWNLOAD IMAGE

// Convert canvas to image
$('#save-img').click(() => {
    const dataURL = canvas.toDataURL("image/png");
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
    img.onload = function pencilDraw() {
        // canvas.width = this.width;
        // canvas.height = this.height;
        ctx.drawImage(this, 0,0);
    };
    img.onerror = function failed() {
        console.error("The provided file couldn't be loaded as an Image media");
    };
    img.src = URL.createObjectURL(this.files[0]);
});

$('#btn-pallete').click(() => {
    $("#pick-color").prop("hidden", false);
});
$("#close-pick-color").click(() => {
    $("#pick-color").prop("hidden", true);
});