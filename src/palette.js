import { hsvaToRgba, rgbaArrToStr } from "./colorConversion.js";
import { tool } from "./state.js";

// set SV box color
function setSVBoxColor(hue) {
    const SVCanvas = document.getElementById("sv");
    const width = SVCanvas.width;
    const height = SVCanvas.height;
    // console.log(SVCanvas.width, SVCanvas.height);
    const ctx = SVCanvas.getContext("2d");
    // reset canvas
    ctx.clearRect(0, 0, width, height);

    // length
    for (let i = 0; i < height; i++) {
        // width
        for (let j = 0; j < width; j++) {
            const saturation = j / width;
            const value = (-i + height) / height;
            ctx.fillStyle = rgbaArrToStr(hsvaToRgba(hue, saturation, value, 1));
            ctx.fillRect(j, i, 1, 1);
        }
    }
}

function updateSVMarker(event) {
    const svMarker = document.getElementById("sv-marker");
    // update color
    svMarker.style.backgroundColor = rgbaArrToStr(tool[paletteType].color.rgba);
    // move marker
    svMarker.style.top = (event.offsetY - 5) + "px";
    svMarker.style.left = (event.offsetX - 5) + "px";
}
function updateHueMarker(event) {
    const hueMarker = document.getElementById("hue-marker");
    // update hue marker color to high saturation hue
    hueMarker.style.backgroundColor = rgbaArrToStr(
        hsvaToRgba(tool[paletteType].color.hsv.h, 1, 1, 1)
    );
    // move marker
    hueMarker.style.top = (event.offsetY - 10) + "px";
}

// 200 x 150
function handleSVChange(event) {
    if (event.buttons === 1) {
        const saturation = event.offsetX / 200;
        const value =  - (event.offsetY / 140) + 1;
        // console.log(saturation, value);
        const hsv = tool[paletteType].color.hsv; // reference to hsv object
        hsv.s = saturation;
        hsv.v = value;
        tool[paletteType].color.hsv = {h: hsv.h, s: saturation, v: value};
        tool[paletteType].color.rgba = hsvaToRgba(hsv.h, saturation, value, 1);

        updateSVMarker(event);
    }
}
$("#sv").on({
    mousedown(event) {
        handleSVChange(event);
    },
    mousemove(event) {
        handleSVChange(event);
    }
});
// use delay between updates of 50ms to prevent too many updates freezing the 
// SV render
let lastSVUpdate = Date.now();
// 20 x 150
function handleHueChange(event) {
    const now = Date.now();
    if (lastSVUpdate < now - 10) {
        if (event.buttons === 1) {
            //          invert
            const hue = 360 - (event.offsetY / 150 * 360);
            const hsv = tool[paletteType].color.hsv; // reference to hsv object
            hsv.h = hue;
            // console.log(hue);
            tool[paletteType].color.hsv = {h: hue, s: hsv.s, v: hsv.v};
            tool[paletteType].color.rgba = hsvaToRgba(hue, hsv.s, hsv.v, 1);
            // update SV canvas
            setSVBoxColor(hue);

            updateHueMarker(event);
            // update sv marker color bc sv box has changed
            const svMarker = document.getElementById("sv-marker");
            svMarker.style.backgroundColor = rgbaArrToStr(tool[paletteType].color.rgba);
        }
        lastSVUpdate = now;
    }
}
$("#hue").on({
    mousedown(event) {
        handleHueChange(event);
    },
    mousemove(event) {
        handleHueChange(event);
    }
});

let paletteType = 'left'; // this var is so palette knows which color to change when using palette to change colors
function handleTogglePalette() {
    const hsv = tool[paletteType].color.hsv;
    setSVBoxColor(hsv.h);
    updateSVMarker({offsetX: hsv.s * 200, offsetY: (-hsv.v + 1) * 150});
    updateHueMarker({offsetY: (-hsv.h/360 + 1) * 150});
}
$('#pallete').on('mousedown', (event) => {
    const palleteHidden = $("#pick-color").prop("hidden");
    // update palette to current color of click used (i.e. right or left click) 
    // when palette unhidden
    if (palleteHidden) {
        switch (event.buttons) {
            // left click
            case 1:
                paletteType = 'left';
                handleTogglePalette();
                break;
            // right click
            case 2:
                paletteType = 'right';
                handleTogglePalette();
                break;
        }
    }
    // unhide palette
    $("#pick-color").prop("hidden", !palleteHidden);
});