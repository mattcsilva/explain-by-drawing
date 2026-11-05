#!/usr/bin/env node
'use strict';
// Node.js 18+, standard library only. Pure layout plus two renderers.
const fs = require('node:fs');
const path = require('node:path');
const COLORS = {
  blue: ['#1971c2', '#e7f5ff'], purple: ['#6741d9', '#f3f0ff'],
  green: ['#2b8a3e', '#ebfbee'], amber: ['#9c5700', '#fff4e6']
};
const INK = '#243447', PAPER = '#fffdf7', M = 48;
const DEFAULT_CAPTIONS = {
  example: 'Example:', change: 'What changes:', stop: 'When to stop:',
  takeaway: 'Takeaway:', limit: 'Limit of the example:'
};
function need(ok, message) { if (!ok) throw new Error(message); }
function str(s, label, max = 700) {
  need(typeof s === 'string' && s.trim().length > 0 && s.length <= max,
    `${label}: enter nonempty text of up to ${max} characters.`);
  need(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(s), `${label}: invalid control character.`);
}
function validate(s) {
  need(s && typeof s === 'object', 'Input must be a JSON object.');
  need(['sequence', 'cycle', 'compare', 'regions'].includes(s.layout), 'Choose the sequence, cycle, compare or regions layout.');
  ['question', 'example', 'takeaway', 'limit'].forEach(k => str(s[k], k));
  if (s.captions !== undefined) {
    need(s.captions && typeof s.captions === 'object' && !Array.isArray(s.captions), 'captions must be an object.');
    for (const [key, value] of Object.entries(s.captions)) {
      need(Object.hasOwn(DEFAULT_CAPTIONS, key), `Unknown caption key: ${key}.`);
      if (value !== '') str(value, `Caption ${key}`, 100);
    }
  }
  need(Array.isArray(s.nodes), 'nodes must be an array.');
  const counts = { sequence: [2, 3, 4], cycle: [4], compare: [2], regions: [2] };
  need(counts[s.layout].includes(s.nodes.length), `Valid node counts for ${s.layout}: ${counts[s.layout].join(', ')}.`);
  const ids = new Set();
  s.nodes.forEach((n, i) => {
    need(n && typeof n === 'object', `Invalid node at position ${i + 1}.`);
    str(n.id, 'id', 80); need(!ids.has(n.id), `Duplicate ID: ${n.id}`); ids.add(n.id);
    str(n.title, `Title of ${n.id}`, 150); str(n.body, `Explanation of ${n.id}`);
    if (n.value !== undefined) str(n.value, `Example value in ${n.id}`, 180);
    need(!n.color || COLORS[n.color], `Unknown color in ${n.id}.`);
    if (s.layout === 'regions') {
      need(Array.isArray(n.items) && n.items.length >= 1 && n.items.length <= 3,
        `${n.id}: include one to three components in items.`);
      n.items.forEach((item, j) => str(item, `${n.id}.items[${j}]`, 240));
    } else need(n.items === undefined, 'The regions layout is the only layout that draws items.');
  });
  let pairs = [];
  if (s.layout === 'sequence') pairs = s.nodes.slice(1).map((n, i) => [s.nodes[i].id, n.id]);
  if (s.layout === 'cycle') pairs = s.nodes.map((n, i) => [n.id, s.nodes[(i + 1) % 4].id]);
  if (s.layout === 'regions') pairs = [[s.nodes[0].id, s.nodes[1].id], [s.nodes[1].id, s.nodes[0].id]];
  need(Array.isArray(s.links) && s.links.length === pairs.length, `Expected ${pairs.length} entries in links.`);
  pairs.forEach(([from, to], i) => {
    const e = s.links[i];
    need(e && e.from === from && e.to === to, `Link ${i + 1} must connect ${from} to ${to}.`);
    str(e.label, `Label for link ${i + 1}`, 120);
  });
  if (s.layout === 'cycle') str(s.stop, 'Cycle exit condition (stop)', 350);
  if (s.layout === 'compare') str(s.change, 'Difference between cases (change)', 350);
}
// Conservative monospace measurement. Does not shrink fonts to fit content.
// Latin text is the supported default; CJK/emoji are rejected for manual layout.
function wrap(text, width, size, maxLines = 30) {
  need(!/[\p{Extended_Pictographic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text),
    'This layout measures Latin text. For emoji or CJK text, lay out the board manually and check the font.');
  const cap = Math.floor(width / (size * 0.65));
  need(cap >= 5, 'The text area is too narrow.');
  const lines = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/u).filter(Boolean)) {
      need([...word].length <= cap, `Word or identifier too long: ${word}. Explain a shorter label or split the board.`);
      if ([...line + (line ? ' ' : '') + word].length > cap) { lines.push(line); line = word; }
      else line += (line ? ' ' : '') + word;
    }
    lines.push(line);
  }
  need(lines.length <= maxLines, `Text requires ${lines.length} lines. This section fits ${maxLines}. Split the explanation across boards.`);
  return lines;
}
function buildScene(spec) {
  validate(spec);
  const W = spec.layout === 'sequence' && spec.nodes.length === 4 ? 1680 : 1280;
  const captions = { ...DEFAULT_CAPTIONS, ...spec.captions };
  function captioned(key) {
    return captions[key] ? `${captions[key]} ${spec[key]}` : spec[key];
  }
  const scene = { title: spec.question, width: W, height: 0, elements: [], cards: [], links: [] };
  let serial = 0;
  const add = e => { e.id = `ed-${++serial}`; scene.elements.push(e); return e; };
  function text(x, y, width, value, size = 22, color = INK, maxLines = 30) {
    const lines = wrap(value, width, size, maxLines);
    return add({ type: 'text', x, y, width, height: lines.length * size * 1.35,
      lines, size, color });
  }
  function rect(x, y, width, height, color, fill) {
    return add({ type: 'rect', x, y, width, height, color, fill });
  }
  function cardPlan(n, width) {
    const inner = width - 40;
    const title = wrap(n.title, inner, 26, 4), body = wrap(n.body, inner, 22, 7);
    const items = (n.items || []).map(v => ({ value: v, h: wrap(v, inner - 32, 21, 5).length * 21 * 1.35 + 28 }));
    const valueHeight = n.value ? wrap(n.value, inner, 28, 3).length * 28 * 1.35 + 18 : 0;
    const height = 20 + title.length * 26 * 1.35 + 16 + valueHeight + body.length * 22 * 1.35 + 24
      + items.reduce((sum, it) => sum + it.h + 16, 0);
    return { height: Math.ceil(height), items };
  }
  function card(n, x, y, width, height, index) {
    const [color, fill] = COLORS[n.color || ['blue', 'purple', 'green', 'amber'][index]];
    rect(x, y, width, height, color, fill);
    let cursor = y + 20;
    cursor += text(x + 20, cursor, width - 40, n.title, 26, color, 4).height + 16;
    if (n.value) cursor += text(x + 20, cursor, width - 40, n.value, 28, color, 3).height + 18;
    cursor += text(x + 20, cursor, width - 40, n.body, 22, INK, 7).height + 24;
    for (const it of cardPlan(n, width).items) {
      rect(x + 20, cursor, width - 40, it.h, color, '#ffffff');
      text(x + 36, cursor + 14, width - 72, it.value, 21, INK, 5);
      cursor += it.h + 16;
    }
    const c = { id: n.id, x, y, width, height };
    scene.cards.push(c); return c;
  }
  function connection(edge, points, labelBox, color = INK) {
    add({ type: 'arrow', points, color });
    const horizontal = points.every(p => p[1] === points[0][1]);
    const labelHeight = wrap(edge.label, labelBox.width, 18, 4).length * 18 * 1.35;
    const labelY = horizontal ? points[0][1] - 18 - labelHeight : labelBox.y;
    text(labelBox.x, labelY, labelBox.width, edge.label, 18, color, 4);
    scene.links.push({ ...edge, points });
  }
  let top = 40;
  top += text(M, top, W - 2 * M, spec.question, 34, INK, 3).height + 22;
  top += text(M, top, W - 2 * M, captioned('example'), 21, '#5c677d', 4).height + 34;
  if (spec.layout === 'compare') top += text(M, top, W - 2 * M, captioned('change'), 22, COLORS.amber[0], 4).height + 28;
  let bottom;
  if (spec.layout === 'sequence') {
    const gap = 172, width = (W - 2 * M - gap * (spec.nodes.length - 1)) / spec.nodes.length;
    const h = Math.max(240, ...spec.nodes.map(n => cardPlan(n, width).height));
    const cards = spec.nodes.map((n, i) => card(n, M + i * (width + gap), top, width, h, i));
    spec.links.forEach((e, i) => {
      const c = cards[i], d = cards[i + 1], mid = top + h / 2;
      connection(e, [[c.x + width + 10, mid], [d.x - 10, mid]],
        { x: c.x + width + 14, y: mid - 112, width: gap - 28 }, COLORS.purple[0]);
    });
    bottom = top + h;
  } else if (spec.layout === 'cycle') {
    const width = 460, gapY = 180, right = W - M - width;
    const h = Math.max(240, ...spec.nodes.map(n => cardPlan(n, width).height));
    const positions = [[M, top], [right, top], [right, top + h + gapY], [M, top + h + gapY]];
    const cs = spec.nodes.map((n, i) => card(n, ...positions[i], width, h, i));
    connection(spec.links[0], [[cs[0].x + width + 12, top + h / 2], [right - 12, top + h / 2]],
      { x: M + width + 24, y: top + h / 2 - 112, width: right - M - width - 48 }, COLORS.blue[0]);
    connection(spec.links[1], [[right + width / 2, top + h + 12], [right + width / 2, top + h + gapY - 12]],
      { x: right + width / 2 + 24, y: top + h + 36, width: width / 2 - 24 }, COLORS.green[0]);
    connection(spec.links[2], [[right - 12, cs[2].y + h / 2], [M + width + 12, cs[2].y + h / 2]],
      { x: M + width + 24, y: cs[2].y + h / 2 - 112, width: right - M - width - 48 }, COLORS.green[0]);
    connection(spec.links[3], [[M + width / 2, cs[3].y - 12], [M + width / 2, top + h + 12]],
      { x: M, y: top + h + 36, width: width / 2 - 24 }, COLORS.purple[0]);
    bottom = top + 2 * h + gapY;
    bottom += 26 + text(M, bottom + 26, W - 2 * M, captioned('stop'), 22, COLORS.amber[0], 5).height;
  } else {
    const width = spec.layout === 'regions' ? 420 : (W - 2 * M - 48) / 2;
    const h = Math.max(spec.layout === 'regions' ? 400 : 240, ...spec.nodes.map(n => cardPlan(n, width).height));
    const cs = spec.nodes.map((n, i) => card(n, i ? W - M - width : M, top, width, h, i));
    if (spec.layout === 'regions') {
      [0, 1].forEach(i => {
        const y = top + h * (i ? 0.75 : 0.3);
        const start = [cs[0].x + width + 12, y], end = [cs[1].x - 12, y];
        connection(spec.links[i], i ? [end, start] : [start, end],
          { x: cs[0].x + width + 24, y: y - 112, width: cs[1].x - cs[0].x - width - 48 },
          COLORS[i ? 'green' : 'blue'][0]);
      });
    }
    bottom = top + h;
  }
  bottom += 40;
  bottom += text(M, bottom, W - 2 * M, captioned('takeaway'), 24, INK, 5).height + 22;
  bottom += text(M, bottom, W - 2 * M, captioned('limit'), 20, COLORS.amber[0], 5).height;
  scene.height = Math.ceil(Math.max(700, bottom + 48));
  need(scene.height <= 1600, 'Board exceeds 1600 units in height. Give prerequisites and details separate boards.');
  checkScene(scene);
  return scene;
}
function overlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
function checkScene(scene) {
  const texts = scene.elements.filter(e => e.type === 'text');
  for (const e of scene.elements.filter(e => e.type !== 'arrow')) {
    need(e.x >= 0 && e.y >= 0 && e.x + e.width <= scene.width + 0.1 && e.y + e.height <= scene.height + 0.1, `Element outside the board: ${e.id}.`);
  }
  texts.forEach((a, i) => texts.slice(i + 1).forEach(b => need(!overlap(a, b), `Text elements overlap: ${a.id}, ${b.id}.`)));
  for (const e of scene.elements.filter(e => e.type === 'arrow')) {
    for (let i = 1; i < e.points.length; i++) {
      const [a, b] = [e.points[i - 1], e.points[i]];
      need([a,b].every(p => p[0] >= 0 && p[1] >= 0 && p[0] <= scene.width && p[1] <= scene.height), 'Arrow outside the board.');
      const segment = { x: Math.min(a[0], b[0]) - 2, y: Math.min(a[1], b[1]) - 2,
        width: Math.abs(a[0] - b[0]) + 4, height: Math.abs(a[1] - b[1]) + 4 };
      texts.forEach(t => need(!overlap(segment, t), `Arrow crosses text: ${t.id}.`));
      scene.cards.forEach(c => need(!overlap(segment, c), `Arrow crosses a card: ${c.id}.`));
    }
  }
}
const escapeXML = s => s.replace(/[<>&"']/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&apos;' }[c]));
function toSVG(scene) {
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}" role="img">`,
    `<title>${escapeXML(scene.title || 'Diagram')}</title>`, `<rect width="100%" height="100%" fill="${PAPER}"/>`];
  for (const e of scene.elements) {
    if (e.type === 'rect') parts.push(`<rect x="${e.x}" y="${e.y}" width="${e.width}" height="${e.height}" rx="5" stroke="${e.color}" stroke-width="2" fill="${e.fill}"/>`);
    if (e.type === 'text') parts.push(`<text fill="${e.color}" font-family="monospace" font-size="${e.size}">${e.lines.map((line, i) => `<tspan x="${e.x}" y="${e.y + e.size + i * e.size * 1.35}">${escapeXML(line)}</tspan>`).join('')}</text>`);
    if (e.type === 'arrow') {
      const p = e.points, end = p.at(-1), prev = p.at(-2), angle = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
      const arms = [-0.5, 0.5].map(d => [end[0] - 13 * Math.cos(angle + d), end[1] - 13 * Math.sin(angle + d)]);
      parts.push(`<polyline points="${p.map(v => v.join(',')).join(' ')}" fill="none" stroke="${e.color}" stroke-width="2.5"/>`,
        `<polyline points="${[arms[0], end, arms[1]].map(v => v.join(',')).join(' ')}" fill="none" stroke="${e.color}" stroke-width="2.5"/>`);
    }
  }
  return parts.join('\n') + '\n</svg>\n';
}
function toExcalidraw(scene) {
  const base = (e, i) => ({ id: e.id, type: e.type === 'rect' ? 'rectangle' : e.type,
    x: e.x, y: e.y, width: e.width, height: e.height, angle: 0, strokeColor: e.color,
    backgroundColor: e.fill || 'transparent', fillStyle: 'solid', strokeWidth: 2,
    strokeStyle: 'solid', roughness: 1, opacity: 100, groupIds: [], frameId: null,
    roundness: null, seed: 1000 + i, version: 1, versionNonce: 2000 + i,
    isDeleted: false, boundElements: null, updated: 1, link: null, locked: false });
  const elements = scene.elements.map((e, i) => {
    const b = base(e, i);
    if (e.type === 'text') Object.assign(b, { fontSize: e.size, fontFamily: 3,
      text: e.lines.join('\n'), originalText: e.lines.join('\n'), textAlign: 'left',
      verticalAlign: 'top', containerId: null, autoResize: false, lineHeight: 1.35 });
    if (e.type === 'arrow') {
      const x = Math.min(...e.points.map(p => p[0])), y = Math.min(...e.points.map(p => p[1]));
      Object.assign(b, { x, y, width: Math.max(...e.points.map(p => p[0])) - x,
        height: Math.max(...e.points.map(p => p[1])) - y, points: e.points.map(p => [p[0] - x, p[1] - y]),
        startBinding: null, endBinding: null, startArrowhead: null, endArrowhead: 'arrow', elbowed: false });
    }
    return b;
  });
  return { type: 'excalidraw', version: 2, source: 'explain-by-drawing', elements,
    appState: { viewBackgroundColor: PAPER, gridSize: null }, files: {} };
}
function main(argv) {
  need(argv.length === 2, 'Usage: node draw.cjs input.json new-output-directory');
  const spec = JSON.parse(fs.readFileSync(argv[0], 'utf8').replace(/^\uFEFF/, ''));
  const scene = buildScene(spec), out = path.resolve(argv[1]);
  need(!fs.existsSync(out), 'The output directory already exists. Choose a new directory to preserve existing drawings.');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'board.svg'), toSVG(scene));
  fs.writeFileSync(path.join(out, 'board.excalidraw'), JSON.stringify(toExcalidraw(scene), null, 2));
  fs.writeFileSync(path.join(out, 'verification.json'), JSON.stringify({
    width: scene.width, height: scene.height, elements: scene.elements.length,
    geometry: 'passed', semanticReview: 'required', renderedReview: 'required'
  }, null, 2));
  console.log(JSON.stringify({ output: out, elements: scene.elements.length, width: scene.width, height: scene.height }));
}
module.exports = { validate, wrap, buildScene, checkScene, toSVG, toExcalidraw };
if (require.main === module) { try { main(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exitCode = 1; } }
