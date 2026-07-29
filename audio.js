// Audio Engine & Web Audio API Synth Generator for Guns.lol / Feds.lol clone

class AudioController {
    constructor() {
        this.audioCtx = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.volume = 0.5;
        this.analyser = null;
        this.gainNode = null;
        this.htmlAudio = null;
        this.trackType = 'synthwave'; // synthwave, ambient, matrix, electro
        this.customUrl = '';
        this.synthTimer = null;
        this.frequencyData = new Uint8Array(64);
        
        // Visualizer Canvas context
        this.visualizerCanvas = null;
        this.visualizerCtx = null;
        this.animFrameId = null;
        this.visualizerStyle = 'bars';
    }

    initCtx() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 128;
            this.gainNode = this.audioCtx.createGain();
            this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
            
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
            
            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playUiSound(type = 'click') {
        try {
            this.initCtx();
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            const now = this.audioCtx.currentTime;

            if (type === 'enter') {
                // Futuristic riser sweep
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.35);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            } else if (type === 'heart') {
                // Cute blip-blip sound
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } else {
                // Short crisp click tick
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            }
        } catch (e) {
            console.warn("UI sound playback error:", e);
        }
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.gainNode && this.audioCtx) {
            this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
        }
        if (this.htmlAudio) {
            this.htmlAudio.volume = this.isMuted ? 0 : this.volume;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.setVolume(this.volume);
        return this.isMuted;
    }

    startTrack(config = {}) {
        this.initCtx();
        this.stopTrack();

        this.trackType = config.builtInTrack || 'synthwave';
        this.customUrl = config.customUrl || '';
        this.visualizerStyle = config.visualizerStyle || 'bars';

        if (this.customUrl && this.customUrl.trim() !== '') {
            this.playCustomUrl(this.customUrl);
        } else {
            this.playSynthTrack(this.trackType);
        }

        this.isPlaying = true;
        this.startVisualizer();
    }

    playCustomUrl(url) {
        try {
            if (this.htmlAudio) {
                this.htmlAudio.pause();
                this.htmlAudio = null;
            }
            this.htmlAudio = new Audio();
            this.htmlAudio.crossOrigin = "anonymous";
            this.htmlAudio.src = url;
            this.htmlAudio.loop = true;
            this.htmlAudio.volume = this.isMuted ? 0 : this.volume;

            const source = this.audioCtx.createMediaElementSource(this.htmlAudio);
            source.connect(this.gainNode);

            this.htmlAudio.play().catch(err => {
                console.warn("Custom audio stream failed or blocked, falling back to synth track:", err);
                this.playSynthTrack(this.trackType);
            });
        } catch (e) {
            console.warn("Custom Audio Error:", e);
            this.playSynthTrack(this.trackType);
        }
    }

    playSynthTrack(type) {
        // Procedural Web Audio synth loop generator for zero external assets!
        if (this.synthTimer) clearInterval(this.synthTimer);

        let step = 0;
        const bpm = type === 'electro' ? 128 : type === 'matrix' ? 110 : type === 'ambient' ? 70 : 95;
        const stepTime = (60 / bpm) / 4 * 1000;

        // Scales
        const synthwaveNotes = [130.81, 155.56, 174.61, 196.00, 233.08, 261.63, 311.13]; // C minor pentatonic
        const ambientNotes = [220, 261.63, 329.63, 392, 440, 523.25]; // A minor 7
        const matrixNotes = [110, 123.47, 130.81, 146.83, 164.81]; // Dark Cyber
        const electroNotes = [146.83, 174.61, 196.00, 220.00, 261.63];

        let notes = synthwaveNotes;
        if (type === 'ambient') notes = ambientNotes;
        if (type === 'matrix') notes = matrixNotes;
        if (type === 'electro') notes = electroNotes;

        const triggerStep = () => {
            if (!this.isPlaying || !this.audioCtx) return;
            const now = this.audioCtx.currentTime;

            // Bass Kick on 1 and 9
            if (step % 8 === 0) {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.connect(gain);
                gain.connect(this.gainNode);

                osc.frequency.setValueAtTime(type === 'ambient' ? 80 : 130, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

                gain.gain.setValueAtTime(type === 'ambient' ? 0.3 : 0.6, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

                osc.start(now);
                osc.stop(now + 0.2);
            }

            // Synth Note / Chord
            if (step % 2 === 0 || (type === 'synthwave' && step % 3 === 0)) {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                const filter = this.audioCtx.createBiquadFilter();

                const noteIndex = (step * 3 + Math.floor(step / 4)) % notes.length;
                const freq = notes[noteIndex];

                osc.type = type === 'matrix' ? 'sawtooth' : type === 'ambient' ? 'sine' : 'square';
                osc.frequency.setValueAtTime(freq, now);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(type === 'ambient' ? 400 : 1200, now);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.gainNode);

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (stepTime * 2 / 1000));

                osc.start(now);
                osc.stop(now + (stepTime * 2 / 1000));
            }

            // Hihat / Cyber Noise tick
            if (step % 4 === 2) {
                const bufferSize = this.audioCtx.sampleRate * 0.03;
                const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }

                const noise = this.audioCtx.createBufferSource();
                noise.buffer = buffer;

                const filter = this.audioCtx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(5000, now);

                const gain = this.audioCtx.createGain();
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.gainNode);

                noise.start(now);
            }

            step = (step + 1) % 32;
        };

        this.synthTimer = setInterval(triggerStep, stepTime);
    }

    stopTrack() {
        this.isPlaying = false;
        if (this.synthTimer) {
            clearInterval(this.synthTimer);
            this.synthTimer = null;
        }
        if (this.htmlAudio) {
            this.htmlAudio.pause();
            this.htmlAudio = null;
        }
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
    }

    setupVisualizerCanvas(canvasEl) {
        this.visualizerCanvas = canvasEl;
        if (canvasEl) {
            this.visualizerCtx = canvasEl.getContext('2d');
        }
    }

    startVisualizer() {
        if (!this.visualizerCanvas || !this.visualizerCtx) return;

        const draw = () => {
            if (!this.isPlaying) return;

            this.animFrameId = requestAnimationFrame(draw);

            const canvas = this.visualizerCanvas;
            const ctx = this.visualizerCtx;
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            if (this.analyser) {
                this.analyser.getByteFrequencyData(this.frequencyData);
            } else {
                // Fallback simulated data if audio context not ready
                for (let i = 0; i < this.frequencyData.length; i++) {
                    this.frequencyData[i] = Math.sin(Date.now() * 0.005 + i * 0.2) * 50 + 60;
                }
            }

            const primaryGlow = getComputedStyle(document.documentElement).getPropertyValue('--primary-glow').trim() || '#a855f7';
            const secondaryGlow = getComputedStyle(document.documentElement).getPropertyValue('--secondary-glow').trim() || '#00f0ff';

            if (this.visualizerStyle === 'wave') {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = primaryGlow;
                const sliceWidth = width / this.frequencyData.length;
                let x = 0;

                for (let i = 0; i < this.frequencyData.length; i++) {
                    const v = this.frequencyData[i] / 255.0;
                    const y = (v * height) / 2 + height / 4;

                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);

                    x += sliceWidth;
                }
                ctx.stroke();
            } else if (this.visualizerStyle === 'spectrum') {
                const barWidth = (width / this.frequencyData.length) * 1.5;
                let x = 0;

                for (let i = 0; i < this.frequencyData.length; i++) {
                    const barHeight = (this.frequencyData[i] / 255) * height * 0.85;

                    const grad = ctx.createLinearGradient(0, height, 0, 0);
                    grad.addColorStop(0, primaryGlow);
                    grad.addColorStop(1, secondaryGlow);

                    ctx.fillStyle = grad;
                    ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

                    x += barWidth;
                }
            } else {
                // 'bars' mode (Default)
                const numBars = 24;
                const barWidth = width / numBars - 2;

                for (let i = 0; i < numBars; i++) {
                    const index = Math.floor(i * (this.frequencyData.length / numBars));
                    const val = this.frequencyData[index] || 0;
                    const barHeight = Math.max(3, (val / 255) * height);

                    const grad = ctx.createLinearGradient(0, height, 0, 0);
                    grad.addColorStop(0, primaryGlow);
                    grad.addColorStop(1, secondaryGlow);

                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(i * (barWidth + 2), height - barHeight, barWidth, barHeight, [3, 3, 0, 0]);
                    } else {
                        ctx.rect(i * (barWidth + 2), height - barHeight, barWidth, barHeight);
                    }
                    ctx.fill();
                }
            }
        };

        draw();
    }
}

window.audioEngine = new AudioController();
