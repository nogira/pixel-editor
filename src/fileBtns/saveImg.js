import { image } from "../state.js";

// convert canvas to image
$('#save-img').click(() => {
    // create a new image at correct scale
    const imgCanvas = document.createElement('canvas')
    imgCanvas.width = image.width;
    imgCanvas.height = image.height;
    const imgCtx = imgCanvas.getContext("2d");

    console.log(image.array);
    const iData = new ImageData(image.array, image.width, image.height);
    // prevent image from having layer of ~1% transparency instead of 0%
    imgCtx.imageSmoothingEnabled = false;
    imgCtx.putImageData(iData, 0, 0);

    const dataURL = imgCanvas.toDataURL("image/png");
    downloadImage(dataURL, 'pixel art.png');
});

// save / download image
function downloadImage(data, filename = 'untitled.png') {
    const a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}