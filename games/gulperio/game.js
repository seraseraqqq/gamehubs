/**
 * Gulper.io - High-Performance Canvas 2D Neon Snake Engine
 * Inspired by Slither.io and Gulper.io mechanics.
 * Pure Vanilla JS, 60fps, 25 autonomous AI bots, procedural neon aesthetics.
 */

(function () {
  'use strict';

  const WORLD_RADIUS = 1800; // Arena radius
  const BASE_SPEED = 3.4;
  const BOOST_SPEED = 6.6;
  const BASE_SEGMENT_RADIUS = 11;
  const SEGMENT_SPACING = 8;
  const MIN_BOOST_LENGTH = 15;

  const BOT_NAMES = [
    'NeonStriker', 'CyberViper', 'GlowWorm', 'QuantumPulse', 'ByteCrusher',
    'SolarDrifter', 'ApexPredator', 'VoltRunner', 'ZeroLag', 'HyperLoop',
    'ShadowFang', 'NebulaSnake', 'PixelGhost', 'LaserTail', 'ElectroEel',
    'ChronoShift', 'Vortex99', 'CosmicSlither', 'TurboWorm', 'Specter',
    'PhantomGlow', 'AlphaWorm', 'Synthetix', 'VectorRider', 'BioHazard'
  ];

  const SKINS = [
    { name: 'Cyan Neon', glow: '#00ffcc', core: '#e6ffff', body: '#00c8a0' },
    { name: 'Plasma Pink', glow: '#ff00aa', core: '#ffe6f7', body: '#c70085' },
    { name: 'Solar Gold', glow: '#ffd200', core: '#fffde6', body: '#d4aa00' },
    { name: 'Toxic Lime', glow: '#39ff14', core: '#eefde6', body: '#2bb80f' },
    { name: 'Electric Violet', glow: '#9d00ff', core: '#f5e6ff', body: '#7300bd' },
    { name: 'Ice Blue', glow: '#00bfff', core: '#e6f7ff', body: '#008ecc' },
    { name: 'Cyber Tangerine', glow: '#ff5500', core: '#ffece6', body: '#cc4400' }
  ];

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const ang = Math.random() * Math.PI * 2;
      const spd = 0.5 + Math.random() * 2.5;
      this.vx = Math.cos(ang) * spd;
      this.vy = Math.sin(ang) * spd;
      this.alpha = 1.0;
      this.size = 2 + Math.random() * 3;
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
      ctx.shadowBlur = 6;
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
      this.radius = Math.min(3 + mass * 0.8, 10);
      this.color = color || SKINS[Math.floor(Math.random() * SKINS.length)].glow;
      this.pulse = Math.random() * Math.PI * 2;
      this.isDrifting = mass > 2;
      this.vx = (Math.random() - 0.5) * (this.isDrifting ? 0.6 : 0.1);
      this.vy = (Math.random() - 0.5) * (this.isDrifting ? 0.6 : 0.1);
    }

    update() {
      this.pulse += 0.04;
      if (this.isDrifting) {
        this.x += this.vx;
        this.y += this.vy;
        // Bounce off arena boundary
        const dist = Math.hypot(this.x, this.y);
        if (dist > WORLD_RADIUS - 30) {
          const angle = Math.atan2(this.y, this.x);
          this.x = Math.cos(angle) * (WORLD_RADIUS - 32);
          this.y = Math.sin(angle) * (WORLD_RADIUS - 32);
          this.vx *= -1;
          this.vy *= -1;
        }
      }
    }

    draw(ctx) {
      const p = Math.sin(this.pulse) * 1.2;
      const r = Math.max(2, this.radius + p);

      ctx.save();
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Bright white central spark
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, r * 0.38, 0, Math.PI * 2);
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
      this.turnRate = 0.09;

      this.speed = BASE_SPEED;
      this.isBoosting = false;
      this.boostCooldown = 0;

      this.length = isPlayer ? 24 : 18 + Math.floor(Math.random() * 30);
      this.radius = BASE_SEGMENT_RADIUS;
      this.score = this.length * 10;
      this.kills = 0;
      this.isDead = false;

      // Initialize segments backwards
      this.segments = [];
      for (let i = 0; i < this.length; i++) {
        this.segments.push({
          x: this.x - Math.cos(this.angle) * i * SEGMENT_SPACING,
          y: this.y - Math.sin(this.angle) * i * SEGMENT_SPACING
        });
      }

      // AI specific parameters
      this.aiTimer = 0;
      this.aiState = 'forage'; // 'forage', 'hunt', 'avoid'
      this.targetFood = null;
    }

    update(foods, snakes, particles, soundEngine) {
      if (this.isDead) return;

      // 1. Calculate boost
      if (this.isBoosting && this.length > MIN_BOOST_LENGTH) {
        this.speed = BOOST_SPEED;
        this.boostCooldown++;

        // Burn mass every 5 frames
        if (this.boostCooldown % 5 === 0) {
          this.length -= 0.15;
          this.score = Math.floor(this.length * 10);

          // Drop glowing pellet from tail
          const tail = this.segments[this.segments.length - 1];
          if (tail && Math.random() < 0.35) {
            foods.push(new Food(tail.x, tail.y, 1, this.skin.glow));
          }

          // Emit sparks
          if (tail) {
            particles.push(new Particle(tail.x, tail.y, this.skin.glow));
          }
        }
      } else {
        this.speed = BASE_SPEED;
        this.boostCooldown = 0;
        this.isBoosting = false;
      }

      // Dynamic radius scaling slightly with length
      this.radius = Math.min(BASE_SEGMENT_RADIUS + Math.floor(this.length / 80), 22);

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

      // 4. Update body segments via inverse kinematics
      for (let i = 1; i < this.segments.length; i++) {
        const prev = this.segments[i - 1];
        const curr = this.segments[i];
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        const dist = Math.hypot(dx, dy);

        if (dist > SEGMENT_SPACING) {
          const segAngle = Math.atan2(dy, dx);
          curr.x = prev.x - Math.cos(segAngle) * SEGMENT_SPACING;
          curr.y = prev.y - Math.sin(segAngle) * SEGMENT_SPACING;
        }
      }

      // Add or remove segments to match desired length
      const targetCount = Math.floor(this.length);
      while (this.segments.length < targetCount) {
        const last = this.segments[this.segments.length - 1];
        this.segments.push({ x: last.x, y: last.y });
      }
      while (this.segments.length > targetCount && this.segments.length > 5) {
        this.segments.pop();
      }

      // 5. Arena Wall Collision
      const distFromCenter = Math.hypot(this.x, this.y);
      if (distFromCenter > WORLD_RADIUS) {
        this.die(foods, particles, soundEngine);
        return;
      }

      // 6. AI Logic update
      if (!this.isPlayer) {
        this.updateAI(foods, snakes);
      }
    }

    updateAI(foods, snakes) {
      this.aiTimer++;

      // Check arena boundary - turn back inward
      const distFromCenter = Math.hypot(this.x, this.y);
      if (distFromCenter > WORLD_RADIUS * 0.82) {
        this.targetAngle = Math.atan2(-this.y, -this.x);
        return;
      }

      // Obstacle avoidance (Raycasting ahead)
      let obstacleAhead = false;
      const lookAheadDist = 110 + this.speed * 8;
      const checkAngles = [0, -0.5, 0.5, -0.9, 0.9];

      for (const angOffset of checkAngles) {
        const probeX = this.x + Math.cos(this.angle + angOffset) * lookAheadDist;
        const probeY = this.y + Math.sin(this.angle + angOffset) * lookAheadDist;

        for (const other of snakes) {
          if (other === this || other.isDead) continue;
          // Sample every 3rd segment
          for (let s = 0; s < other.segments.length; s += 3) {
            const seg = other.segments[s];
            if (Math.hypot(probeX - seg.x, probeY - seg.y) < other.radius + 18) {
              obstacleAhead = true;
              // Steer hard away from obstacle
              this.targetAngle = this.angle + (angOffset >= 0 ? -1.2 : 1.2);
              this.isBoosting = false;
              break;
            }
          }
          if (obstacleAhead) break;
        }
        if (obstacleAhead) break;
      }

      if (obstacleAhead) return;

      // Normal state update every 15 frames
      if (this.aiTimer % 15 === 0) {
        // Seek nearby large food
        let nearestFood = null;
        let minDist = 400;

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
          // Boost if food is large cluster
          if (nearestFood.mass >= 3 && minDist < 200 && this.length > 25) {
            this.isBoosting = true;
          } else {
            this.isBoosting = false;
          }
        } else {
          // Wander with gentle sine noise
          this.targetAngle += (Math.random() - 0.5) * 0.4;
          this.isBoosting = false;
        }
      }
    }

    die(foods, particles, soundEngine) {
      if (this.isDead) return;
      this.isDead = true;

      // Shatter body segments into glowing energy orbs
      const step = Math.max(1, Math.floor(this.segments.length / 40));
      for (let i = 0; i < this.segments.length; i += step) {
        const seg = this.segments[i];
        const mass = 2 + Math.floor(Math.random() * 3);
        const food = new Food(
          seg.x + (Math.random() - 0.5) * 16,
          seg.y + (Math.random() - 0.5) * 16,
          mass,
          this.skin.glow
        );
        foods.push(food);
      }

      // Death explosion particles
      for (let i = 0; i < 20; i++) {
        particles.push(new Particle(this.x, this.y, this.skin.glow));
      }

      if (this.isPlayer) {
        soundEngine.playExplosion();
      }
    }

    draw(ctx, viewX, viewY, viewW, viewH) {
      if (this.isDead || this.segments.length === 0) return;

      // Culling: check if snake is anywhere in view
      const head = this.segments[0];
      const boundMargin = 300;
      if (
        head.x < viewX - boundMargin ||
        head.x > viewX + viewW + boundMargin ||
        head.y < viewY - boundMargin ||
        head.y > viewY + viewH + boundMargin
      ) {
        return;
      }

      ctx.save();

      // Pass 1: Neon Outer Glow Aura
      ctx.shadowColor = this.skin.glow;
      ctx.shadowBlur = this.isBoosting ? 16 : 9;
      ctx.fillStyle = this.skin.glow;

      // Draw segments from tail to head
      for (let i = this.segments.length - 1; i >= 0; i -= 2) {
        const seg = this.segments[i];
        const r = this.radius * (i === 0 ? 1.15 : (0.7 + 0.3 * (1 - i / this.segments.length)));
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pass 2: Inner Core Color
      ctx.shadowBlur = 0;
      ctx.fillStyle = this.skin.body;
      for (let i = this.segments.length - 1; i >= 0; i -= 2) {
        const seg = this.segments[i];
        const r = (this.radius - 2.5) * (i === 0 ? 1.15 : (0.7 + 0.3 * (1 - i / this.segments.length)));
        if (r > 1) {
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Pass 3: Fiber-optic central spine wire
      ctx.strokeStyle = this.skin.core;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(this.segments[0].x, this.segments[0].y);
      for (let i = 1; i < this.segments.length; i += 2) {
        ctx.lineTo(this.segments[i].x, this.segments[i].y);
      }
      ctx.stroke();

      // Pass 4: Head & Cyber Eyes
      this.drawHead(ctx);

      // Pass 5: Nickname tag
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px "Figtree", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, this.x, this.y - this.radius - 8);

      ctx.restore();
    }

    drawHead(ctx) {
      const hx = this.x;
      const hy = this.y;
      const eyeDist = this.radius * 0.65;
      const eyeFwd = this.radius * 0.45;
      const eyeR = this.radius * 0.4;

      // Left eye pos
      const lx = hx + Math.cos(this.angle) * eyeFwd + Math.cos(this.angle - Math.PI / 2) * eyeDist;
      const ly = hy + Math.sin(this.angle) * eyeFwd + Math.sin(this.angle - Math.PI / 2) * eyeDist;

      // Right eye pos
      const rx = hx + Math.cos(this.angle) * eyeFwd + Math.cos(this.angle + Math.PI / 2) * eyeDist;
      const ry = hy + Math.sin(this.angle) * eyeFwd + Math.sin(this.angle + Math.PI / 2) * eyeDist;

      // Eye Whites
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lx, ly, eyeR, 0, Math.PI * 2);
      ctx.arc(rx, ry, eyeR, 0, Math.PI * 2);
      ctx.fill();

      // Pupil looking towards angle
      ctx.fillStyle = '#111827';
      const pupilOffset = eyeR * 0.4;
      const plx = lx + Math.cos(this.angle) * pupilOffset;
      const ply = ly + Math.sin(this.angle) * pupilOffset;
      const prx = rx + Math.cos(this.angle) * pupilOffset;
      const pry = ry + Math.sin(this.angle) * pupilOffset;

      ctx.beginPath();
      ctx.arc(plx, ply, eyeR * 0.55, 0, Math.PI * 2);
      ctx.arc(prx, pry, eyeR * 0.55, 0, Math.PI * 2);
      ctx.fill();
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
      this.bestScore = parseInt(localStorage.getItem('gulper_best') || '0', 10);

      this.initDPI();
      this.bindEvents();
      this.renderSkinSelector();
      this.updateScoresUI();
    }

    initDPI() {
      const container = this.canvas.parentElement;
      const w = container.clientWidth;
      const h = container.clientHeight || 560;

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

      // Mouse movements
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

      // Mouse down for Boost
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

      // Spacebar for Boost
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.repeat) {
          e.preventDefault();
          if (this.player && !this.player.isDead) {
            this.player.isBoosting = true;
            this.soundEngine.startBoost();
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
          // Double finger touch boosts
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

      // UI Buttons
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
        chip.style.background = skin.glow;
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

      // Spawn ambient food pellets
      for (let i = 0; i < 650; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * (WORLD_RADIUS - 60);
        this.foods.push(new Food(Math.cos(ang) * dist, Math.sin(ang) * dist, 1));
      }

      // Spawn larger drifting energy spheres
      for (let i = 0; i < 35; i++) {
        const ang = Math.random() * Math.PI * 2;
        const dist = Math.sqrt(Math.random()) * (WORLD_RADIUS - 100);
        this.foods.push(new Food(Math.cos(ang) * dist, Math.sin(ang) * dist, 3 + Math.random() * 3));
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
      const dist = 300 + Math.random() * (WORLD_RADIUS - 450);
      const bx = Math.cos(ang) * dist;
      const by = Math.sin(ang) * dist;

      const bot = new Snake(`bot_${Date.now()}_${idx}`, name, skin, false, bx, by);
      this.snakes.push(bot);
    }

    update() {
      // Replenish food if depleted
      if (this.foods.length < 550) {
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

      // Handle Head-to-Food collisions
      for (let s = 0; s < this.snakes.length; s++) {
        const snake = this.snakes[s];
        if (snake.isDead) continue;

        for (let f = this.foods.length - 1; f >= 0; f--) {
          const food = this.foods[f];
          const dist = Math.hypot(snake.x - food.x, snake.y - food.y);
          if (dist < snake.radius + food.radius + 6) {
            snake.length += food.mass * 0.28;
            snake.score += food.mass * 10;
            this.foods.splice(f, 1);

            if (snake.isPlayer) {
              this.soundEngine.playEat(food.mass);
              this.updateScoresUI();
            }
          }
        }
      }

      // Handle Snake-to-Snake collisions (Head vs Other Body)
      for (let i = 0; i < this.snakes.length; i++) {
        const s1 = this.snakes[i];
        if (s1.isDead) continue;

        for (let j = 0; j < this.snakes.length; j++) {
          const s2 = this.snakes[j];
          if (s1 === s2 || s2.isDead) continue;

          // Check if s1's head collided with any segment of s2
          for (let k = 0; k < s2.segments.length; k += 2) {
            const seg = s2.segments[k];
            const dist = Math.hypot(s1.x - seg.x, s1.y - seg.y);
            if (dist < s1.radius + s2.radius * 0.75) {
              // s1 crashes into s2 and dies!
              s1.die(this.foods, this.particles, this.soundEngine);
              s2.kills++;

              if (s2.isPlayer) {
                this.soundEngine.playKill();
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
          }, 2000 + Math.random() * 2000);
        }
      }

      // Camera smooth Lerp
      if (this.player && !this.player.isDead) {
        this.camera.x += (this.player.x - this.camera.x) * 0.08;
        this.camera.y += (this.player.y - this.camera.y) * 0.08;

        // Dynamic Zoom out as snake grows
        this.camera.targetZoom = Math.max(0.65, 1.0 - (this.player.length / 450) * 0.35);
        this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.05;
      }
    }

    onPlayerDeath() {
      this.soundEngine.stopBoost();
      if (this.player.score > this.bestScore) {
        this.bestScore = this.player.score;
        localStorage.setItem('gulper_best', this.bestScore);
      }

      document.getElementById('modalScore').textContent = this.player.score;
      document.getElementById('modalLength').textContent = Math.floor(this.player.length);
      document.getElementById('modalKills').textContent = this.player.kills;
      document.getElementById('modalBest').textContent = this.bestScore;

      setTimeout(() => {
        document.getElementById('gameOverModal').showModal();
      }, 700);
    }

    updateScoresUI() {
      if (!this.player) return;
      document.getElementById('hudScore').textContent = this.player.score;
      document.getElementById('hudLength').textContent = Math.floor(this.player.length);
      document.getElementById('hudKills').textContent = this.player.kills;
      document.getElementById('hudBest').textContent = this.bestScore;
    }

    draw() {
      const ctx = this.ctx;
      const w = this.displayWidth;
      const h = this.displayHeight;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      // Center view
      ctx.translate(w / 2, h / 2);
      ctx.scale(this.camera.zoom, this.camera.zoom);
      ctx.translate(-this.camera.x, -this.camera.y);

      const viewW = w / this.camera.zoom;
      const viewH = h / this.camera.zoom;
      const viewX = this.camera.x - viewW / 2;
      const viewY = this.camera.y - viewH / 2;

      // 1. Draw Cyber Dark Background & Grid
      this.drawGrid(ctx, viewX, viewY, viewW, viewH);

      // 2. Draw Pulsing Electric Arena Perimeter Wall
      this.drawPerimeter(ctx);

      // 3. Draw Foods
      for (let i = 0; i < this.foods.length; i++) {
        const f = this.foods[i];
        if (
          f.x >= viewX - 20 && f.x <= viewX + viewW + 20 &&
          f.y >= viewY - 20 && f.y <= viewY + viewH + 20
        ) {
          f.draw(ctx);
        }
      }

      // 4. Draw Particles
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].draw(ctx);
      }

      // 5. Draw Snakes (Draw player last so it's on top)
      for (let i = 0; i < this.snakes.length; i++) {
        if (!this.snakes[i].isPlayer) {
          this.snakes[i].draw(ctx, viewX, viewY, viewW, viewH);
        }
      }
      if (this.player && !this.player.isDead) {
        this.player.draw(ctx, viewX, viewY, viewW, viewH);
      }

      ctx.restore();

      // Screen-Space UI Overlays
      this.drawLeaderboard(ctx);
      this.drawMinimap(ctx);
    }

    drawGrid(ctx, vx, vy, vw, vh) {
      const gridSize = 60;
      const startX = Math.floor(vx / gridSize) * gridSize;
      const startY = Math.floor(vy / gridSize) * gridSize;

      ctx.strokeStyle = '#0e1826';
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
    }

    drawPerimeter(ctx) {
      ctx.save();
      ctx.strokeStyle = '#00ffcc';
      ctx.shadowColor = '#00ffcc';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, WORLD_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // Danger border zone dashed outer warning
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, WORLD_RADIUS - 18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    drawLeaderboard(ctx) {
      const sorted = [...this.snakes].filter(s => !s.isDead).sort((a, b) => b.score - a.score);
      const top10 = sorted.slice(0, 8);

      const boxW = 160;
      const boxH = 34 + top10.length * 18;
      const px = this.displayWidth - boxW - 14;
      const py = 14;

      ctx.save();
      ctx.fillStyle = 'rgba(10, 15, 26, 0.75)';
      ctx.strokeStyle = 'rgba(0, 255, 204, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(px, py, boxW, boxH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#00ffcc';
      ctx.font = '700 11px "Dela Gothic One", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LEADERBOARD', px + boxW / 2, py + 18);

      ctx.font = '600 11px "Figtree", sans-serif';
      top10.forEach((s, idx) => {
        const rowY = py + 36 + idx * 18;
        ctx.fillStyle = s.isPlayer ? '#ffd200' : 'rgba(255, 255, 255, 0.85)';
        ctx.textAlign = 'left';
        ctx.fillText(`${idx + 1}. ${s.name}`, px + 10, rowY);
        ctx.textAlign = 'right';
        ctx.fillText(`${s.score}`, px + boxW - 10, rowY);
      });

      // Show player rank if outside top 8
      if (this.player && !this.player.isDead) {
        const playerRank = sorted.findIndex(s => s === this.player) + 1;
        if (playerRank > 8) {
          ctx.fillStyle = '#ffd200';
          ctx.textAlign = 'left';
          ctx.fillText(`Your Rank: #${playerRank} / ${sorted.length}`, px + 10, py + boxH - 6);
        }
      }
      ctx.restore();
    }

    drawMinimap(ctx) {
      const mapSize = 110;
      const mx = this.displayWidth - mapSize - 14;
      const my = this.displayHeight - mapSize - 14;
      const mapRadius = mapSize / 2;
      const centerX = mx + mapRadius;
      const centerY = my + mapRadius;

      ctx.save();
      // Minimap Disc
      ctx.fillStyle = 'rgba(10, 15, 26, 0.8)';
      ctx.strokeStyle = 'rgba(0, 255, 204, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const scale = (mapRadius - 4) / WORLD_RADIUS;

      // Draw bot blips
      for (let i = 0; i < this.snakes.length; i++) {
        const s = this.snakes[i];
        if (s.isDead || s.isPlayer) continue;
        const blipX = centerX + s.x * scale;
        const blipY = centerY + s.y * scale;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(blipX, blipY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Player blip (pulsing white/cyan)
      if (this.player && !this.player.isDead) {
        const px = centerX + this.player.x * scale;
        const py = centerY + this.player.y * scale;

        ctx.fillStyle = '#00ffcc';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
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
