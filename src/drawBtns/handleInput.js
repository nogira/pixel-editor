import { canvas, tool, prevChangedPixel } from "../state.js";
import { handlePencilDrawing } from "./pencil.js";
import { handleDropper } from "./dropper.js";
import { handleFill } from "./fill.js";


function handleMouseDown(event) {
    function handleMouseType(event, btnType) {
        switch (tool[btnType].type) {
            case 'pencil':
                handlePencilDrawing(event, tool[btnType].color.rgba);
                break;
            case 'eraser':
                const eraserColor = [0, 0, 0, 0];
                handlePencilDrawing(event, eraserColor);
                break;
            case 'dropper':
                handleDropper(event);
                break;
            case 'fill':
                // dont use mousemove for fill bc fill lags
                if (event.type != 'mousemove') {
                    handleFill(event);
                }
                break;
        }
    }
    switch (event.buttons) {
        // left click
        case 1:
            handleMouseType(event, 'left');
            break;
        // right click
        case 2:
            handleMouseType(event, 'right');
            break;
    }
}

$(canvas).on({
    mousedown(event) {
        handleMouseDown(event);
    },
    mousemove(event) {
        // only use mousemove for pencil and eraser
        handleMouseDown(event);
    }
});
$(document).mouseup(() => {
    // reset prevChangedPixel
    delete prevChangedPixel.x;
    delete prevChangedPixel.y;
});