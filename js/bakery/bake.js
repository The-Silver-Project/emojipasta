import getCharMapping, { BG, FG } from './recipe';

// [top, right, bottom, left]
function parseMarginStr(margin) {
  const margins = `${margin}`.split(' ').map((val) => Number.parseInt(val, 10));
  if (margins.length === 1) return [margins[0], margins[0], margins[0], margins[0]];
  if (margins.length === 2) return [margins[0], margins[1], margins[0], margins[1]];
  if (margins.length === 3) return [margins[0], margins[1], margins[2], margins[1]];
  return margins;
}

function addMargin(mappings, margin) {
  const mappingLength = mappings[0].length;
  const [top, right, bottom, left] = parseMarginStr(margin);

  // Add top & bottom margin
  for (let m = 1; m <= top; m += 1) mappings.unshift(BG.source.repeat(mappingLength));
  for (let m = 1; m <= bottom; m += 1) mappings.push(BG.source.repeat(mappingLength));

  return mappings
    // Add left & right margin
    .map((rowMappings) => BG.source.repeat(left) + rowMappings + BG.source.repeat(right))
    .join('\n');
}

function addPadding(mappings, padding) {
  return mappings.map((rowMappings) => rowMappings.join(BG.source.repeat(padding)));
}

function convert(inputStr, {
  fg = '#', bg = '-', padding = 1, margin = 1,
} = {}) {
  const mappings = [[], [], [], [], []];
  const inputCharArray = inputStr.toLowerCase().split('');
  if (!inputCharArray.length) return '';

  inputCharArray.forEach((char) => {
    mappings.forEach((rowMappings, row) => {
      rowMappings.push(getCharMapping(char, row));
    });
  });

  const paddedMappings = addPadding(mappings, padding);
  const finalMapping = addMargin(paddedMappings, margin);

  return finalMapping
    .replace(BG, bg)
    .replace(FG, fg);
}

export default function bake(text, options) {
  return text
    .split('\n')
    .map((str) => convert(str, options))
    .join('\n');
}
