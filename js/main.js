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
const bgPicker = document.getElementById('bg-picker');
const fgPicker = document.getElementById('fg-picker');
let selected = -1;
let filtered = [];
let activePicker = null;

Object.keys(mapping).forEach((key) => {
  [mapping[key]] = mapping[key].split('-');
});

const list = Object.keys(mapping).map((key) => ({ key, value: mapping[key].split('-')[0] }));

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

function getFiltered(value) {
  if (value.length < 2) {
    selected = -1;
    return [];
  }
  const cleaned = value.trim().replaceAll(':', '');
  const l = list.filter((item) => item.key.includes(cleaned));
  if (!l.length) {
    selected = -1;
    return [];
  }
  selected = 0;
  return l;
}

function resetPicker() {
  setTimeout(() => {
    bgPicker.innerHTML = '';
    fgPicker.innerHTML = '';
    selected = -1;
    activePicker = null;
  }, 100);
}

function handlePickerClick(index) {
  const el = activePicker === 'bg' ? bg : fg;
  el.value = `:${filtered[index].key}:`;
  el.dispatchEvent(new Event('input'));
  resetPicker();
}

function renderPicker(target) {
  const html = filtered.map((item, index) => `
    <div class="picker-entry ${index === selected ? 'selected' : ''}">
      <div class="input-preview">&#x${item.value};</div>
      <div class="entry-text">${item.key}</div>
    </div>
  `).join('\n');
  target.innerHTML = html;
  [...target.children].forEach((el, index) => {
    el.onmousedown = handlePickerClick.bind(null, index);
  });
}

function updatePicker(value, target) {
  filtered = getFiltered(value);
  renderPicker(target);
}

fg.addEventListener('input', (e) => {
  updateInputPreview(e.target.value, fgInputPreview);
  updatePicker(e.target.value, fgPicker);
  activePicker = 'fg';
  run();
});

bg.addEventListener('input', (e) => {
  updateInputPreview(e.target.value, bgInputPreview);
  updatePicker(e.target.value, bgPicker);
  activePicker = 'bg';
  run();
});

bg.addEventListener('blur', () => {
  resetPicker();
});

fg.addEventListener('blur', () => {
  resetPicker();
});

text.addEventListener('input', run);

swap.addEventListener('click', () => {
  const temp = fg.value;
  fg.value = bg.value;
  bg.value = temp;
  updateInputPreview(fg.value, fgInputPreview);
  updateInputPreview(bg.value, bgInputPreview);
  resetPicker();
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

function scrollInView(picker) {
  const start = picker.scrollTop;
  const end = start + 33 * 6;
  const cur = selected * 33;
  if (cur < start) {
    picker.scrollTop = cur;
  } else if (cur >= end) {
    picker.scrollTop = cur - 33 * 5;
  }
}

window.addEventListener('keyup', (e) => {
  if (e.code === 'Enter') {
    if (selected !== -1) {
      const el = activePicker === 'bg' ? bg : fg;
      el.value = `:${filtered[selected].key}:`;
      el.dispatchEvent(new Event('input'));
      resetPicker();
    }
  } else if (e.code === 'ArrowDown') {
    if (selected !== -1 && selected < filtered.length - 1) {
      selected += 1;
      renderPicker(activePicker === 'bg' ? bgPicker : fgPicker);
      scrollInView(activePicker === 'bg' ? bgPicker : fgPicker);
    }
  } else if (e.code === 'ArrowUp') {
    if (selected > 0) {
      selected -= 1;
      renderPicker(activePicker === 'bg' ? bgPicker : fgPicker);
      scrollInView(activePicker === 'bg' ? bgPicker : fgPicker);
    }
  }
});

run();
