// Main App Controller & State Manager for Guns.lol / Feds.lol clone

class BioApp {
    constructor() {
        this.currentProfile = null;
        this.typewriterInterval = null;
        this.socialIconsMap = {
            discord: `<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .373-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`,
            twitter: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
            github: `<svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
            spotify: `<svg viewBox="0 0 24 24"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.72-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
            youtube: `<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
            twitch: `<svg viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143h-1.715zm4.715 0h1.714v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>`,
            instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
            telegram: `<svg viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
            steam: `<svg viewBox="0 0 24 24"><path d="M11.979 0C5.67 0 .501 4.893.02 11.1l4.982 2.06c.45-.63 1.177-1.045 2.003-1.045.12 0 .237.012.355.03l2.871-4.148v-.058c0-2.012 1.636-3.648 3.648-3.648 2.013 0 3.648 1.636 3.648 3.648 0 2.013-1.635 3.648-3.648 3.648-.073 0-.142-.014-.214-.018l-4.032 2.94c.023.14.041.282.041.428 0 1.488-1.207 2.694-2.695 2.694-1.258 0-2.308-.862-2.607-2.028L.141 13.9C1.196 19.67 6.22 24 12.288 24 18.91 24 24 18.627 24 12.006 24 5.38 18.604 0 11.979 0z"/></svg>`,
            tiktok: `<svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.3 1.75-.21.72-.1 1.53.27 2.18.45.82 1.34 1.38 2.27 1.47 1.09.11 2.2-.3 2.87-1.17.47-.6.7-1.37.69-2.13.01-4.71.01-9.43 0-14.14z"/></svg>`
        };
    }

    init() {
        this.loadProfileFromState();
        this.bindEvents();
        this.setup3dTilt();
        
        // Setup Visualizer Canvas
        const visCanvas = document.getElementById('visualizer-canvas');
        if (visCanvas && window.audioEngine) {
            window.audioEngine.setupVisualizerCanvas(visCanvas);
        }

        // Setup Background Canvas
        const bgCanvas = document.getElementById('bg-canvas');
        const cursorCanvas = document.getElementById('cursor-canvas');
        if (window.canvasEngine) {
            window.canvasEngine.init(bgCanvas, cursorCanvas);
            if (this.currentProfile && this.currentProfile.theme) {
                window.canvasEngine.setBgType(this.currentProfile.theme.bgType || 'starfield');
            }
        }
    }

    loadProfileFromState() {
        // Check for URL hash configuration (for shareable links)
        if (window.location.hash && window.location.hash.length > 5) {
            try {
                const encoded = window.location.hash.substring(1);
                const jsonStr = decodeURIComponent(atob(encoded));
                const parsed = JSON.parse(jsonStr);
                if (parsed && parsed.displayName) {
                    this.currentProfile = parsed;
                    this.applyProfile(this.currentProfile);
                    return;
                }
            } catch (e) {
                console.warn("Invalid hash profile link, falling back to storage/preset", e);
            }
        }

        // Check local storage
        const saved = localStorage.getItem('guns_lol_profile');
        if (saved) {
            try {
                this.currentProfile = JSON.parse(saved);
                this.applyProfile(this.currentProfile);
                return;
            } catch (e) {}
        }

        // Fallback to default preset (Cyberpunk)
        this.currentProfile = JSON.parse(JSON.stringify(window.BIO_PRESETS.cyberpunk));
        this.applyProfile(this.currentProfile);
    }

    saveCurrentProfile() {
        localStorage.setItem('guns_lol_profile', JSON.stringify(this.currentProfile));
    }

