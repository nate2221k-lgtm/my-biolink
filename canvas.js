// Background Canvas & Particle Engine for Guns.lol / Feds.lol clone

class CanvasEngine {
    constructor() {
        this.bgCanvas = null;
        this.bgCtx = null;
        this.cursorCanvas = null;
        this.cursorCtx = null;

        this.bgType = 'starfield'; // starfield, matrix, liquid, embers
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.mouse = { x: this.width / 2, y: this.height / 2, active: false };
        this.particles = [];
        this.matrixCols = [];
        this.matrixCharSize = 16;
        this.cursorTrail = [];
        this.isCursorTrailEnabled = true;

        this.animId = null;
        this.resizeHandler = this.resize.bind(this);
        this.mouseMoveHandler = this.onMouseMove.bind(this);
    }

    init(bgCanvasEl, cursorCanvasEl) {
        this.bgCanvas = bgCanvasEl;
        this.bgCtx = bgCanvasEl ? bgCanvasEl.getContext('2d') : null;
        this.cursorCanvas = cursorCanvasEl;
        this.cursorCtx = cursorCanvasEl ? cursorCanvasEl.getContext('2d') : null;

        this.resize();
        window.addEventListener('resize', this.resizeHandler);
        window.addEventListener('mousemove', this.mouseMoveHandler);

        this.setupBgMode(this.bgType);
        this.loop();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        if (this.bgCanvas) {
            this.bgCanvas.width = this.width;
            this.bgCanvas.height = this.height;
        }
        if (this.cursorCanvas) {
            this.cursorCanvas.width = this.width;
            this.cursorCanvas.height = this.height;
        }

        this.setupBgMode(this.bgType);
    }

    onMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.mouse.active = true;

        if (this.isCursorTrailEnabled) {
            this.cursorTrail.push({
                x: e.clientX,
                y: e.clientY,
                size: Math.random() * 6 + 3,
                alpha: 1,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5 - 0.5
            });

            if (this.cursorTrail.length > 35) {
                this.cursorTrail.shift();
            }
        }
    }

    setBgType(type) {
        this.bgType = type;
        this.setupBgMode(type);
    }

    setupBgMode(type) {
        this.particles = [];
        this.matrixCols = [];

        const primaryGlow = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow').trim() || '#a855f7';
        const secondaryGlow = getComputedStyle(document.documentElement).getPropertyValue('--secondary-glow').trim() || '#00f0ff';

        if (type === 'starfield') {
            const count = Math.floor((this.width * this.height) / 8000);
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: Math.random() * 2.2 + 0.5,
                    alpha: Math.random() * 0.8 + 0.2,
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: (Math.random() - 0.5) * 0.4,
                    color: i % 3 === 0 ? primaryGlow : i % 3 === 1 ? secondaryGlow : '#ffffff'
                });
            }
        } else if (type === 'matrix') {
            const cols = Math.floor(this.width / this.matrixCharSize);
            for (let i = 0; i < cols; i++) {
                this.matrixCols.push({
                    x: i * this.matrixCharSize,
                    y: Math.random() * -this.height,
                    speed: Math.random() * 5 + 3,
                    chars: '01010011 01011001 01010011 XYZK792345!@#$%^&*()_+='.split('')
                });
            }
        } else if (type === 'embers') {
            const count = Math.floor((this.width * this.height) / 6000);
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: Math.random() * 3 + 1,
                    alpha: Math.random() * 0.9 + 0.1,
                    speedX: (Math.random() - 0.5) * 0.8,
                    speedY: -Math.random() * 1.5 - 0.5,
                    color: i % 4 === 0 ? '#ef4444' : i % 4 === 1 ? '#f97316' : '#f59e0b' : '#dc2626'
                });
            }
        } else if (type === 'liquid') {
            // Liquid flow nodes
            for (let i = 0; i < 6; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    radius: Math.random() * 200 + 150,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: (Math.random() - 0.5) * 1.2,
                    color: i % 2 === 0 ? primaryGlow : secondaryGlow
                });
            }
        }
    }

    loop() {
        this.animId = requestAnimationFrame(() => this.loop());

        // 1. Draw Background Canvas
        if (this.bgCtx) {
            const ctx = this.bgCtx;
            ctx.clearRect(0, 0, this.width, this.height);

            const primaryGlow = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow').trim() || '#a855f7';
            const secondaryGlow = getComputedStyle(document.documentElement).getPropertyValue('--secondary-glow').trim() || '#00f0ff';

            if (this.bgType === 'starfield') {
                for (let p of this.particles) {
                    p.x += p.speedX;
                    p.y += p.speedY;

                    if (p.x < 0) p.x = this.width;
                    if (p.x > this.width) p.x = 0;
                    if (p.y < 0) p.y = this.height;
                    if (p.y > this.height) p.y = 0;

                    // Mouse repulsion
                    const dx = this.mouse.x - p.x;
                    const dy = this.mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const angle = Math.atan2(dy, dx);
                        p.x -= Math.cos(angle) * 1.5;
                        p.y -= Math.sin(angle) * 1.5;
                    }

                    ctx.save();
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            } else if (this.bgType === 'matrix') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.fillRect(0, 0, this.width, this.height);

                ctx.font = `${this.matrixCharSize}px 'Fira Code', monospace`;

                for (let col of this.matrixCols) {
                    const char = col.chars[Math.floor(Math.random() * col.chars.length)];
                    ctx.fillStyle = primaryGlow;
                    ctx.fillText(char, col.x, col.y);

                    if (col.y > this.height && Math.random() > 0.975) {
                        col.y = 0;
                    }
                    col.y += col.speed;
                }
            } else if (this.bgType === 'embers') {
                for (let p of this.particles) {
                    p.x += p.speedX;
                    p.y += p.speedY;

                    if (p.y < -10) {
                        p.y = this.height + 10;
                        p.x = Math.random() * this.width;
                    }

                    ctx.save();
                    ctx.globalAlpha = p.alpha;
                    ctx.shadowColor = p.color;
                    ctx.shadowBlur = 10;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            } else if (this.bgType === 'liquid') {
                ctx.fillStyle = 'rgba(5, 5, 12, 0.4)';
                ctx.fillRect(0, 0, this.width, this.height);

                for (let node of this.particles) {
                    node.x += node.vx;
                    node.y += node.vy;

                    if (node.x < 0 || node.x > this.width) node.vx *= -1;
                    if (node.y < 0 || node.y > this.height) node.vy *= -1;

                    const grad = ctx.createRadialGradient(node.x, node.y, 10, node.x, node.y, node.radius);
                    grad.addColorStop(0, node.color);
                    grad.addColorStop(1, 'transparent');

                    ctx.save();
                    ctx.globalCompositeOperation = 'screen';
                    ctx.globalAlpha = 0.35;
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        }

        // 2. Draw Cursor Particles
        if (this.cursorCtx && this.isCursorTrailEnabled) {
            const ctx = this.cursorCtx;
            ctx.clearRect(0, 0, this.width, this.height);

            const primaryGlow = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow').trim() || '#a855f7';

            for (let i = 0; i < this.cursorTrail.length; i++) {
                let pt = this.cursorTrail[i];
                pt.x += pt.vx;
                pt.y += pt.vy;
                pt.alpha -= 0.035;

                if (pt.alpha <= 0) {
                    this.cursorTrail.splice(i, 1);
                    i--;
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = pt.alpha;
                ctx.fillStyle = primaryGlow;
                ctx.shadowColor = primaryGlow;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, Math.max(0.5, pt.size * pt.alpha), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }
}

window.canvasEngine = new CanvasEngine();
