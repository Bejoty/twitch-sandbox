const selected = [];
const gamesInput = document.querySelector('#gamesInput');
const selectBtn = document.querySelector('.btn-select');

const toggleSelected = e => {
  let el = e.target;
  while (!el.classList.contains('game')) {
    el = el.parentElement;
  }
  if (el.classList.contains('game-selected')) {
    el.classList.remove('game-selected');
    selected.splice(selected.indexOf(el.id), 1);
    gamesInput.value = selected.join('-');
    selectBtn.value = `Select ${selected.length} Game${
      selected.length === 1 ? '' : 's'
    }`;
  } else {
    el.classList.add('game-selected');
    selected.push(el.id);
    gamesInput.value = selected.join('-');
    selectBtn.value = `Select ${selected.length} Game${
      selected.length === 1 ? '' : 's'
    }`;
  }
};

document.querySelectorAll('.game').forEach(game => {
  game.addEventListener('click', toggleSelected);
});
