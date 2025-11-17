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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Optional: redraw background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Resize at start
resizeCanvas();

// Resize whenever window changes size
window.addEventListener('resize', resizeCanvas);

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

// --- MOUSE EVENTS ---
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    lastX = e.offsetX;
    lastY = e.offsetY;
});

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