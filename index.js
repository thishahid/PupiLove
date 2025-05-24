// Camera, shape, and capture logic for PupiLove Web

const video = document.getElementById('camera');
const shapeDisplay = document.getElementById('shapeDisplay');
const shapeBtns = document.querySelectorAll('.shape-btn');
const captureBtn = document.getElementById('captureBtn');
const colorPicker = document.getElementById('colorPicker');
let currentColor = '#39ff14';

// SVG shapes
const shapeSVGFiles = {
    heart: 'ic_heart.svg',
    star: 'ic_star.svg',
    bow: 'ic_butterfly.svg',
    leaf: 'ic_leaf.svg',
    love: 'ic_love.svg',
    peace: 'ic_peace.svg',
    batman: 'ic_batman.svg'
};
let currentShape = 'heart';

function setShape(shape) {
    currentShape = shape;
    fetch(shapeSVGFiles[shape])
        .then(res => res.text())
        .then(svg => {
            shapeDisplay.innerHTML = svg;
            const svgEl = shapeDisplay.querySelector('svg');
            if (svgEl) {
                svgEl.style.width = '180px';
                svgEl.style.height = '180px';
                svgEl.style.color = currentColor;
                // Set fill to currentColor for all relevant SVG elements
                const elements = svgEl.querySelectorAll('path, polygon, ellipse, circle, rect, g, use');
                elements.forEach(e => {
                    e.setAttribute('fill', 'currentColor');
                    e.setAttribute('stroke', 'none');
                });
            }
        });
}

// Color picker event
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    const svg = shapeDisplay.querySelector('svg');
    if (svg) {
        svg.style.color = currentColor;
        const elements = svg.querySelectorAll('path, polygon, ellipse, circle, rect, g, use');
        elements.forEach(el => {
            el.setAttribute('fill', 'currentColor');
            el.setAttribute('stroke', 'none');
        });
    }
});

// Camera access
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                facingMode: 'user' // Prefer front camera on mobile
            }
        });
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

// Shape sidebar toggle
const shapeSidebar = document.getElementById('shapeSidebar');
const shapeToggle = document.getElementById('shapeToggle');
const arrowIcon = shapeToggle.querySelector('.arrow-icon');

shapeToggle.addEventListener('click', () => {
    shapeSidebar.classList.toggle('open');
    // Optionally rotate the arrow
    if (shapeSidebar.classList.contains('open')) {
        arrowIcon.style.transform = 'rotate(180deg)';
    } else {
        arrowIcon.style.transform = 'rotate(0deg)';
    }
});

// Focus mode toggle
const focusBtn = document.getElementById('focusBtn');
const appContainer = document.querySelector('.app-container');

focusBtn.addEventListener('click', () => {
    appContainer.classList.toggle('focus-mode');
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    setShape(currentShape);
    startCamera();
});
