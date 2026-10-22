/**
 * Gulper.io - Advanced Neon Cyber Snake Engine
 * Authentic Slither & Gulper physics: True Thickness/Volume Scaling,
 * Continuous Glowing Spline Rendering, High-Intelligence AI, 60FPS.
 */

(function () {
  'use strict';

  const WORLD_RADIUS = 2000; // Large arena
  const BASE_SPEED = 3.6;
  const BOOST_SPEED = 7.2;
  const BASE_RADIUS = 13; // Starting snake thickness
  const MAX_RADIUS = 65;  // Colossal boss thickness
  const MIN_BOOST_LENGTH = 16;

  const BOT_NAMES = [
    'NeonStriker', 'CyberViper', 'GlowWorm', 'QuantumPulse', 'ByteCrusher',
    'SolarDrifter', 'ApexPredator', 'VoltRunner', 'ZeroLag', 'HyperLoop',
    'ShadowFang', 'NebulaSnake', 'PixelGhost', 'LaserTail', 'ElectroEel',
    'ChronoShift', 'Vortex99', 'CosmicSlither', 'TurboWorm', 'Specter',
    'PhantomGlow', 'AlphaWorm', 'Synthetix', 'VectorRider', 'BioHazard'
  ];

  const SKINS = [
    { name: 'Cyber Cyan', glow: '#00f7ff', core: '#ffffff', body: '#00adb5', light: '#70fbff' },
    { name: 'Plasma Pink', glow: '#ff00aa', core: '#ffffff', body: '#cf0088', light: '#ff66cb' },
    { name: 'Solar Gold', glow: '#ffd200', core: '#ffffff', body: '#d4aa00', light: '#ffe875' },
    { name: 'Toxic Lime', glow: '#00ff66', core: '#ffffff', body: '#00b846', light: '#73ffab' },
    { name: 'Electric Violet', glow: '#b026ff', core: '#ffffff', body: '#7b00cc', light: '#d380ff' },
    { name: 'Inferno Orange', glow: '#ff5500', core: '#ffffff', body: '#cc4400', light: '#ff945c' },
    { name: 'Ice Blue', glow: '#0099ff', core: '#ffffff', body: '#0066cc', light: '#80c8ff' }
  ];

  class Particle {
    constructor(x, y, color, speedMul = 1.0) {
      this.x = x;
      this.y = y;
      this.color = color;
      const ang = Math.random() * Math.PI * 2;
      const spd = (0.8 + Math.random() * 3.0) * speedMul;
      this.vx = Math.cos(ang) * spd;
      this.vy = Math.sin(ang) * spd;
      this.alpha = 1.0;
      this.size = 2.5 + Math.random() * 3.5;
      this.decay = 0.02 + Math.random() * 0.03;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      return this.alpha > 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Food {
    constructor(x, y, mass = 1, color = null) {
      this.x = x;
      this.y = y;
      this.mass = mass;
      // Visual size scales with mass
      this.radius = Math.min(3.5 + Math.sqrt(mass) * 2.2, 16);
      this.color = color || SKINS[Math.floor(Math.random() * SKINS.length)].glow;
      this.pulse = Math.random() * Math.PI * 2;
      this.isDrifting = mass >= 3;
      this.vx = (Math.random() - 0.5) * (this.isDrifting ? 0.8 : 0.15);
      this.vy = (Math.random() - 0.5) * (this.isDrifting ? 0.8 : 0.15);
    }

    update() {
      this.pulse += 0.05;
      if (this.isDrifting) {
        this.x += this.vx;
        this.y += this.vy;
        const dist = Math.hypot(this.x, this.y);
        if (dist > WORLD_RADIUS - 30) {
          const angle = Math.atan2(this.y, this.x);
          this.x = Math.cos(angle) * (WORLD_RADIUS - 35);
          this.y = Math.sin(angle) * (WORLD_RADIUS - 35);
          this.vx *= -1;
          this.vy *= -1;
        }
      }
    }

    draw(ctx) {
      const p = Math.sin(this.pulse) * (this.mass >= 3 ? 2.5 : 1.2);
      const r = Math.max(2.5, this.radius + p);

      ctx.save();
      // Outer ambient neon aura
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.mass >= 3 ? 14 : 7;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Bright incandescent center
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, r * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Snake {
    constructor(id, name, skin, isPlayer = false, x = 0, y = 0) {
      this.id = id;
      this.name = name;
      this.skin = skin;
      this.isPlayer = isPlayer;

      this.x = x;
      this.y = y;
      this.angle = Math.random() * Math.PI * 2;
      this.targetAngle = this.angle;
      this.turnRate = 0.095;

      this.speed = BASE_SPEED;
      this.isBoosting = false;
      this.boostCooldown = 0;

      // Score and Length tracking
      this.score = isPlayer ? 100 : 100 + Math.floor(Math.random() * 450);
      this.length = Math.max(20, Math.floor(this.score / 6));
      this.radius = BASE_RADIUS;
      this.kills = 0;
      this.isDead = false;

      // Energy pulse wave along spine
      this.waveOffset = 0;

      // Recalculate physical thickness based on score
      this.updateThickness();

      // Initialize segments
      this.segments = [];
      const spacing = this.getSpacing();
      for (let i = 0; i < this.length; i++) {
        this.segments.push({
          x: this.x - Math.cos(this.angle) * i * spacing,
          y: this.y - Math.sin(this.angle) * i * spacing
        });
      }

      // AI specific parameters
      this.aiTimer = 0;
      this.aiState = 'forage';
    }

    // Noticeable, tactile growth formula:
    // score 100 -> radius 13
    // score 400 -> radius 18
    // score 1,000 -> radius 24
    // score 3,000 -> radius 34
    // score 10,000 -> radius 52
    updateThickness() {
      const growth = Math.pow(Math.max(0, this.score - 80), 0.44) * 0.85;
      this.radius = Math.min(BASE_RADIUS + growth, MAX_RADIUS);
      // Turn rate slightly slows down as snake becomes a leviathan
      this.turnRate = Math.max(0.048, 0.095 - (this.radius - BASE_RADIUS) * 0.001);
    }

    getSpacing() {
      // Dynamic spacing keeps segments seamlessly overlapping without clumping
      return Math.max(6.5, this.radius * 0.58);
    }

    update(foods, snakes, particles, soundEngine) {
      if (this.isDead) return;

      this.waveOffset += 0.15;
      this.updateThickness();

      // 1. Boost mechanics
      if (this.isBoosting && this.score > 60) {
        this.speed = BOOST_SPEED;
        this.boostCooldown++;

        // Burn mass every 4 frames
        if (this.boostCooldown % 4 === 0) {
          this.score = Math.max(50, Math.floor(this.score - 2));
          this.length = Math.max(16, Math.floor(this.score / 6));

          // Drop glowing mass pellet from tail
          const tail = this.segments[this.segments.length - 1];
          if (tail && Math.random() < 0.4) {
            foods.push(new Food(tail.x, tail.y, 1, this.skin.glow));
          }

          // Emit vibrant neon thruster sparks
          if (tail) {
            particles.push(new Particle(tail.x, tail.y, this.skin.glow, 1.3));
          }
        }
      } else {
        this.speed = BASE_SPEED;
        this.boostCooldown = 0;
        this.isBoosting = false;
      }

      // 2. Smooth turning
      let diff = this.targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += Math.sign(diff) * Math.min(Math.abs(diff), this.turnRate);

      // 3. Move Head
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.segments[0].x = this.x;
      this.segments[0].y = this.y;

      // 4. Update body segments with dynamic spacing
      const spacing = this.getSpacing();
      for (let i = 1; i < this.segments.length; i++) {
        const prev = this.segments[i - 1];
        const curr = this.segments[i];
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        const dist = Math.hypot(dx, dy);

        if (dist > spacing) {
          const segAngle = Math.atan2(dy, dx);
          curr.x = prev.x - Math.cos(segAngle) * spacing;
          curr.y = prev.y - Math.sin(segAngle) * spacing;
        }
      }

      // Add or remove segments smoothly
      const targetCount = Math.max(16, Math.floor(this.length));
      while (this.segments.length < targetCount) {
        const last = this.segments[this.segments.length - 1];
        this.segments.push({ x: last.x, y: last.y });
      }
      while (this.segments.length > targetCount && this.segments.length > 16) {
        this.segments.pop();
      }

      // 5. Arena Wall Collision
      const distFromCenter = Math.hypot(this.x, this.y);
      if (distFromCenter > WORLD_RADIUS) {
        this.die(foods, particles, soundEngine);
        return;
      }

      // 6. AI Logic
      if (!this.isPlayer) {
        this.updateAI(foods, snakes);
      }
    }

    updateAI(foods, snakes) {
      this.aiTimer++;

      // Turn inward when nearing arena border
      const distFromCenter = Math.hypot(this.x, this.y);
      if (distFromCenter > WORLD_RADIUS * 0.84) {
        this.targetAngle = Math.atan2(-this.y, -this.x);
        return;
      }

      // Obstacle avoidance (Raycasting ahead)
      let obstacleAhead = false;
      const lookAheadDist = 120 + this.speed * 9;
      const checkAngles = [0, -0.45, 0.45, -0.85, 0.85];

      for (const angOffset of checkAngles) {
        const probeX = this.x + Math.cos(this.angle + angOffset) * lookAheadDist;
        const probeY = this.y + Math.sin(this.angle + angOffset) * lookAheadDist;

        for (let j = 0; j < snakes.length; j++) {
          const other = snakes[j];
          if (other === this || other.isDead) continue;

          // Check every 3rd segment
          for (let s = 0; s < other.segments.length; s += 3) {
            const seg = other.segments[s];
            if (Math.hypot(probeX - seg.x, probeY - seg.y) < other.radius + this.radius * 0.7) {
              obstacleAhead = true;
              this.targetAngle = this.angle + (angOffset >= 0 ? -1.3 : 1.3);
              this.isBoosting = false;
              break;
            }
          }
          if (obstacleAhead) break;
        }
        if (obstacleAhead) break;
      }

      if (obstacleAhead) return;

      // Periodic foraging & target seeking
      if (this.aiTimer % 14 === 0) {
        let nearestFood = null;
        let minDist = 480;

        for (let i = 0; i < foods.length; i += 2) {
          const f = foods[i];
          const d = Math.hypot(this.x - f.x, this.y - f.y);
          if (d < minDist) {
            minDist = d;
            nearestFood = f;
          }
        }

        if (nearestFood) {
          this.targetAngle = Math.atan2(nearestFood.y - this.y, nearestFood.x - this.x);
          // Boost if food is a high-value cluster
          if (nearestFood.mass >= 3 && minDist < 220 && this.score > 250) {
            this.isBoosting = true;
          } else {
            this.isBoosting = false;
          }
        } else {
          // Wander smoothly
          this.targetAngle += (Math.random() - 0.5) * 0.35;
          this.isBoosting = false;
        }
      }
    }

    die(foods, particles, soundEngine) {
      if (this.isDead) return;
      this.isDead = true;

      // Shatter body segments into high-value glowing energy orbs!
      const step = Math.max(1, Math.floor(this.segments.length / 32));
      for (let i = 0; i < this.segments.length; i += step) {
        const seg = this.segments[i];
        const mass = 3 + Math.floor(Math.random() * 5);
        foods.push(new Food(
          seg.x + (Math.random() - 0.5) * 20,
          seg.y + (Math.random() - 0.5) * 20,
          mass,
          this.skin.glow
        ));
      }

      // Explosion sparks
      for (let i = 0; i < 28; i++) {
        particles.push(new Particle(this.x, this.y, this.skin.glow, 1.8));
      }

      if (this.isPlayer) {
        soundEngine.playExplosion();
      }
    }

    draw(ctx, viewX, viewY, viewW, viewH) {
      if (this.isDead || this.segments.length < 2) return;

      const head = this.segments[0];
      const boundMargin = 350;
      if (
        head.x < viewX - boundMargin ||
        head.x > viewX + viewW + boundMargin ||
        head.y < viewY - boundMargin ||
        head.y > viewY + viewH + boundMargin
      ) {
        return;
      }

      ctx.save();

      const segCount = this.segments.length;

      // -------------------------------------------------------------
      // Pass 1: Neon Aura Glow Layer
      // -------------------------------------------------------------
      ctx.shadowColor = this.skin.glow;
      ctx.shadowBlur = this.isBoosting ? 22 : 12;

      // Draw continuous glowing tubular body from tail to head
      for (let i = segCount - 1; i >= 0; i -= 2) {
        const seg = this.segments[i];
        // Tail tapers down smoothly over the last 15 segments
        const taper = i > segCount - 15 ? 0.4 + 0.6 * ((segCount - i) / 15) : 1.0;
        const r = this.radius * taper;

        ctx.fillStyle = this.skin.glow;
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, r * 1.08, 0, Math.PI * 2);
        ctx.fill();
      }

      // -------------------------------------------------------------
      // Pass 2: High-Saturation Cylindrical Body Core with 3D Depth
      // -------------------------------------------------------------
      ctx.shadowBlur = 0;
      for (let i = segCount - 1; i >= 0; i -= 2) {
        const seg = this.segments[i];
        const taper = i > segCount - 15 ? 0.4 + 0.6 * ((segCount - i) / 15) : 1.0;
        const r = (this.radius - 2.5) * taper;

        if (r > 1.5) {
          ctx.fillStyle = this.skin.body;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2);
          ctx.fill();

          // Top cylindrical highlight
          ctx.fillStyle = this.skin.light;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, r * 0.65, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // -------------------------------------------------------------
      // Pass 3: Central Fiber-Optic Laser Spine
      // -------------------------------------------------------------
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.lineWidth = Math.max(2, this.radius * 0.28);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(this.segments[0].x, this.segments[0].y);
      for (let i = 1; i < segCount; i += 2) {
        ctx.lineTo(this.segments[i].x, this.segments[i].y);
      }
      ctx.stroke();

      // -------------------------------------------------------------
      // Pass 4: Head & Cyber Eyes
      // -------------------------------------------------------------
      this.drawHead(ctx);

      // -------------------------------------------------------------
      // Pass 5: Nickname Tag
      // -------------------------------------------------------------
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#000000';
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 12px "Figtree", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, this.x, this.y - this.radius - 10);

      ctx.restore();
    }

    drawHead(ctx) {
      const hx = this.x;
      const hy = this.y;
      const headR = this.radius * 1.18;

      ctx.save();

      // Head Glowing Disc
      ctx.fillStyle = this.skin.glow;
      ctx.shadowColor = this.skin.glow;
      ctx.shadowBlur = this.isBoosting ? 24 : 14;
      ctx.beginPath();
      ctx.arc(hx, hy, headR, 0, Math.PI * 2);
      ctx.fill();

      // Head Core
      ctx.shadowBlur = 0;
      ctx.fillStyle = this.skin.body;
      ctx.beginPath();
      ctx.arc(hx, hy, headR - 3, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Visor / Brow Plate
      ctx.fillStyle = this.skin.light;
      ctx.beginPath();
      ctx.arc(hx, hy, headR * 0.6, 0, Math.PI * 2);
      ctx.fill();

      // Expressive Cyber Eyes
      const eyeOffsetForward = headR * 0.45;
      const eyeOffsetSide = headR * 0.62;
      const eyeR = Math.max(4, headR * 0.38);

      const lx = hx + Math.cos(this.angle) * eyeOffsetForward + Math.cos(this.angle - Math.PI / 2) * eyeOffsetSide;
      const ly = hy + Math.sin(this.angle) * eyeOffsetForward + Math.sin(this.angle - Math.PI / 2) * eyeOffsetSide;

      const rx = hx + Math.cos(this.angle) * eyeOffsetForward + Math.cos(this.angle + Math.PI / 2) * eyeOffsetSide;
      const ry = hy + Math.sin(this.angle) * eyeOffsetForward + Math.sin(this.angle + Math.PI / 2) * eyeOffsetSide;

      // Eye Whites
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(lx, ly, eyeR, 0, Math.PI * 2);
      ctx.arc(rx, ry, eyeR, 0, Math.PI * 2);
      ctx.fill();

      // Pupils looking in heading direction
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#060a12';
      const pupilShift = eyeR * 0.42;
      const plx = lx + Math.cos(this.angle) * pupilShift;
      const ply = ly + Math.sin(this.angle) * pupilShift;
      const prx = rx + Math.cos(this.angle) * pupilShift;
      const pry = ry + Math.sin(this.angle) * pupilShift;

      ctx.beginPath();
      ctx.arc(plx, ply, eyeR * 0.58, 0, Math.PI * 2);
      ctx.arc(prx, pry, eyeR * 0.58, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  class GameEngine {
    constructor() {
      this.canvas = document.getElementById('gameCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.soundEngine = window.soundEngine;

      this.snakes = [];
      this.foods = [];
      this.particles = [];
      this.player = null;

      this.camera = { x: 0, y: 0, zoom: 1.0, targetZoom: 1.0 };
      this.mouse = { x: 0, y: 0, isDown: false };
      this.isPlaying = false;
      this.selectedSkinIndex = 0;

      // Clean up any historical float strings from localStorage
      const rawBest = localStorage.getItem('gulper_best') || '0';
      this.bestScore = Math.floor(parseFloat(rawBest)) || 0;
      localStorage.setItem('gulper_best', this.bestScore.toString());

      this.initDPI();
      this.bindEvents();
      this.renderSkinSelector();
      this.updateScoresUI();
    }

    initDPI() {
      const container = this.canvas.parentElement;
      const w = container.clientWidth;
      const h = container.clientHeight || 620;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.ctx.scale(dpr, dpr);
      this.displayWidth = w;
      this.displayHeight = h;
    }

    bindEvents() {
      window.addEventListener('resize', () => this.initDPI());

      // Mouse controls
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;

        if (this.player && !this.player.isDead) {
          const cx = this.displayWidth / 2;
          const cy = this.displayHeight / 2;
          this.player.targetAngle = Math.atan2(this.mouse.y - cy, this.mouse.x - cx);
        }
      });

      this.canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
          this.mouse.isDown = true;
          if (this.player && !this.player.isDead) {
            this.player.isBoosting = true;
            this.soundEngine.startBoost();
          }
        }
      });

      window.addEventListener('mouseup', () => {
        this.mouse.isDown = false;
        if (this.player) {
          this.player.isBoosting = false;
          this.soundEngine.stopBoost();
        }
      });

      // Spacebar boost
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.repeat) {
          e.preventDefault();
          if (this.player && !this.player.isDead) {
            this.player.isBoosting = true;
            this.soundEngine.startBoost();
          }
        }
        if (e.code === 'Enter') {
          const startModal = document.getElementById('startModal');
          if (startModal && startModal.style.display !== 'none') {
            this.startGame();
          }
        }
      });

      window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
          if (this.player) {
            this.player.isBoosting = false;
            this.soundEngine.stopBoost();
          }
        }
      });

      // Touch controls
      this.canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const t = e.touches[0];
        const tx = t.clientX - rect.left;
        const ty = t.clientY - rect.top;
        const cx = this.displayWidth / 2;
        const cy = this.displayHeight / 2;

        if (this.player && !this.player.isDead) {
          this.player.targetAngle = Math.atan2(ty - cy, tx - cx);
        }
      }, { passive: false });

      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
          if (this.player && !this.player.isDead) {
            this.player.isBoosting = true;
            this.soundEngine.startBoost();
          }
        }
      }, { passive: true });

      this.canvas.addEventListener('touchend', (e) => {
        if (e.touches.length <= 1 && this.player) {
          this.player.isBoosting = false;
          this.soundEngine.stopBoost();
        }
      });

      // Buttons
      document.getElementById('btnStartGame').addEventListener('click', () => this.startGame());
      document.getElementById('btnPlayAgain').addEventListener('click', () => this.startGame());

      document.getElementById('btnMute').addEventListener('click', () => {
        const isMuted = this.soundEngine.toggleMute();
        document.getElementById('btnMute').classList.toggle('active', isMuted);
      });

      document.getElementById('btnFullscreen').addEventListener('click', () => {
        const stage = document.getElementById('gameContainer');
        if (!document.fullscreenElement) {
          stage.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    renderSkinSelector() {
      const container = document.getElementById('skinSelector');
      if (!container) return;
      container.innerHTML = '';

      SKINS.forEach((skin, idx) => {
        const chip = document.createElement('button');
        chip.className = `skin-chip ${idx === this.selectedSkinIndex ? 'selected' : ''}`;
        chip.style.borderColor = skin.glow;
        chip.style.background = `radial-gradient(circle, ${skin.light} 30%, ${skin.glow} 100%)`;
        chip.title = skin.name;
        chip.addEventListener('click', () => {
          this.selectedSkinIndex = idx;
          document.querySelectorAll('.skin-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
        });
        container.appendChild(chip);
      });
    }

    startGame() {
      this.soundEngine.init();
      const nameInput = document.getElementById('playerNameInput');
      const nickname = (nameInput.value.trim() || 'NeonGlow').substring(0, 14);

      // Hide Modals
      document.getElementById('startModal').style.display = 'none';
      document.getElementById('gameOverModal').close();

      // Reset entities
      this.foods = [];
      this.particles = [];
      this.snakes = [];

      // Spawn 650 ambient pellets
      for (let i = 0; i < 650; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * (WORLD_RADIUS - 60);
        this.foods.push(new Food(Math.cos(ang) * dist, Math.sin(ang) * dist, 1));
      }

      // Spawn 45 drifting high-energy spheres
      for (let i = 0; i < 45; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * (WORLD_RADIUS - 120);
        this.foods.push(new Food(Math.cos(ang) * dist, Math.sin(ang) * dist, 3 + Math.floor(Math.random() * 4)));
      }

      // Create Player
      const playerSkin = SKINS[this.selectedSkinIndex];
      this.player = new Snake('player', nickname, playerSkin, true, 0, 0);
      this.snakes.push(this.player);

      // Spawn 22 AI Bots
      for (let i = 0; i < 22; i++) {
        this.spawnBot(i);
      }

      this.isPlaying = true;
      this.camera.x = 0;
      this.camera.y = 0;
      this.camera.zoom = 1.0;

      if (!this.rafId) {
        this.loop = this.loop.bind(this);
        this.rafId = requestAnimationFrame(this.loop);
      }
    }

    spawnBot(idx) {
      const name = BOT_NAMES[idx % BOT_NAMES.length] || `Snake${idx}`;
      const skin = SKINS[idx % SKINS.length];
      const ang = Math.random() * Math.PI * 2;
      const dist = 350 + Math.random() * (WORLD_RADIUS - 500);
      const bx = Math.cos(ang) * dist;
      const by = Math.sin(ang) * dist;

      const bot = new Snake(`bot_${Date.now()}_${idx}`, name, skin, false, bx, by);
      this.snakes.push(bot);
    }

    update() {
      // Replenish food
      if (this.foods.length < 580) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * (WORLD_RADIUS - 60);
        this.foods.push(new Food(Math.cos(ang) * dist, Math.sin(ang) * dist, 1));
      }

      // Update Foods
      for (let i = 0; i < this.foods.length; i++) {
        this.foods[i].update();
      }

      // Update Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        if (!this.particles[i].update()) {
          this.particles.splice(i, 1);
        }
      }

      // Update Snakes
      for (let i = 0; i < this.snakes.length; i++) {
        this.snakes[i].update(this.foods, this.snakes, this.particles, this.soundEngine);
      }

      // Head-to-Food collisions (Significant growth when eating!)
      for (let s = 0; s < this.snakes.length; s++) {
        const snake = this.snakes[s];
        if (snake.isDead) continue;

        for (let f = this.foods.length - 1; f >= 0; f--) {
          const food = this.foods[f];
          const dist = Math.hypot(snake.x - food.x, snake.y - food.y);
          if (dist < snake.radius + food.radius + 8) {
            // Volume and score scaling
            snake.score = Math.floor(snake.score + food.mass * 12);
            snake.length = Math.max(16, Math.floor(snake.score / 6));
            this.foods.splice(f, 1);

            if (snake.isPlayer) {
              this.soundEngine.playEat(food.mass);
              this.updateScoresUI();
            }
          }
        }
      }

      // Snake-to-Snake collisions (Head vs Other Body)
      for (let i = 0; i < this.snakes.length; i++) {
        const s1 = this.snakes[i];
        if (s1.isDead) continue;

        for (let j = 0; j < this.snakes.length; j++) {
          const s2 = this.snakes[j];
          if (s1 === s2 || s2.isDead) continue;

          // Check if s1 head hit any body segment of s2
          for (let k = 0; k < s2.segments.length; k += 2) {
            const seg = s2.segments[k];
            const dist = Math.hypot(s1.x - seg.x, s1.y - seg.y);
            if (dist < s1.radius + s2.radius * 0.72) {
              s1.die(this.foods, this.particles, this.soundEngine);
              s2.kills++;

              if (s2.isPlayer) {
                this.soundEngine.playKill();
                // Rewarding bonus score for kills
                s2.score = Math.floor(s2.score + 250);
                s2.length = Math.max(16, Math.floor(s2.score / 6));
                this.updateScoresUI();
              }
              if (s1.isPlayer) {
                this.onPlayerDeath();
              }
              break;
            }
          }
          if (s1.isDead) break;
        }
      }

      // Clean up dead bots and respawn
      for (let i = this.snakes.length - 1; i >= 0; i--) {
        const s = this.snakes[i];
        if (s.isDead && !s.isPlayer) {
          this.snakes.splice(i, 1);
          setTimeout(() => {
            if (this.isPlaying) this.spawnBot(Math.floor(Math.random() * BOT_NAMES.length));
          }, 1800 + Math.random() * 2000);
        }
      }

      // Camera smooth Lerp & dynamic zoom based on size
      if (this.player && !this.player.isDead) {
        this.camera.x += (this.player.x - this.camera.x) * 0.08;
        this.camera.y += (this.player.y - this.camera.y) * 0.08;

        // Camera zooms out smoothly as player grows larger
        const targetZoom = Math.max(0.42, 1.0 / (1.0 + Math.pow(this.player.score / 350, 0.4) * 0.4));
        this.camera.zoom += (targetZoom - this.camera.zoom) * 0.04;
      }
    }

    onPlayerDeath() {
      this.soundEngine.stopBoost();

      const finalScore = Math.floor(this.player.score);
      const finalLength = Math.floor(this.player.length);

      if (finalScore > this.bestScore) {
        this.bestScore = finalScore;
        localStorage.setItem('gulper_best', this.bestScore.toString());
      }

      // Always format as pure integers with commas
      document.getElementById('modalScore').textContent = finalScore.toLocaleString();
      document.getElementById('modalLength').textContent = finalLength.toLocaleString();
      document.getElementById('modalKills').textContent = this.player.kills;
      document.getElementById('modalBest').textContent = this.bestScore.toLocaleString();

      setTimeout(() => {
        document.getElementById('gameOverModal').showModal();
      }, 700);
    }

    updateScoresUI() {
      if (!this.player) return;
      const curScore = Math.floor(this.player.score);
      const curLength = Math.floor(this.player.length);
      const best = Math.floor(this.bestScore);

      document.getElementById('hudScore').textContent = curScore.toLocaleString();
      document.getElementById('hudLength').textContent = curLength.toLocaleString();
      document.getElementById('hudKills').textContent = this.player.kills;
      document.getElementById('hudBest').textContent = best.toLocaleString();
    }

    draw() {
      const ctx = this.ctx;
      const w = this.displayWidth;
      const h = this.displayHeight;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(this.camera.zoom, this.camera.zoom);
      ctx.translate(-this.camera.x, -this.camera.y);

      const viewW = w / this.camera.zoom;
      const viewH = h / this.camera.zoom;
      const viewX = this.camera.x - viewW / 2;
      const viewY = this.camera.y - viewH / 2;

      // 1. Draw High-Tech Cyber Grid
      this.drawGrid(ctx, viewX, viewY, viewW, viewH);

      // 2. Draw Pulsing Neon Perimeter
      this.drawPerimeter(ctx);

      // 3. Draw Foods
      for (let i = 0; i < this.foods.length; i++) {
        const f = this.foods[i];
        if (
          f.x >= viewX - 25 && f.x <= viewX + viewW + 25 &&
          f.y >= viewY - 25 && f.y <= viewY + viewH + 25
        ) {
          f.draw(ctx);
        }
      }

      // 4. Draw Particles
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].draw(ctx);
      }

      // 5. Draw Other Snakes first
      for (let i = 0; i < this.snakes.length; i++) {
        if (!this.snakes[i].isPlayer) {
          this.snakes[i].draw(ctx, viewX, viewY, viewW, viewH);
        }
      }

      // 6. Draw Player Snake last so it renders on top
      if (this.player && !this.player.isDead) {
        this.player.draw(ctx, viewX, viewY, viewW, viewH);
      }

      ctx.restore();

      // Screen-space UI Overlays
      this.drawLeaderboard(ctx);
      this.drawMinimap(ctx);
    }

    drawGrid(ctx, vx, vy, vw, vh) {
      const gridSize = 70;
      const startX = Math.floor(vx / gridSize) * gridSize;
      const startY = Math.floor(vy / gridSize) * gridSize;

      ctx.strokeStyle = '#0e1828';
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let x = startX; x <= vx + vw + gridSize; x += gridSize) {
        ctx.moveTo(x, vy - gridSize);
        ctx.lineTo(x, vy + vh + gridSize);
      }
      for (let y = startY; y <= vy + vh + gridSize; y += gridSize) {
        ctx.moveTo(vx - gridSize, y);
        ctx.lineTo(vx + vw + gridSize, y);
      }
      ctx.stroke();

      // Grid node crosshairs
      ctx.fillStyle = '#182b45';
      for (let x = startX; x <= vx + vw + gridSize; x += gridSize) {
        for (let y = startY; y <= vy + vh + gridSize; y += gridSize) {
          ctx.fillRect(x - 2, y - 2, 4, 4);
        }
      }
    }

    drawPerimeter(ctx) {
      ctx.save();
      // Outer electric neon cyan circle
      ctx.strokeStyle = '#00f7ff';
      ctx.shadowColor = '#00f7ff';
      ctx.shadowBlur = 24;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 0, WORLD_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // Inner danger warning dashed line
      ctx.strokeStyle = 'rgba(255, 40, 90, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([14, 14]);
      ctx.beginPath();
      ctx.arc(0, 0, WORLD_RADIUS - 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    drawLeaderboard(ctx) {
      const sorted = [...this.snakes].filter(s => !s.isDead).sort((a, b) => b.score - a.score);
      const top8 = sorted.slice(0, 7);

      const boxW = 180;
      const boxH = 38 + top8.length * 20 + 8;
      const px = this.displayWidth - boxW - 14;
      const py = 14;

      ctx.save();
      // Frosted Glass Panel
      ctx.fillStyle = 'rgba(7, 12, 22, 0.82)';
      ctx.strokeStyle = 'rgba(0, 247, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(px, py, boxW, boxH, 12);
      ctx.fill();
      ctx.stroke();

      // Title
      ctx.fillStyle = '#00f7ff';
      ctx.font = '800 11px "Dela Gothic One", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ LEADERBOARD', px + boxW / 2, py + 20);

      // Rows
      ctx.font = '600 11.5px "Figtree", sans-serif';
      top8.forEach((s, idx) => {
        const rowY = py + 40 + idx * 20;
        const medal = idx === 0 ? '🥇 ' : idx === 1 ? '🥈 ' : idx === 2 ? '🥉 ' : `${idx + 1}. `;

        ctx.fillStyle = s.isPlayer ? '#ffd200' : 'rgba(255, 255, 255, 0.88)';
        ctx.textAlign = 'left';
        ctx.fillText(`${medal}${s.name}`, px + 10, rowY);

        ctx.textAlign = 'right';
        ctx.fillText(Math.floor(s.score).toLocaleString(), px + boxW - 10, rowY);
      });

      // Show player position if outside top 7
      if (this.player && !this.player.isDead) {
        const rank = sorted.findIndex(s => s === this.player) + 1;
        if (rank > 7) {
          ctx.fillStyle = '#ffd200';
          ctx.textAlign = 'left';
          ctx.fillText(`Your Rank: #${rank} / ${sorted.length}`, px + 10, py + boxH - 10);
        }
      }
      ctx.restore();
    }

    drawMinimap(ctx) {
      const mapSize = 120;
      const mx = this.displayWidth - mapSize - 14;
      const my = this.displayHeight - mapSize - 14;
      const mapRadius = mapSize / 2;
      const centerX = mx + mapRadius;
      const centerY = my + mapRadius;

      ctx.save();
      // Radar disc
      ctx.fillStyle = 'rgba(7, 12, 22, 0.85)';
      ctx.strokeStyle = 'rgba(0, 247, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const scale = (mapRadius - 5) / WORLD_RADIUS;

      // Bot blips
      for (let i = 0; i < this.snakes.length; i++) {
        const s = this.snakes[i];
        if (s.isDead || s.isPlayer) continue;
        const blipX = centerX + s.x * scale;
        const blipY = centerY + s.y * scale;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(blipX, blipY, 2.0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player Blip (Large pulsing cyan)
      if (this.player && !this.player.isDead) {
        const px = centerX + this.player.x * scale;
        const py = centerY + this.player.y * scale;

        ctx.fillStyle = '#00f7ff';
        ctx.shadowColor = '#00f7ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 4.0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    loop() {
      if (this.isPlaying) {
        this.update();
        this.draw();
      }
      this.rafId = requestAnimationFrame(this.loop);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new GameEngine();
  });
})();
