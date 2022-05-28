import { canvas, image } from "../state.js";

$('#open-img').click(() => {
    $("#upload-img").click()
});

$('#upload-img').on("input", function(e) {
    const img = new Image();
    img.onload = function draw() {
        // --DRAW RESIZED IMAGE ON CANVAS--
        const width = this.width;
        const height = this.height;
        image.width = width;
        image.height = height;

        const canvasWidth = width * image.px;
        const canvasHeight = height * image.px;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        image.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // prevent blurring pixel image when uploaded (it seems to reset if only
        // called once at top of code, so must called right before each uppload)
        image.ctx.imageSmoothingEnabled = false;
        image.ctx.drawImage(this, 0, 0, canvasWidth, canvasHeight);

        // --CREATE RGBA ARRAY FROM IMAGE--
        const tempCanvas = new OffscreenCanvas(width, height);
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.imageSmoothingEnabled = false;
        tempCtx.drawImage(this, 0, 0);
        // get rgba array from image
        const imgData = tempCtx.getImageData(0, 0, width, height);
        image.array = imgData.data;
    };
    img.onerror = function failed() {
        console.error("The provided file couldn't be loaded as an Image media");
    };
    img.src = URL.createObjectURL(this.files[0]);
});