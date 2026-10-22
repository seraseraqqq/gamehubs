/**
 * Block Blast Unblocked - Classic 8x8 Block Puzzle Game Engine
 * Free, offline-first, zero-dependency implementation.
 */

(() => {
  'use strict';

  // --- Sound Synthesizer (Web Audio API) ---
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('bbu_sound_muted') === 'true';
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      localStorage.setItem('bbu_sound_muted', this.muted);
      return this.muted;
    }

    playTone(freq, type, duration, gainStart = 0.15, gainEnd = 0.001) {
      if (this.muted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainStart, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(gainEnd, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // AudioContext error safeguard
      }
    }

    playPlace() {
      if (this.muted) return;
      this.init();
      // Snappy wood/bubble pop
      this.playTone(320, 'sine', 0.12, 0.2, 0.001);
    }

    playBlast(lineCount) {
      if (this.muted || !this.ctx) return;
      this.init();
      const baseFreq = 440;
      const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      chords.slice(0, Math.min(lineCount + 2, 4)).forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'triangle', 0.28, 0.18, 0.001);
        }, idx * 60);
      });
    }

    playCombo(comboLevel) {
      if (this.muted || !this.ctx) return;
      this.init();
      // Ascending musical scale
      const notes = [440, 493.88, 554.37, 587.33, 659.25, 739.99, 830.61, 880];
      const note = notes[Math.min(comboLevel, notes.length - 1)];
      this.playTone(note, 'sine', 0.35, 0.25, 0.001);
      setTimeout(() => {
        this.playTone(note * 1.5, 'triangle', 0.3, 0.15, 0.001);
      }, 70);
    }

    playGameOver() {
      if (this.muted || !this.ctx) return;
      this.init();
      [369.99, 329.63, 293.66, 220].forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 'sawtooth', 0.35, 0.12, 0.001);
        }, idx * 120);
      });
    }
  }

  // --- Polyomino Piece Shapes & Definitions (Zadely Palette) ---
  const PIECE_COLORS = [
    'bg-yolk',
    'bg-tomato',
    'bg-pool',
    'bg-leaf',
    'bg-grape',
    'bg-pink',
    'bg-orange',
    'bg-teal'
  ];

  const SHAPE_DEFINITIONS = [
    // 1x1 Dot
    { matrix: [[1]], weight: 6 },

    // 1x2, 2x1 Domino
    { matrix: [[1, 1]], weight: 10 },
    { matrix: [[1], [1]], weight: 10 },

    // 1x3, 3x1
    { matrix: [[1, 1, 1]], weight: 10 },
    { matrix: [[1], [1], [1]], weight: 10 },

    // 1x4, 4x1
    { matrix: [[1, 1, 1, 1]], weight: 8 },
    { matrix: [[1], [1], [1], [1]], weight: 8 },

    // 1x5, 5x1
    { matrix: [[1, 1, 1, 1, 1]], weight: 4 },
    { matrix: [[1], [1], [1], [1], [1]], weight: 4 },

    // 2x2 Square
    { matrix: [[1, 1], [1, 1]], weight: 10 },

    // Small Corner L (3 blocks)
    { matrix: [[1, 0], [1, 1]], weight: 8 },
    { matrix: [[0, 1], [1, 1]], weight: 8 },
    { matrix: [[1, 1], [1, 0]], weight: 8 },
    { matrix: [[1, 1], [0, 1]], weight: 8 },

    // Standard L (4 blocks)
    { matrix: [[1, 0], [1, 0], [1, 1]], weight: 8 },
    { matrix: [[0, 1], [0, 1], [1, 1]], weight: 8 },
    { matrix: [[1, 1, 1], [1, 0, 0]], weight: 8 },
    { matrix: [[1, 1, 1], [0, 0, 1]], weight: 8 },
    { matrix: [[1, 1], [1, 0], [1, 0]], weight: 8 },
    { matrix: [[1, 1], [0, 1], [0, 1]], weight: 8 },
    { matrix: [[0, 0, 1], [1, 1, 1]], weight: 8 },
    { matrix: [[1, 0, 0], [1, 1, 1]], weight: 8 },

    // T-Shapes (4 blocks)
    { matrix: [[1, 1, 1], [0, 1, 0]], weight: 8 },
    { matrix: [[0, 1, 0], [1, 1, 1]], weight: 8 },
    { matrix: [[1, 0], [1, 1], [1, 0]], weight: 8 },
    { matrix: [[0, 1], [1, 1], [0, 1]], weight: 8 },

    // Z and S Shapes (4 blocks)
    { matrix: [[1, 1, 0], [0, 1, 1]], weight: 6 },
    { matrix: [[0, 1, 1], [1, 1, 0]], weight: 6 },
    { matrix: [[0, 1], [1, 1], [1, 0]], weight: 6 },
    { matrix: [[1, 0], [1, 1], [0, 1]], weight: 6 },

    // 2x3 & 3x2 Rectangles (6 blocks)
    { matrix: [[1, 1, 1], [1, 1, 1]], weight: 5 },
    { matrix: [[1, 1], [1, 1], [1, 1]], weight: 5 },

    // 3x3 Large Corner (5 blocks)
    { matrix: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], weight: 4 },
    { matrix: [[0, 0, 1], [0, 0, 1], [1, 1, 1]], weight: 4 },
    { matrix: [[1, 1, 1], [1, 0, 0], [1, 0, 0]], weight: 4 },
    { matrix: [[1, 1, 1], [0, 0, 1], [0, 0, 1]], weight: 4 },

    // Plus (+) Shape (5 blocks)
    { matrix: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], weight: 4 },

    // 3x3 Large Square (9 blocks)
    { matrix: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], weight: 3 }
  ];

  // Helper: Weighted random selection
  function getRandomShape() {
    const totalWeight = SHAPE_DEFINITIONS.reduce((sum, item) => sum + item.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const item of SHAPE_DEFINITIONS) {
      if (rand < item.weight) {
        return item.matrix;
      }
      rand -= item.weight;
    }
    return SHAPE_DEFINITIONS[0].matrix;
  }

  // --- Main Game State ---
  class BlockBlastGame {
    constructor() {
      this.GRID_SIZE = 8;
      this.board = Array(8).fill(null).map(() => Array(8).fill(0));
      this.score = 0;
      this.bestScore = parseInt(localStorage.getItem('bbu_best_score') || '0', 10);
      this.comboCount = 0;
      this.sound = new SoundManager();

      // Current 3 pieces in tray: { id, matrix, color, used }
      this.trayPieces = [];
      this.selectedPieceIndex = null;

      // Drag state
      this.isDragging = false;
      this.dragPiece = null;
      this.dragPieceIndex = null;
      this.ghostEl = null;

      this.initDOM();
      this.bindEvents();
      this.startNewGame();
    }

    initDOM() {
      this.boardEl = document.getElementById('boardGrid');
      this.scoreEl = document.getElementById('currentScore');
      this.bestScoreEl = document.getElementById('bestScore');
      this.trayEl = document.getElementById('trayContainer');
      this.comboBannerEl = document.getElementById('comboBanner');
      this.muteBtn = document.getElementById('btnMute');
      this.restartBtn = document.getElementById('btnRestart');
      this.gameOverModal = document.getElementById('gameOverModal');
      this.modalScoreEl = document.getElementById('modalScore');
      this.modalBestEl = document.getElementById('modalBest');
      this.btnPlayAgain = document.getElementById('btnPlayAgain');

      this.updateScoreDisplay();
      this.updateMuteIcon();

      // Render 8x8 Board DOM
      this.boardEl.innerHTML = '';
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.row = r;
          cell.dataset.col = c;
          this.boardEl.appendChild(cell);
        }
      }
    }

    bindEvents() {
      // Audio toggle
      this.muteBtn.addEventListener('click', () => {
        this.sound.toggleMute();
        this.updateMuteIcon();
      });

      // Restart button
      this.restartBtn.addEventListener('click', () => {
        if (confirm('Start a new game?')) {
          this.startNewGame();
        }
      });

      // Play Again Modal Button
      this.btnPlayAgain.addEventListener('click', () => {
        this.gameOverModal.close();
        this.startNewGame();
      });

      // Modern Web Guidance: Light Dismiss Fallback for Safari (<dialog closedby="any">)
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        this.gameOverModal.addEventListener('click', (event) => {
          if (event.target !== this.gameOverModal) return;
          const rect = this.gameOverModal.getBoundingClientRect();
          const isContent = (
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width
          );
          if (!isContent) {
            this.gameOverModal.close();
          }
        });
      }

      // Pointer events for dragging & clicking
      window.addEventListener('pointermove', (e) => this.onPointerMove(e));
      window.addEventListener('pointerup', (e) => this.onPointerUp(e));
      window.addEventListener('pointercancel', (e) => this.onPointerUp(e));

      // Tap-to-place on board click
      this.boardEl.addEventListener('click', (e) => this.onBoardClick(e));
    }

    updateMuteIcon() {
      const isMuted = this.sound.muted;
      this.muteBtn.setAttribute('aria-label', isMuted ? 'Unmute Sound' : 'Mute Sound');
      this.muteBtn.innerHTML = isMuted
        ? `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`
        : `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    }

    startNewGame() {
      this.board = Array(8).fill(null).map(() => Array(8).fill(0));
      this.score = 0;
      this.comboCount = 0;
      this.selectedPieceIndex = null;
      this.updateScoreDisplay();
      this.renderBoard();
      this.spawnTrayPieces();
    }

    updateScoreDisplay() {
      this.scoreEl.textContent = this.score;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem('bbu_best_score', this.bestScore);
      }
      this.bestScoreEl.textContent = this.bestScore;
    }

    renderBoard() {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const idx = r * 8 + c;
          const cellEl = this.boardEl.children[idx];
          cellEl.className = 'cell';
          const val = this.board[r][c];
          if (val !== 0) {
            cellEl.classList.add('filled', val);
          }
        }
      }
    }

    // Spawn 3 pieces with smart solvable guarantee
    spawnTrayPieces() {
      this.trayPieces = [];
      const shuffledColors = [...PIECE_COLORS].sort(() => 0.5 - Math.random());

      for (let i = 0; i < 3; i++) {
        let matrix = getRandomShape();
        const color = shuffledColors[i % shuffledColors.length];
        this.trayPieces.push({
          id: 'piece-' + Date.now() + '-' + i,
          matrix,
          color,
          used: false
        });
      }

      // Check if at least one piece can fit. If not, generate smaller shapes
      let canAnyFit = this.trayPieces.some(p => this.canFitAnywhere(p.matrix));
      if (!canAnyFit && !this.isBoardCompletelyFull()) {
        // Swap first piece for a 1x1 or small domino
        this.trayPieces[0].matrix = [[1]];
      }

      this.renderTray();
      this.checkTrayPossibilities();
    }

    isBoardCompletelyFull() {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (this.board[r][c] === 0) return false;
        }
      }
      return true;
    }

    renderTray() {
      this.trayEl.innerHTML = '';
      this.trayPieces.forEach((piece, index) => {
        const slot = document.createElement('div');
        slot.className = 'tray-slot';

        if (!piece.used) {
          const pieceEl = document.createElement('div');
          pieceEl.className = 'piece-item';
          if (this.selectedPieceIndex === index) {
            pieceEl.classList.add('selected');
          }

          const canFit = this.canFitAnywhere(piece.matrix);
          if (!canFit) {
            pieceEl.classList.add('disabled');
          }

          const rows = piece.matrix.length;
          const cols = piece.matrix[0].length;
          pieceEl.style.gridTemplateRows = `repeat(${rows}, 22px)`;
          pieceEl.style.gridTemplateColumns = `repeat(${cols}, 22px)`;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const cell = document.createElement('div');
              cell.className = 'piece-cell';
              if (piece.matrix[r][c] === 1) {
                cell.classList.add(piece.color);
              } else {
                cell.style.visibility = 'hidden';
              }
              pieceEl.appendChild(cell);
            }
          }

          // Drag & Click initiation
          pieceEl.addEventListener('pointerdown', (e) => this.onPiecePointerDown(e, index));

          slot.appendChild(pieceEl);
        }

        this.trayEl.appendChild(slot);
      });
    }

    checkTrayPossibilities() {
      const activePieces = this.trayPieces.filter(p => !p.used);
      if (activePieces.length === 0) {
        // Round complete, spawn next round
        this.spawnTrayPieces();
        return;
      }

      // Check if any piece can be placed
      const anyCanFit = activePieces.some(p => this.canFitAnywhere(p.matrix));
      if (!anyCanFit) {
        // Game Over!
        setTimeout(() => this.triggerGameOver(), 300);
      }
    }

    canFitAnywhere(matrix) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      for (let r = 0; r <= 8 - rows; r++) {
        for (let c = 0; c <= 8 - cols; c++) {
          if (this.canFitAt(matrix, r, c)) {
            return true;
          }
        }
      }
      return false;
    }

    canFitAt(matrix, startRow, startCol) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      if (startRow < 0 || startCol < 0 || startRow + rows > 8 || startCol + cols > 8) {
        return false;
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (matrix[r][c] === 1) {
            if (this.board[startRow + r][startCol + c] !== 0) {
              return false;
            }
          }
        }
      }
      return true;
    }

    // --- Pointer & Drag Mechanics ---
    onPiecePointerDown(e, index) {
      this.sound.init();
      const piece = this.trayPieces[index];
      if (piece.used) return;

      // Tap-to-select support
      if (this.selectedPieceIndex === index) {
        this.selectedPieceIndex = null;
        this.renderTray();
        this.clearPreviews();
        return;
      }

      this.isDragging = true;
      this.dragPiece = piece;
      this.dragPieceIndex = index;
      this.dragStartTime = Date.now();
      this.dragStartPos = { x: e.clientX, y: e.clientY };

      // Create floating ghost
      this.createGhost(piece, e);
    }

    createGhost(piece, e) {
      if (this.ghostEl) this.ghostEl.remove();

      this.ghostEl = document.createElement('div');
      this.ghostEl.className = 'drag-ghost';
      const rows = piece.matrix.length;
      const cols = piece.matrix[0].length;
      this.ghostEl.style.gridTemplateRows = `repeat(${rows}, var(--cell-size))`;
      this.ghostEl.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = document.createElement('div');
          cell.className = 'ghost-cell';
          if (piece.matrix[r][c] === 1) {
            cell.classList.add(piece.color);
          } else {
            cell.style.visibility = 'hidden';
          }
          this.ghostEl.appendChild(cell);
        }
      }

      document.body.appendChild(this.ghostEl);
      this.updateGhostPosition(e.clientX, e.clientY);
    }

    updateGhostPosition(clientX, clientY) {
      if (!this.ghostEl) return;
      // On touch devices, offset upwards by 65px so finger doesn't block player's view
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const offsetY = isTouch ? -65 : 0;
      this.ghostEl.style.left = `${clientX}px`;
      this.ghostEl.style.top = `${clientY + offsetY}px`;
    }

    onPointerMove(e) {
      if (!this.isDragging || !this.dragPiece) return;
      e.preventDefault();
      this.updateGhostPosition(e.clientX, e.clientY);

      const target = this.getTargetBoardCell(e.clientX, e.clientY);
      this.clearPreviews();

      if (target) {
        const canFit = this.canFitAt(this.dragPiece.matrix, target.row, target.col);
        this.highlightPreview(this.dragPiece.matrix, target.row, target.col, canFit);
      }
    }

    onPointerUp(e) {
      if (!this.isDragging) return;

      const isQuickClick = Date.now() - this.dragStartTime < 220 &&
        Math.hypot(e.clientX - this.dragStartPos.x, e.clientY - this.dragStartPos.y) < 10;

      const target = this.getTargetBoardCell(e.clientX, e.clientY);
      let placed = false;

      if (!isQuickClick && target) {
        if (this.canFitAt(this.dragPiece.matrix, target.row, target.col)) {
          this.placePiece(this.dragPiece, this.dragPieceIndex, target.row, target.col);
          placed = true;
        }
      }

      // Cleanup drag
      if (this.ghostEl) {
        this.ghostEl.remove();
        this.ghostEl = null;
      }
      this.clearPreviews();
      this.isDragging = false;

      if (isQuickClick) {
        // Toggle selection for tap-to-place
        this.selectedPieceIndex = (this.selectedPieceIndex === this.dragPieceIndex) ? null : this.dragPieceIndex;
        this.renderTray();
      } else if (!placed) {
        this.selectedPieceIndex = null;
        this.renderTray();
      }

      this.dragPiece = null;
      this.dragPieceIndex = null;
    }

    onBoardClick(e) {
      if (this.selectedPieceIndex === null) return;
      const cellEl = e.target.closest('.cell');
      if (!cellEl) return;

      const r = parseInt(cellEl.dataset.row, 10);
      const c = parseInt(cellEl.dataset.col, 10);
      const piece = this.trayPieces[this.selectedPieceIndex];

      if (this.canFitAt(piece.matrix, r, c)) {
        this.placePiece(piece, this.selectedPieceIndex, r, c);
        this.selectedPieceIndex = null;
        this.clearPreviews();
        this.renderTray();
      }
    }

    getTargetBoardCell(clientX, clientY) {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const offsetY = isTouch ? -65 : 0;
      const targetY = clientY + offsetY;

      const boardRect = this.boardEl.getBoundingClientRect();
      if (
        clientX < boardRect.left ||
        clientX > boardRect.right ||
        targetY < boardRect.top ||
        targetY > boardRect.bottom
      ) {
        return null;
      }

      // Compute cell row & col centered under piece
      const cellSize = boardRect.width / 8;
      const pieceRows = this.dragPiece.matrix.length;
      const pieceCols = this.dragPiece.matrix[0].length;

      // Anchor top-left with centering offset
      const relX = clientX - boardRect.left - (pieceCols * cellSize) / 2;
      const relY = targetY - boardRect.top - (pieceRows * cellSize) / 2;

      let col = Math.round(relX / cellSize);
      let row = Math.round(relY / cellSize);

      col = Math.max(0, Math.min(8 - pieceCols, col));
      row = Math.max(0, Math.min(8 - pieceRows, row));

      return { row, col };
    }

    highlightPreview(matrix, startRow, startCol, canFit) {
      const rows = matrix.length;
      const cols = matrix[0].length;
      const className = canFit ? 'preview-valid' : 'preview-invalid';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (matrix[r][c] === 1) {
            const tr = startRow + r;
            const tc = startCol + c;
            if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
              const cellIdx = tr * 8 + tc;
              this.boardEl.children[cellIdx].classList.add(className);
            }
          }
        }
      }
    }

    clearPreviews() {
      Array.from(this.boardEl.children).forEach(cell => {
        cell.classList.remove('preview-valid', 'preview-invalid');
      });
    }

    // --- Place Piece, Detect Line Clears & Combos ---
    placePiece(piece, pieceIndex, startRow, startCol) {
      const rows = piece.matrix.length;
      const cols = piece.matrix[0].length;
      let blockCount = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (piece.matrix[r][c] === 1) {
            this.board[startRow + r][startCol + c] = piece.color;
            blockCount++;
          }
        }
      }

      piece.used = true;
      this.sound.playPlace();

      // Add base placement score
      this.score += blockCount;
      this.scoreEl.classList.remove('score-flash');
      void this.scoreEl.offsetWidth; // force reflow
      this.scoreEl.classList.add('score-flash');

      this.renderBoard();
      this.checkLineClears();
      this.renderTray();
      this.checkTrayPossibilities();
    }

    checkLineClears() {
      const fullRows = [];
      const fullCols = [];

      // Check rows
      for (let r = 0; r < 8; r++) {
        let isFull = true;
        for (let c = 0; c < 8; c++) {
          if (this.board[r][c] === 0) {
            isFull = false;
            break;
          }
        }
        if (isFull) fullRows.push(r);
      }

      // Check columns
      for (let c = 0; c < 8; c++) {
        let isFull = true;
        for (let r = 0; r < 8; r++) {
          if (this.board[r][c] === 0) {
            isFull = false;
            break;
          }
        }
        if (isFull) fullCols.push(c);
      }

      const totalLines = fullRows.length + fullCols.length;

      if (totalLines > 0) {
        this.comboCount++;
        const lineScores = [0, 10, 30, 60, 100, 150, 220, 300];
        const lineScore = lineScores[Math.min(totalLines, lineScores.length - 1)] || totalLines * 30;
        const comboBonus = (this.comboCount > 1) ? this.comboCount * 15 : 0;
        this.score += lineScore + comboBonus;

        this.sound.playBlast(totalLines);
        if (this.comboCount > 1) {
          this.sound.playCombo(this.comboCount);
          this.showComboBanner(this.comboCount);
        }

        // Animate blasting cells
        const clearedCells = new Set();
        fullRows.forEach(r => {
          for (let c = 0; c < 8; c++) clearedCells.add(`${r},${c}`);
        });
        fullCols.forEach(c => {
          for (let r = 0; r < 8; r++) clearedCells.add(`${r},${c}`);
        });

        clearedCells.forEach(coord => {
          const [r, c] = coord.split(',').map(Number);
          const idx = r * 8 + c;
          this.boardEl.children[idx].classList.add('blasting');
        });

        setTimeout(() => {
          clearedCells.forEach(coord => {
            const [r, c] = coord.split(',').map(Number);
            this.board[r][c] = 0;
          });
          this.renderBoard();
          this.updateScoreDisplay();
        }, 360);

      } else {
        this.comboCount = 0;
        this.updateScoreDisplay();
      }
    }

    showComboBanner(level) {
      let text = `COMBO x${level}!`;
      if (level >= 4) text = `SUPER COMBO x${level}!`;
      if (level >= 6) text = `UNSTOPPABLE x${level}!`;

      this.comboBannerEl.textContent = text;
      this.comboBannerEl.classList.add('show');
      setTimeout(() => {
        this.comboBannerEl.classList.remove('show');
      }, 900);
    }

    triggerGameOver() {
      this.sound.playGameOver();
      this.modalScoreEl.textContent = this.score;
      this.modalBestEl.textContent = this.bestScore;
      this.gameOverModal.showModal();
    }
  }

  // Launch on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    new BlockBlastGame();
  });
})();
