import bake from './bakery/bake';

const result = document.getElementById('result');
const fg = document.getElementById('fg');
const bg = document.getElementById('bg');
const text = document.getElementById('text');

function run() {
  const str = bake(text.value, { fg: fg.value, bg: bg.value });
  result.innerText = str;
}

fg.addEventListener('input', run);
bg.addEventListener('input', run);
text.addEventListener('input', run);

run();
