import bake from './bakery/bake';

const result = document.getElementById('result');
const fg = document.getElementById('fg');
const bg = document.getElementById('bg');
const text = document.getElementById('text');
const swap = document.getElementById('swap');

function run() {
  const str = bake(text.value, { fg: fg.value, bg: bg.value });
  result.innerText = str;
}

fg.addEventListener('input', run);
bg.addEventListener('input', run);
text.addEventListener('input', run);

swap.addEventListener('click', () => {
  const temp = fg.value;
  fg.value = bg.value;
  bg.value = temp;
  run();
});

run();