    applyProfile(p) {
        this.currentProfile = p;

        // 1. CSS Theme Variables
        const root = document.documentElement;
        root.style.setProperty('--primary-glow', p.theme.primaryGlow || '#a855f7');
        root.style.setProperty('--secondary-glow', p.theme.secondaryGlow || '#00f0ff');
        root.style.setProperty('--accent-color', p.theme.accentColor || '#ff007f');
        root.style.setProperty('--card-bg', p.theme.cardBg || 'rgba(15, 10, 25, 0.65)');
        root.style.setProperty('--card-border', p.theme.cardBorder || 'rgba(168, 85, 247, 0.35)');
        root.style.setProperty('--text-color', p.theme.textColor || '#ffffff');
        root.style.setProperty('--subtext-color', p.theme.subtextColor || '#94a3b8');
        root.style.setProperty('--font-family', p.theme.fontFamily || "'Space Grotesk', sans-serif");

        // 2. Avatar & Header
        const avatarEl = document.getElementById('avatar-img');
        if (avatarEl) avatarEl.src = p.avatar;

        const nameEl = document.getElementById('display-name-text');
        if (nameEl) nameEl.textContent = p.displayName;

        const handleEl = document.getElementById('profile-handle-text');
        if (handleEl) handleEl.textContent = `@${p.handle}`;

        const verIcon = document.getElementById('verified-icon');
        if (verIcon) verIcon.style.display = p.verified ? 'inline-flex' : 'none';

        // 3. Bio Text (with optional typewriter effect)
        const bioEl = document.getElementById('profile-bio-text');
        if (bioEl) {
            if (this.typewriterInterval) clearInterval(this.typewriterInterval);

            if (p.typewriter) {
                bioEl.innerHTML = '<span id="tw-content"></span><span class="typewriter-cursor"></span>';
                const twContent = document.getElementById('tw-content');
                let charIdx = 0;
                this.typewriterInterval = setInterval(() => {
                    if (charIdx < p.bio.length) {
                        twContent.textContent += p.bio.charAt(charIdx);
                        charIdx++;
                    } else {
                        clearInterval(this.typewriterInterval);
                    }
                }, 40);
            } else {
                bioEl.textContent = p.bio;
            }
        }

        // 4. Badges
        const badgesWrap = document.getElementById('badges-container');
        if (badgesWrap) {
            badgesWrap.innerHTML = '';
            if (p.badges && p.badges.length > 0) {
                p.badges.forEach(b => {
                    const badge = document.createElement('span');
                    badge.className = 'badge-item';
                    badge.style.borderColor = b.color || p.theme.primaryGlow;
                    badge.innerHTML = `<span style="color:${b.color}">${b.icon}</span> ${b.label}`;
                    badgesWrap.appendChild(badge);
                });
            }
        }

        // 5. Social Links
        const socialsWrap = document.getElementById('socials-grid');
        if (socialsWrap) {
            socialsWrap.innerHTML = '';
            if (p.socials && p.socials.length > 0) {
                p.socials.forEach(s => {
                    const iconSvg = this.socialIconsMap[s.platform.toLowerCase()] || `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
                    
                    const btn = document.createElement('a');
                    btn.className = 'social-btn';
                    btn.href = s.url;
                    btn.target = '_blank';
                    btn.rel = 'noopener noreferrer';
                    btn.innerHTML = `${iconSvg} <span class="social-text">${s.label || s.platform}</span>`;
                    
                    btn.addEventListener('click', (e) => {
                        if (window.audioEngine) window.audioEngine.playUiSound('click');
                    });
                    
                    socialsWrap.appendChild(btn);
                });
            }
        }

        // 6. Audio Player Info
        const trackTitleEl = document.getElementById('audio-title-text');
        if (trackTitleEl) trackTitleEl.textContent = p.audio.title || "Custom Audio Loop";

        const trackArtistEl = document.getElementById('audio-artist-text');
        if (trackArtistEl) trackArtistEl.textContent = p.audio.artist || "Guns.lol Soundscape";

        // 7. Discord Widget
        const discordWrap = document.getElementById('discord-widget');
        if (discordWrap && p.discordActivity) {
            const da = p.discordActivity;
            document.getElementById('discord-avatar').src = da.avatar;
            document.getElementById('discord-user').innerHTML = `${da.username} <span class="status-dot ${da.status}"></span>`;
            document.getElementById('discord-status-text').textContent = da.customStatus;
            document.getElementById('discord-game-detail').textContent = `${da.gameName} — ${da.details}`;
        }

        // 8. Stats (Views / Likes)
        const viewEl = document.getElementById('view-count-text');
        if (viewEl) viewEl.textContent = Number(p.viewCount || 0).toLocaleString();

        const likeEl = document.getElementById('like-count-text');
        if (likeEl) likeEl.textContent = Number(p.likesCount || 0).toLocaleString();

        // 9. Canvas Background & Effects
        if (window.canvasEngine) {
            window.canvasEngine.setBgType(p.theme.bgType || 'starfield');
            window.canvasEngine.isCursorTrailEnabled = p.theme.cursorTrail !== false;
        }

        const scanlinesEl = document.getElementById('scanlines-overlay');
        if (scanlinesEl) {
            scanlinesEl.classList.toggle('active', !!p.theme.scanlines);
        }

        const customBgEl = document.getElementById('custom-bg-overlay');
        if (customBgEl) {
            if (p.theme.customBgUrl && p.theme.customBgUrl.trim() !== '') {
                customBgEl.style.backgroundImage = `url("${p.theme.customBgUrl}")`;
                customBgEl.style.opacity = p.theme.bgOverlayOpacity || 0.5;
            } else {
                customBgEl.style.backgroundImage = 'none';
            }
        }
    }

    bindEvents() {
        // Enter Overlay Click
        const enterOverlay = document.getElementById('enter-overlay');
        if (enterOverlay) {
            enterOverlay.addEventListener('click', () => {
                enterOverlay.classList.add('hidden');
                
                // Play Enter Sound
                if (window.audioEngine) {
                    window.audioEngine.playUiSound('enter');
                    
                    // Start Background Music Track
                    if (this.currentProfile && this.currentProfile.audio && this.currentProfile.audio.autoplay) {
                        window.audioEngine.startTrack(this.currentProfile.audio);
                        const playerCard = document.getElementById('audio-player-card');
                        if (playerCard) playerCard.classList.add('playing');
                        const playIcon = document.getElementById('play-btn-icon');
                        if (playIcon) playIcon.textContent = '⏸';
                    }
                }
            });
        }

        // Audio Play/Pause Button
        const playBtn = document.getElementById('audio-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (!window.audioEngine) return;
                window.audioEngine.playUiSound('click');
                const playerCard = document.getElementById('audio-player-card');
                const playIcon = document.getElementById('play-btn-icon');

                if (window.audioEngine.isPlaying) {
                    window.audioEngine.stopTrack();
                    if (playerCard) playerCard.classList.remove('playing');
                    if (playIcon) playIcon.textContent = '▶';
                } else {
                    window.audioEngine.startTrack(this.currentProfile.audio);
                    if (playerCard) playerCard.classList.add('playing');
                    if (playIcon) playIcon.textContent = '⏸';
                }
            });
        }

        // Mute Button
        const muteBtn = document.getElementById('audio-mute-btn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                if (!window.audioEngine) return;
                const muted = window.audioEngine.toggleMute();
                muteBtn.textContent = muted ? '🔇' : '🔊';
            });
        }

        // Volume Slider
        const volSlider = document.getElementById('volume-slider');
        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                if (window.audioEngine) {
                    window.audioEngine.setVolume(parseFloat(e.target.value));
                }
            });
        }

        // Like Button Heart Trigger
        const likeBtn = document.getElementById('like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                if (window.audioEngine) window.audioEngine.playUiSound('heart');
                
                this.currentProfile.likesCount = (this.currentProfile.likesCount || 0) + 1;
                document.getElementById('like-count-text').textContent = Number(this.currentProfile.likesCount).toLocaleString();
                likeBtn.classList.add('liked');

                // Create Floating Hearts
                for (let i = 0; i < 5; i++) {
                    const heart = document.createElement('div');
                    heart.className = 'floating-heart';
                    heart.textContent = '❤️';
                    heart.style.left = `${e.clientX + (Math.random() - 0.5) * 40}px`;
                    heart.style.top = `${e.clientY + (Math.random() - 0.5) * 40}px`;
                    document.body.appendChild(heart);

                    setTimeout(() => heart.remove(), 1200);
                }

                this.saveCurrentProfile();
            });
        }

        // Customization Studio Modal Open/Close
        const openStudioBtn = document.getElementById('open-studio-btn');
        const studioModal = document.getElementById('studio-modal-backdrop');
        const closeStudioBtn = document.getElementById('close-studio-btn');

        if (openStudioBtn && studioModal) {
            openStudioBtn.addEventListener('click', () => {
                if (window.audioEngine) window.audioEngine.playUiSound('click');
                this.populateStudioForms();
                studioModal.classList.add('active');
            });
        }

        if (closeStudioBtn && studioModal) {
            closeStudioBtn.addEventListener('click', () => {
                if (window.audioEngine) window.audioEngine.playUiSound('click');
                studioModal.classList.remove('active');
            });
        }

        // Studio Tab Navigation
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(t => {
            t.addEventListener('click', () => {
                if (window.audioEngine) window.audioEngine.playUiSound('click');
                tabs.forEach(x => x.classList.remove('active'));
                t.classList.add('active');

                const targetTab = t.dataset.tab;
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.toggle('active', pane.id === `tab-${targetTab}`);
                });
            });
        });

        // Share Profile Link Button
        const shareBtn = document.getElementById('share-link-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (window.audioEngine) window.audioEngine.playUiSound('click');
                const jsonStr = JSON.stringify(this.currentProfile);
                const encoded = btoa(encodeURIComponent(jsonStr));
                const shareUrl = `${window.location.origin}${window.location.pathname}#${encoded}`;

                navigator.clipboard.writeText(shareUrl).then(() => {
                    this.showToast('✨ Shareable Bio Link copied to clipboard!');
                });
            });
        }
    }

    setup3dTilt() {
        const card = document.querySelector('.bio-card');
        if (!card) return;

        window.addEventListener('mousemove', (e) => {
            if (!this.currentProfile || this.currentProfile.theme.cardTilt === false) {
                document.documentElement.style.setProperty('--card-tilt-x', '0deg');
                document.documentElement.style.setProperty('--card-tilt-y', '0deg');
                return;
            }

            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            const angleX = (e.clientY - cardCenterY) / 35;
            const angleY = -(e.clientX - cardCenterX) / 35;

            document.documentElement.style.setProperty('--card-tilt-x', `${Math.max(-10, Math.min(10, angleX))}deg`);
            document.documentElement.style.setProperty('--card-tilt-y', `${Math.max(-10, Math.min(10, angleY))}deg`);
        });
    }

    populateStudioForms() {
        const p = this.currentProfile;
        if (!p) return;

        document.getElementById('input-display-name').value = p.displayName || '';
        document.getElementById('input-handle').value = p.handle || '';
        document.getElementById('input-avatar-url').value = p.avatar || '';
        document.getElementById('input-bio').value = p.bio || '';
        document.getElementById('input-typewriter').checked = !!p.typewriter;
        document.getElementById('input-verified').checked = !!p.verified;

        // Theme inputs
        document.getElementById('input-primary-glow').value = p.theme.primaryGlow || '#a855f7';
        document.getElementById('input-secondary-glow').value = p.theme.secondaryGlow || '#00f0ff';
        document.getElementById('input-card-bg').value = p.theme.cardBg || 'rgba(15, 10, 25, 0.65)';
        document.getElementById('input-font-family').value = p.theme.fontFamily || "'Space Grotesk', sans-serif";
        document.getElementById('input-bg-type').value = p.theme.bgType || 'starfield';
        document.getElementById('input-scanlines').checked = !!p.theme.scanlines;
        document.getElementById('input-card-tilt').checked = p.theme.cardTilt !== false;

        // Audio inputs
        document.getElementById('input-audio-title').value = p.audio.title || '';
        document.getElementById('input-audio-artist').value = p.audio.artist || '';
        document.getElementById('input-audio-track').value = p.audio.builtInTrack || 'synthwave';
        document.getElementById('input-audio-custom-url').value = p.audio.customUrl || '';
        document.getElementById('input-visualizer-style').value = p.audio.visualizerStyle || 'bars';

        // Bind Live Input Listeners
        this.bindStudioLiveInputs();
    }

    bindStudioLiveInputs() {
        const updateFromForm = () => {
            const p = this.currentProfile;

            p.displayName = document.getElementById('input-display-name').value;
            p.handle = document.getElementById('input-handle').value;
            p.avatar = document.getElementById('input-avatar-url').value;
            p.bio = document.getElementById('input-bio').value;
            p.typewriter = document.getElementById('input-typewriter').checked;
            p.verified = document.getElementById('input-verified').checked;

            p.theme.primaryGlow = document.getElementById('input-primary-glow').value;
            p.theme.secondaryGlow = document.getElementById('input-secondary-glow').value;
            p.theme.cardBg = document.getElementById('input-card-bg').value;
            p.theme.fontFamily = document.getElementById('input-font-family').value;
            p.theme.bgType = document.getElementById('input-bg-type').value;
            p.theme.scanlines = document.getElementById('input-scanlines').checked;
            p.theme.cardTilt = document.getElementById('input-card-tilt').checked;

            p.audio.title = document.getElementById('input-audio-title').value;
            p.audio.artist = document.getElementById('input-audio-artist').value;
            p.audio.builtInTrack = document.getElementById('input-audio-track').value;
            p.audio.customUrl = document.getElementById('input-audio-custom-url').value;
            p.audio.visualizerStyle = document.getElementById('input-visualizer-style').value;

            this.applyProfile(p);
            this.saveCurrentProfile();
        };

        const inputs = document.querySelectorAll('.studio-modal input, .studio-modal textarea, .studio-modal select');
        inputs.forEach(input => {
            input.oninput = updateFromForm;
            input.onchange = updateFromForm;
        });

        // Preset Quick Load Buttons
        const presetCards = document.querySelectorAll('.preset-card');
        presetCards.forEach(card => {
            card.onclick = () => {
                const presetId = card.dataset.preset;
                if (window.BIO_PRESETS[presetId]) {
                    if (window.audioEngine) window.audioEngine.playUiSound('click');
                    this.currentProfile = JSON.parse(JSON.stringify(window.BIO_PRESETS[presetId]));
                    this.applyProfile(this.currentProfile);
                    this.saveCurrentProfile();
                    this.populateStudioForms();
                    this.showToast(`Loaded "${window.BIO_PRESETS[presetId].name}" Preset!`);
                }
            };
        });
    }

    showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.textContent = msg;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new BioApp();
    window.app.init();
});
