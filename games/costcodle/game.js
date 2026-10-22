/**
 * Costcodle Unlimited - Guess the Price Game Engine
 * Free, offline-first, client-side implementation.
 */

(() => {
  'use strict';

  // --- Web Audio API Synthesizer ---
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('costcodle_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('costcodle_muted', this.muted);
      return this.muted;
    }

    playTone(freq, type, duration, gainStart = 0.15) {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playGuess(isWin, isWarm) {
      this.init();
      if (isWin) {
        // High celebratory arpeggio
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          setTimeout(() => this.playTone(freq, 'triangle', 0.28, 0.2), i * 75);
        });
      } else if (isWarm) {
        // Warm double chime
        this.playTone(587.33, 'sine', 0.18, 0.18);
        setTimeout(() => this.playTone(880, 'sine', 0.22, 0.15), 90);
      } else {
        // Cold low thud
        this.playTone(220, 'sawtooth', 0.2, 0.12);
      }
    }
  }

  // --- Costcodle Game Engine ---
  class CostcodleGame {
    constructor() {
      this.MAX_GUESSES = 6;
      this.mode = 'daily'; // 'daily' or 'unlimited'
      this.currentItem = null;
      this.guesses = []; // array of { amount, direction, feedbackClass, emoji, text }
      this.isGameOver = false;
      this.sound = new SoundManager();

      this.stats = this.loadStats();
      this.initDOM();
      this.bindEvents();
      this.setMode('daily');
    }

    loadStats() {
      const defaultStats = {
        played: 0,
        wins: 0,
        currentStreak: 0,
        maxStreak: 0,
        dist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
      };
      try {
        const saved = localStorage.getItem('costcodle_stats');
        return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
      } catch (e) {
        return defaultStats;
      }
    }

    saveStats() {
      try {
        localStorage.setItem('costcodle_stats', JSON.stringify(this.stats));
      } catch (e) {}
    }

    initDOM() {
      // Buttons & Controls
      this.btnDaily = document.getElementById('btnDaily');
      this.btnUnlimited = document.getElementById('btnUnlimited');
      this.btnHelp = document.getElementById('btnHelp');
      this.btnStats = document.getElementById('btnStats');
      this.btnMute = document.getElementById('btnMute');

      // Product Card
      this.productImage = document.getElementById('productImage');
      this.attemptBadgeEl = document.getElementById('attemptBadge');
      this.nameEl = document.getElementById('productName');

      // Input Section
      this.priceInput = document.getElementById('priceInput');
      this.btnSubmit = document.getElementById('btnSubmit');
      this.chipsBar = document.getElementById('chipsBar');

      // History Rows Container
      this.historyContainer = document.getElementById('historyContainer');

      // Modals
      this.resultModal = document.getElementById('resultModal');
      this.statsModal = document.getElementById('statsModal');
      this.helpModal = document.getElementById('helpModal');

      this.modalTitle = document.getElementById('resultModalTitle');
      this.modalDesc = document.getElementById('resultModalDesc');
      this.modalActualPrice = document.getElementById('modalActualPrice');
      this.btnShare = document.getElementById('btnShare');
      this.btnNextItem = document.getElementById('btnNextItem');

      this.setupDialogLightDismiss(this.resultModal);
      this.setupDialogLightDismiss(this.statsModal);
      this.setupDialogLightDismiss(this.helpModal);

      this.updateMuteIcon();
    }

    setupDialogLightDismiss(dialog) {
      if (!dialog) return;
      // Modern Web Guidance: light-dismiss fallback for Safari
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        dialog.addEventListener('click', (event) => {
          if (event.target !== dialog) return;
          const rect = dialog.getBoundingClientRect();
          const isContent = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
          );
          if (!isContent) dialog.close();
        });
      }
    }

    bindEvents() {
      this.btnDaily.addEventListener('click', () => this.setMode('daily'));
      this.btnUnlimited.addEventListener('click', () => this.setMode('unlimited'));

      this.btnHelp.addEventListener('click', () => this.helpModal.showModal());
      this.btnStats.addEventListener('click', () => this.showStatsModal());

      this.btnMute.addEventListener('click', () => {
        this.sound.toggleMute();
        this.updateMuteIcon();
      });

      // Submit guess
      this.btnSubmit.addEventListener('click', () => this.submitGuess());
      this.priceInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.submitGuess();
        }
      });

      // Chips quick adjustments
      this.chipsBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip-btn');
        if (!btn) return;
        const add = parseFloat(btn.dataset.add);
        let curr = parseFloat(this.priceInput.value) || 0;
        if (btn.dataset.action === 'clear') {
          this.priceInput.value = '';
        } else if (!isNaN(add)) {
          this.priceInput.value = (Math.max(0, curr + add)).toFixed(2);
        }
        this.priceInput.focus();
      });

      // Share button
      this.btnShare.addEventListener('click', () => this.shareResults());

      // Next item / Play again button
      this.btnNextItem.addEventListener('click', () => {
        this.resultModal.close();
        if (this.mode === 'unlimited') {
          this.startRound();
        } else {
          // Switch to unlimited mode for more plays
          this.setMode('unlimited');
        }
      });
    }

    updateMuteIcon() {
      const isMuted = this.sound.muted;
      this.btnMute.setAttribute('aria-label', isMuted ? 'Unmute Sound' : 'Mute Sound');
      this.btnMute.innerHTML = isMuted
        ? `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    }

    setMode(mode) {
      this.mode = mode;
      this.btnDaily.classList.toggle('active', mode === 'daily');
      this.btnUnlimited.classList.toggle('active', mode === 'unlimited');
      this.startRound();
    }

    getTodayDateString() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    getDailyItem() {
      const dateStr = this.getTodayDateString();
      let hash = 0;
      for (let i = 0; i < dateStr.length; i++) {
        hash = (hash << 5) - hash + dateStr.charCodeAt(i);
        hash |= 0;
      }
      const idx = Math.abs(hash) % COSTCO_ITEMS.length;
      return COSTCO_ITEMS[idx];
    }

    startRound() {
      this.guesses = [];
      this.isGameOver = false;
      this.priceInput.value = '';
      this.priceInput.disabled = false;
      this.btnSubmit.disabled = false;

      if (this.mode === 'daily') {
        this.currentItem = this.getDailyItem();
        // Check if daily round was already completed
        const savedDaily = localStorage.getItem(`costcodle_daily_${this.getTodayDateString()}`);
        if (savedDaily) {
          try {
            const data = JSON.parse(savedDaily);
            this.guesses = data.guesses;
            this.isGameOver = true;
            this.priceInput.disabled = true;
            this.btnSubmit.disabled = true;
            setTimeout(() => this.showResultModal(data.isWin), 300);
          } catch (e) {}
        }
      } else {
        // Unlimited random item
        let randIdx = Math.floor(Math.random() * COSTCO_ITEMS.length);
        this.currentItem = COSTCO_ITEMS[randIdx];
      }

      this.renderProductCard();
      this.renderHistory();
      this.updateAttemptBadge();
      this.priceInput.focus();
    }

    renderProductCard() {
      if (!this.currentItem) return;
      this.productImage.src = this.currentItem.image || '';
      this.productImage.alt = this.currentItem.name;
      this.productImage.onerror = () => {
        this.productImage.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" rx="20" fill="%23f1f4fd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60" fill="%2394a3b8">📦</text></svg>';
      };
      this.nameEl.textContent = this.currentItem.name;
    }

    updateAttemptBadge() {
      const count = this.guesses.length;
      this.attemptBadgeEl.textContent = `${count}/${this.MAX_GUESSES} Guesses`;
    }

    renderHistory() {
      this.historyContainer.innerHTML = '';
      for (let i = 0; i < this.MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'history-row';

        const guess = this.guesses[i];
        if (guess) {
          row.innerHTML = `
            <span class="guess-number">#${i + 1}</span>
            <span class="guess-amount">$${guess.amount.toFixed(2)}</span>
            <div class="guess-feedback ${guess.feedbackClass}">
              <span>${guess.text}</span>
            </div>
          `;
        } else {
          row.classList.add('empty');
          row.innerHTML = `
            <span class="guess-number">#${i + 1}</span>
            <span class="guess-amount">$ --.--</span>
            <div class="guess-feedback" style="border:none;box-shadow:none;background:transparent;color:#94a3b8;">
              <span>Pending</span>
            </div>
          `;
        }
        this.historyContainer.appendChild(row);
      }
    }

    submitGuess() {
      if (this.isGameOver) return;
      const val = parseFloat(this.priceInput.value);
      if (isNaN(val) || val <= 0) {
        alert('Please enter a valid price guess in dollars (e.g. 14.99)');
        this.priceInput.focus();
        return;
      }

      const target = this.currentItem.price;
      const diffPercent = Math.abs(val - target) / target;
      const isWin = diffPercent <= 0.05; // Win if within 5%
      const isWarm = diffPercent <= 0.25; // Warm if within 25%

      let text, feedbackClass, emoji;
      if (isWin) {
        text = '✓ Within 5% (WIN!)';
        feedbackClass = 'fb-win';
        emoji = '🟩';
      } else if (isWarm) {
        text = val < target ? '↑ HIGHER (Warm)' : '↓ LOWER (Warm)';
        feedbackClass = 'fb-warm';
        emoji = '🟨';
      } else {
        text = val < target ? '↑ HIGHER' : '↓ LOWER';
        feedbackClass = 'fb-cold';
        emoji = '🟥';
      }

      const arrow = val < target ? '↑' : '↓';
      this.guesses.push({
        amount: val,
        diffPercent,
        feedbackClass,
        text,
        emoji,
        arrow: isWin ? '✓' : arrow
      });

      this.sound.playGuess(isWin, isWarm);
      this.renderHistory();
      this.updateAttemptBadge();
      this.priceInput.value = '';

      if (isWin) {
        this.finishGame(true);
      } else if (this.guesses.length >= this.MAX_GUESSES) {
        this.finishGame(false);
      } else {
        this.priceInput.focus();
      }
    }

    finishGame(isWin) {
      this.isGameOver = true;
      this.priceInput.disabled = true;
      this.btnSubmit.disabled = true;

      // Update statistics
      this.stats.played++;
      if (isWin) {
        this.stats.wins++;
        this.stats.currentStreak++;
        this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.currentStreak);
        const tries = this.guesses.length;
        if (this.stats.dist[tries] !== undefined) {
          this.stats.dist[tries]++;
        }
      } else {
        this.stats.currentStreak = 0;
      }
      this.saveStats();

      // If Daily Mode, persist completed state
      if (this.mode === 'daily') {
        const dailyRecord = {
          date: this.getTodayDateString(),
          isWin,
          guesses: this.guesses,
          itemId: this.currentItem.id
        };
        localStorage.setItem(`costcodle_daily_${this.getTodayDateString()}`, JSON.stringify(dailyRecord));
      }

      setTimeout(() => this.showResultModal(isWin), 450);
    }

    showResultModal(isWin) {
      this.modalTitle.textContent = isWin ? 'YOU GOT IT!' : 'OUT OF BUDGET!';
      this.modalTitle.style.color = isWin ? 'var(--leaf)' : 'var(--tomato)';
      this.modalDesc.textContent = isWin
        ? `Nailed it in ${this.guesses.length} of ${this.MAX_GUESSES} attempts!`
        : `Better luck next time! Here was the warehouse price:`;
      this.modalActualPrice.textContent = `$${this.currentItem.price.toFixed(2)}`;

      this.btnNextItem.textContent = this.mode === 'unlimited' ? 'Play Next Item ➔' : 'Play Unlimited Mode ➔';
      this.resultModal.showModal();
    }

    showStatsModal() {
      document.getElementById('statPlayed').textContent = this.stats.played;
      const winRate = this.stats.played > 0 ? Math.round((this.stats.wins / this.stats.played) * 100) : 0;
      document.getElementById('statWinRate').textContent = `${winRate}%`;
      document.getElementById('statStreak').textContent = this.stats.currentStreak;
      document.getElementById('statMaxStreak').textContent = this.stats.maxStreak;
      this.statsModal.showModal();
    }

    shareResults() {
      const isWin = this.guesses.some(g => g.feedbackClass === 'fb-win');
      const scoreStr = isWin ? `${this.guesses.length}/${this.MAX_GUESSES}` : 'X/6';
      const modeLabel = this.mode === 'daily' ? `Daily #${this.getTodayDateString()}` : 'Unlimited';

      let text = `Costcodle (${modeLabel}) ${scoreStr}\n`;
      this.guesses.forEach(g => {
        text += `${g.emoji} ${g.arrow}\n`;
      });
      text += `Play free: https://costcodle-unlimited.vercel.app/`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          const original = this.btnShare.textContent;
          this.btnShare.textContent = '✓ Copied to Clipboard!';
          setTimeout(() => {
            this.btnShare.textContent = original;
          }, 2000);
        });
      } else {
        alert(text);
      }
    }
  }

  // Launch on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    new CostcodleGame();
  });
})();
