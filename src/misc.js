
/*
TODO: hand tool to move around canvas

TODO: magnify tool to chnage canvas size
*/
import { canvas, tool } from "./state.js"

// prevent right click menu on canvas so can use for secondary tools (e.g. pencil on left click, eraser on right click)
$(canvas).on('contextmenu', e => e.preventDefault());

$('.tools').on('contextmenu', e => e.preventDefault());

function handleToolSwitch(event) {
    const toolId = event.currentTarget.id;
    switch (event.buttons) {
        // left click
        case 1:
            $('.left-btn').removeClass('left-btn');
            $(`#${toolId}`).addClass('left-btn');
            tool.left.type = toolId;
            break;
        // right click
        case 2:
            $('.right-btn').removeClass('right-btn');
            $(`#${toolId}`).addClass('right-btn');
            tool.right.type = toolId;
            break;
    }
}
$('#pencil').on('mousedown', handleToolSwitch);
$('#eraser').on('mousedown', handleToolSwitch);
$('#dropper').on('mousedown', handleToolSwitch);
$('#fill').on('mousedown', handleToolSwitch);

