const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const homeContent = document.getElementById('homeContent');
const addCanvasButton = document.querySelector('.btn-outline-dark');
const eraser = document.getElementById('eraser');
const toolbar = document.getElementById('toolbar');
const clear = document.getElementById('clear');
const toolbar2 = document.getElementById('toolbar2');
const colorPicker = document.getElementById('colorPicker');
const colorOptions = document.getElementById('colorOptions');
const colorButtons = document.querySelectorAll('.color-btn');
const marker = document.getElementById('marker');
const pen = document.getElementById('pen');
const home= document.getElementById('home');

// --- TOOL ACTIVE HIGHLIGHT FUNCTION ---
function activate(btn) {
  document.querySelectorAll('#toolbar button')
    .forEach(b => b.classList.remove('tool-active')); // remove highlight from all
  btn.classList.add('tool-active');                  // highlight clicked button
}

function resizeCanvas() {
    // Handle high-DPI (retina) screens properly so strokes are sharp
    const dpr = window.devicePixelRatio || 1;

    // Keep the CSS size equal to the viewport
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    // Set the internal pixel buffer to DPR * CSS size
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    // Reset any transform and scale so drawing uses CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Redraw background (in CSS pixels)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

// Resize at start
resizeCanvas();

// Resize whenever window changes size
window.addEventListener('resize', resizeCanvas);

// Prevent the canvas from triggering page scrolling while drawing on touch devices
canvas.style.touchAction = 'none';

home.addEventListener('click', () => {
    homeContent.style.display = 'block';   // show home
    canvas.style.display = 'none';         // hide canvas
    toolbar.style.display = 'none';        // hide toolbar
    toolbar2.style.display = 'none';       // hide second toolbar
});

// --- SHOW CANVAS ---
addCanvasButton.addEventListener('click', () => {
    homeContent.style.display = 'none';
    canvas.style.display = 'block';
    if (toolbar) toolbar.style.display = 'flex';
    if (toolbar2) toolbar2.style.display = 'flex';

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});



// --- COLOR PICKER ---
colorPicker.addEventListener('click', () => {
    colorOptions.style.display = colorOptions.style.display === 'none' ? 'flex' : 'none';
});

// --- CHOOSE COLOR ---
colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentColor = btn.getAttribute('data-color');
    });
});

// --- TOOL BUTTONS ---
pen.addEventListener('click', () => {
    ctx.globalAlpha = 1;    // normal opacity
    currentColor = 'black';
    currentSize = 6;        // pen thin size
    activate(pen);
});

marker.addEventListener('click', () => {
    ctx.globalAlpha = 1;
    currentColor = 'black';
    currentSize = 18;       // marker thick size
    activate(marker);
});

eraser.addEventListener('click', () => {
    currentColor = 'white';
    currentSize = 20;
    activate(eraser);
});

clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    activate(clear);
});

// --- DRAWING VARIABLES ---
let isDrawing = false;
let currentColor = 'black';
let currentSize = 6;
let lastX = 0;
let lastY = 0;
// --- POINTER / TOUCH / MOUSE EVENTS ---
// Use Pointer Events where available (covers mouse, touch, pen). Provide a tiny
// fallback for touchmove to prevent the browser from scrolling while drawing.

function getPointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

canvas.addEventListener('pointerdown', (e) => {
    // Only react to left mouse button or any touch/pen contact
    isDrawing = true;
    const pos = getPointerPos(e);
    lastX = pos.x;
    lastY = pos.y;
    // Capture the pointer so we continue to receive events even if finger moves fast
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
});

canvas.addEventListener('pointermove', (e) => {
    if (!isDrawing) return;

    const pos = getPointerPos(e);

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
});

function endDrawing(e) {
    isDrawing = false;
    try { canvas.releasePointerCapture && canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
}

canvas.addEventListener('pointerup', endDrawing);
canvas.addEventListener('pointercancel', endDrawing);

// Older browsers/devices: prevent the default touchmove behavior (scrolling)
canvas.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) e.preventDefault();
}, { passive: false });

// Tool selection (for example, changing color)
// Assuming you add an element with the class 'tool' to your HTML, e.g., a button for the pen.
// If you want the pen to be the default, you don't need this event listener initially.
// const penTool = document.querySelector('.tool');
// if (penTool) {
//     penTool.addEventListener('click', () => {
//         currentColor = 'black';
//         currentSize = 5;
//     });
// }