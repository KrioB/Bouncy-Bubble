const canvas = document.getElementById('container');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const color = '#7f8a8f';
const bgColor = '#1b455a';

const mipix = 15; // convert milimeters to pixels def 6

// Primary parameters
const diameter = Math.min(innerWidth, innerHeight) / 8;     // bubble size
const ro = 1.5 / (mipix * mipix * mipix);                   // density
const k = 10000 / mipix;                                    // spring constant
const d = 0.1;                                              // dumping constant (always slightly larger due to the accuracy of the simulation)

const initVx = Math.random() * 600 - 300;                   // initial X velocity
const initVy = Math.random() * 400 - 200;                   // initial Y velocity
const initX = innerWidth * 0.5;                             // initial X position
const initY = innerHeight * 0.5;                            // initial Y position

// Math and physics constants
const fullArc = 2 * Math.PI;

// Calculated parameters
const r = diameter / 2;
const g = 10 * mipix;
const m = 4 * 3 * (r * r) * ro;
const kpm = k / m;
const dpm = d / m;


// Initialize simulation borders
let wallRight = innerWidth - r;
let wallLeft = r;
let wallBottom = innerHeight - r;
let wallUp = r;

// Initialize simulation state
let gx = 0;
let gy = g;

let x = initX;
let y = initY;
let vx = initVx;
let vy = initVy;


// Enable resize event
window.addEventListener('resize', resizeCanvas, false);

// Start simulation
let pts = performance.now();
animate();


function animate() {
    requestAnimationFrame(animate);

    clearFrame();


    let cts = performance.now();

    let dt = cts - pts;
    if(dt > 50) {
        dt = 17;    // in case lose of focus, assume 17ms, aprox. 60fps
    }
    dt /= 1000;

    pts = cts;

    let sx = 0;
    let sy = 0;

    if(x > wallRight ) {
        sx = wallRight - x;
    }
    else if(x < wallLeft) {
        sx = wallLeft - x;
    }

    if(y > wallBottom){
        sy = wallBottom - y;
    }
    else if(y < wallUp) {
       sy = wallUp - y;
    }

    let ax = kpm * sx * Math.abs(sx) - dpm * vx;
    let ay = kpm * sy * Math.abs(sy) - dpm * vy;

    ax += gx;
    ay += gy;

    vx += ax * dt;
    vy += ay * dt;

    x += vx * dt;
    y += vy * dt;

    // Squish more then radius is not allowed
    if(y > innerHeight) {
        y = innerHeight
        vy = 0;
        sy = r;
    }
    else if (y < 0) {
        y = 0
        vy = 0;
        sy = r;
    }

    if(x > innerWidth) {
        x = innerWidth
        vx = 0;
        sx = r;
    }
    else if (x < 0) {
        x = 0
        vx = 0;
        sx = r;
    }

    ball(x, y, r, Math.abs(sy) - Math.abs(sx));

}

function ball(x, y, radius, flat) {
    ctx.strokeStyle = color;
    ctx.lineWidth = radius * 0.1;

    ctx.beginPath();
    ctx.ellipse(x, y, radius + flat, radius - flat, 0, fullArc, false);
    ctx.stroke();
}

function clearFrame() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, innerWidth, innerHeight);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    wallRight = innerWidth - r;
    wallLeft = r;
    wallBottom = innerHeight - r;
    wallUp = r;
}