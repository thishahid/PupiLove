// Camera, shape, and capture logic for PupiLove Web

const video = document.getElementById('camera');
const shapeDisplay = document.getElementById('shapeDisplay');
const shapeBtns = document.querySelectorAll('.shape-btn');
const captureBtn = document.getElementById('captureBtn');
const colorPicker = document.getElementById('colorPicker');
let currentColor = '#39ff14';

// SVG shapes
const shapes = {
    heart: `<svg viewBox="0 0 100 100" width="180" height="180"><path d="M50 80 L20 50 A20 20 0 1 1 50 30 A20 20 0 1 1 80 50 Z" fill="currentColor" stroke="white" stroke-width="4"/></svg>`,
    star: `<svg viewBox="0 0 100 100" width="180" height="180"><polygon points="50,10 61,39 92,39 66,59 76,89 50,70 24,89 34,59 8,39 39,39" fill="currentColor" stroke="white" stroke-width="4"/></svg>`,
    bow: `<svg viewBox="0 0 100 100" width="180" height="180"><ellipse cx="30" cy="50" rx="24" ry="14" fill="currentColor" stroke="white" stroke-width="4"/><ellipse cx="70" cy="50" rx="24" ry="14" fill="currentColor" stroke="white" stroke-width="4"/><circle cx="50" cy="50" r="12" fill="currentColor" stroke="white" stroke-width="4"/></svg>`,
    flower: `<svg viewBox="0 0 100 100" width="180" height="180"><circle cx="50" cy="50" r="16" fill="currentColor" stroke="white" stroke-width="4"/><ellipse cx="50" cy="30" rx="12" ry="24" fill="currentColor" stroke="white" stroke-width="4"/><ellipse cx="50" cy="70" rx="12" ry="24" fill="currentColor" stroke="white" stroke-width="4"/><ellipse cx="30" cy="50" rx="24" ry="12" fill="currentColor" stroke="white" stroke-width="4"/><ellipse cx="70" cy="50" rx="24" ry="12" fill="currentColor" stroke="white" stroke-width="4"/></svg>`
};
let currentShape = 'heart';

function setShape(shape) {
    currentShape = shape;
    shapeDisplay.innerHTML = shapes[shape];
    shapeDisplay.querySelector('svg').style.color = currentColor;
}

// Color picker event
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    const svg = shapeDisplay.querySelector('svg');
    if (svg) svg.style.color = currentColor;
});

// Camera access
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        alert('Camera access denied or not available.');
    }
}

// Shape selection
shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => setShape(btn.dataset.shape));
});

// Capture selfie
captureBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Do NOT overlay the shape in the captured image
    // Show or download the selfie
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'pupilove-selfie.png';
    link.click();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js');
    });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    setShape(currentShape);
    startCamera();
});
