'use strict';
const { PALETTE, MAX_ATTEMPTS, createGame } = CodeSecret;
const game = createGame();
const byId = id => document.getElementById(id);
let draft = [null, null, null, null];
let selected = 0;

function colored(element, color) {
  if (color) {
    element.classList.add('colored');
    element.style.setProperty('--color', `var(--${color})`);
  }
  return element;
}

function message(text, kind = '') {
  byId('message').textContent = text;
  byId('message').className = `message ${kind}`;
}

function renderDraft() {
  const ended = game.getState().status !== 'playing';
  byId('draft').replaceChildren(...draft.map((color, index) => {
    const button = colored(document.createElement('button'), color);
    button.type = 'button';
    button.classList.add('slot');
    button.classList.toggle('selected', selected === index && !ended);
    button.textContent = color ? '' : '+';
    button.disabled = ended;
    button.setAttribute('aria-label', `Emplacement ${index + 1} : ${color || 'vide'}`);
    button.setAttribute('aria-pressed', String(selected === index));
    button.addEventListener('click', () => { selected = index; renderDraft(); });
    return button;
  }));
}

function render() {
  const state = game.getState();
  const ended = state.status !== 'playing';
  byId('rows').replaceChildren(...Array.from({ length: MAX_ATTEMPTS }, (_, index) => {
    const entry = state.history[index];
    const active = !ended && index === state.attempts;
    const row = document.createElement('div');
    row.className = `game-row${active ? ' active' : ''}${entry && entry.exact === 4 ? ' win-row' : ''}`;
    const number = document.createElement('span');
    number.className = 'row-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const pegs = document.createElement('div');
    pegs.className = 'pegs';
    for (let position = 0; position < 4; position++) {
      const color = entry ? entry.guess[position] : active ? draft[position] : null;
      const peg = colored(document.createElement('span'), color);
      peg.classList.add('peg');
      if (color) peg.setAttribute('aria-label', color);
      pegs.append(peg);
    }
    const feedback = document.createElement('div');
    feedback.className = entry ? 'feedback' : 'empty-feedback';
    if (entry) {
      feedback.setAttribute('aria-label', `${entry.exact} bien placées, ${entry.misplaced} mal placées`);
      feedback.innerHTML = `<span class="feedback-item"><i class="feedback-dot exact" aria-hidden="true"></i>${entry.exact}</span><span class="feedback-item"><i class="feedback-dot misplaced" aria-hidden="true"></i>${entry.misplaced}</span>`;
    } else feedback.textContent = '····';
    row.append(number, pegs, feedback);
    return row;
  }));
  byId('secret').replaceChildren(...Array.from({ length: 4 }, (_, index) => {
    const color = state.secret && state.secret[index];
    const peg = colored(document.createElement('span'), color);
    peg.textContent = color ? '' : '?';
    if (color) peg.setAttribute('aria-label', color);
    return peg;
  }));
  byId('secret').setAttribute('aria-label', state.secret ? `Code secret : ${state.secret.join(', ')}` : 'Quatre couleurs cachées');
  byId('secret').classList.toggle('revealed', ended);
  byId('attempt-counter').textContent = ended ? `${state.attempts} / 10 ESSAIS` : `ESSAI ${String(state.attempts + 1).padStart(2, '0')} / 10`;
  byId('submit').disabled = ended;
  document.querySelectorAll('.color-choice').forEach(button => { button.disabled = ended; });
  byId('composer-title').textContent = state.status === 'won' ? 'Le secret est percé !' : state.status === 'lost' ? 'Le mystère est dévoilé.' : 'Suivez votre intuition.';
  byId('composer-description').textContent = ended ? 'Le code est révélé sur le plateau. Une autre partie ?' : 'Sélectionnez un emplacement, puis une couleur.';
  byId('turn-title').textContent = state.status === 'won' ? 'BIEN JOUÉ !' : state.status === 'lost' ? 'PARTIE TERMINÉE' : 'À VOUS DE JOUER';
  byId('board-status').textContent = ended ? state.status === 'won' ? `Victoire en ${state.attempts} essai${state.attempts > 1 ? 's' : ''}. À vous le secret !` : 'Dix essais écoulés. Un nouveau secret vous attend.' : state.attempts === 0 ? 'Le secret est bien gardé. À vous de jouer.' : `${state.remaining} essai${state.remaining > 1 ? 's' : ''} restant${state.remaining > 1 ? 's' : ''}. Chaque indice vous rapproche.`;
  renderDraft();
}

PALETTE.forEach(color => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'color-choice';
  button.setAttribute('aria-label', `Choisir ${color}`);
  const swatch = document.createElement('span');
  swatch.className = 'color-swatch';
  swatch.style.setProperty('--color', `var(--${color})`);
  const label = document.createElement('span');
  label.textContent = color.charAt(0).toUpperCase() + color.slice(1);
  button.append(swatch, label);
  button.addEventListener('click', () => {
    if (game.getState().status !== 'playing') return;
    draft[selected] = color;
    const nextEmpty = draft.findIndex((value, index) => index > selected && !value);
    const firstEmpty = draft.findIndex(value => !value);
    selected = nextEmpty >= 0 ? nextEmpty : firstEmpty >= 0 ? firstEmpty : (selected + 1) % 4;
    message(draft.every(Boolean) ? 'Tout est prêt. Validez ou ajustez votre proposition.' : 'Continuez : les couleurs peuvent se répéter.');
    render();
  });
  byId('palette').append(button);
});

byId('submit').addEventListener('click', () => {
  const result = game.submit(draft);
  if (!result.ok) { message(result.error, 'error'); return; }
  if (result.state.status === 'won') message(`Bravo ! Vous avez trouvé le code en ${result.state.attempts} essai${result.state.attempts > 1 ? 's' : ''}.`, 'success');
  else if (result.state.status === 'lost') message('Les dix essais sont écoulés. Lancez une nouvelle partie pour retenter votre chance.');
  else {
    message(`${result.exact} bien placée${result.exact > 1 ? 's' : ''}, ${result.misplaced} mal placée${result.misplaced > 1 ? 's' : ''}. À vous d’affiner !`);
    draft = [null, null, null, null];
    selected = 0;
  }
  render();
});
byId('new-game').addEventListener('click', () => {
  game.newGame();
  draft = [null, null, null, null];
  selected = 0;
  message('Un nouveau secret vous attend. À vous de jouer !');
  render();
});
render();
