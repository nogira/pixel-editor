import { initCanvas } from '../state.js';

$('#new-img').click(() => {
    const modalHidden = $("#new-img-modal").prop("hidden");
    $("#new-img-modal").prop("hidden", !modalHidden);
});
$('#exit-new-img').click(() => {
    $("#new-img-modal").prop("hidden", true);
});
$('#confirm-new-img').click(() => {
    const width = $("#img-width").val();
    const height = $("#img-height").val();
    initCanvas(width, height);

    $("#new-img-modal").prop("hidden", true);
});