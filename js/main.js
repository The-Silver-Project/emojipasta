import bake from './bakery/bake';
import mapping from './mapping.json';

const result = document.getElementById('result');
const fg = document.getElementById('fg');
const bg = document.getElementById('bg');
const text = document.getElementById('text');
const swap = document.getElementById('swap');
const lights = document.getElementById('lights');
let lightStatus = 1;
const fgInputPreview = document.getElementById('fg-input-preview');
const bgInputPreview = document.getElementById('bg-input-preview');

function replaceStr(str, rep) {
  if (!rep.startsWith(':') || !rep.endsWith(':')) return str;
  const key = rep.slice(1, -1);
  if (!mapping[key]) return str;
  return str.replaceAll(rep, `&#x${mapping[key]}`);
}

function getChangedStr(str, bgVal, fgVal) {
  return replaceStr(replaceStr(str, fgVal), bgVal);
}

function run() {
  const str = bake(text.value, { fg: fg.value, bg: bg.value });

  const changedStr = getChangedStr(str, bg.value, fg.value);
  result.innerHTML = changedStr;

  navigator.clipboard.writeText(str);
}

function updateInputPreview(value, target) {
  if (!value.startsWith(':') || !value.endsWith(':')) {
    target.innerHTML = '';
    return;
  }
  const key = value.slice(1, -1);
  if (!mapping[key]) {
    target.innerHTML = '';
    return;
  }
  target.innerHTML = `&#x${mapping[key]}`;
}

fg.addEventListener('input', (e) => {
  updateInputPreview(e.target.value, fgInputPreview);
  run();
});

bg.addEventListener('input', (e) => {
  updateInputPreview(e.target.value, bgInputPreview);
  run();
});

text.addEventListener('input', run);

swap.addEventListener('click', () => {
  const temp = fg.value;
  fg.value = bg.value;
  bg.value = temp;
  updateInputPreview(fg.value, fgInputPreview);
  updateInputPreview(bg.value, bgInputPreview);
  run();
});

lights.addEventListener('click', () => {
  if (lightStatus === 1) {
    document.body.style.backgroundColor = 'black';
    lights.innerHTML = 'lights on';
    lightStatus = 0;
  } else {
    document.body.style.backgroundColor = 'white';
    lights.innerHTML = 'lights off';
    lightStatus = 1;
  }
});

run();
