(function (root) {
  'use strict';
  const PALETTE = Object.freeze(['rouge', 'bleu', 'vert', 'jaune', 'orange', 'violet']);
  const MAX_ATTEMPTS = 10;

  function score(secret, guess) {
    let exact = 0;
    const remainingSecret = {};
    const remainingGuess = {};
    for (let i = 0; i < 4; i++) {
      if (secret[i] === guess[i]) exact++;
      else {
        remainingSecret[secret[i]] = (remainingSecret[secret[i]] || 0) + 1;
        remainingGuess[guess[i]] = (remainingGuess[guess[i]] || 0) + 1;
      }
    }
    const misplaced = PALETTE.reduce((sum, color) => sum + Math.min(remainingSecret[color] || 0, remainingGuess[color] || 0), 0);
    return { exact, misplaced };
  }

  function createGame(random = Math.random) {
    let secret, history, status;
    function newGame() {
      secret = Array.from({ length: 4 }, () => PALETTE[Math.floor(random() * PALETTE.length)]);
      history = [];
      status = 'playing';
      return getState();
    }
    function getState() {
      return {
        status,
        attempts: history.length,
        remaining: MAX_ATTEMPTS - history.length,
        history: history.map(entry => ({ guess: entry.guess.slice(), exact: entry.exact, misplaced: entry.misplaced })),
        secret: status === 'playing' ? null : secret.slice()
      };
    }
    function submit(guess) {
      if (status !== 'playing') return { ok: false, error: 'La partie est terminée. Lancez une nouvelle partie pour rejouer.' };
      if (!Array.isArray(guess) || guess.length !== 4 || Array.from(guess).some(color => color == null || color === '')) {
        return { ok: false, error: 'Votre proposition est incomplète : choisissez une couleur pour chacun des quatre emplacements.' };
      }
      if (guess.some(color => !PALETTE.includes(color))) {
        return { ok: false, error: 'Couleur non autorisée. Utilisez uniquement : rouge, bleu, vert, jaune, orange, violet.' };
      }
      const result = score(secret, guess);
      history.push({ guess: guess.slice(), exact: result.exact, misplaced: result.misplaced });
      if (result.exact === 4) status = 'won';
      else if (history.length === MAX_ATTEMPTS) status = 'lost';
      return { ok: true, exact: result.exact, misplaced: result.misplaced, state: getState() };
    }
    newGame();
    return Object.freeze({ newGame, submit, getState });
  }
  const api = Object.freeze({ PALETTE, MAX_ATTEMPTS, score, createGame });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CodeSecret = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
