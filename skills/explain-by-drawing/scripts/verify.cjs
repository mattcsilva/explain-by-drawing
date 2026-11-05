'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { buildScene, toSVG, toExcalidraw, checkScene } = require('./draw.cjs');
const dir = path.resolve(__dirname, '../assets/examples');
const specs = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
let count = 0;
function test(name, fn) { fn(); count++; console.log(`OK ${name}`); }
for (const spec of specs) {
  test(`${spec.layout}: geometry, content and export`, () => {
    const scene = buildScene(spec), doc = toExcalidraw(scene);
    assert.equal(scene.cards.length, spec.nodes.length);
    assert.equal(scene.links.length, spec.links.length);
    assert.equal(new Set(doc.elements.map(e => e.id)).size, doc.elements.length);
    assert.equal(doc.type, 'excalidraw');
    const all = doc.elements.filter(e => e.type === 'text').map(e => e.text).join(' ').replace(/\s+/g, ' ');
    for (const node of spec.nodes) assert.ok(all.includes(node.body.replace(/\s+/g, ' ')));
    for (const e of doc.elements) {
      assert.ok(Number.isFinite(e.x) && Number.isFinite(e.y));
      assert.ok(Number.isFinite(e.width) && Number.isFinite(e.height));
    }
    assert.ok(toSVG(scene).startsWith('<svg'));
    if (spec.layout === 'compare') assert.equal(doc.elements.filter(e => e.type === 'arrow').length, 0);
    if (spec.layout === 'cycle') assert.ok(all.includes(spec.stop));
  });
}
const base = specs.find(s => s.layout === 'sequence');
const clone = v => JSON.parse(JSON.stringify(v));
for (const size of [2, 4]) test(`sequence with ${size} steps`, () => {
  const b = clone(base);
  b.nodes = Array.from({ length: size }, (_, i) => ({ id: `n${i}`, title: `Step ${i + 1}`, value: `${i + 1}`, body: 'The same item moves to the next step.' }));
  b.links = b.nodes.slice(1).map((n, i) => ({ from: b.nodes[i].id, to: n.id, label: 'carry over' }));
  const s = buildScene(b); assert.equal(s.cards.length, size); assert.equal(s.links.length, size - 1);
});
test('longer explanations expand the card and preserve the font size', () => {
  const b = clone(base);
  for (const node of b.nodes) {
    node.title = 'Step';
    node.body = 'An item enters.';
    delete node.value;
  }
  const old = buildScene(b);
  b.nodes[0].body = Array(7).fill('The item moves.').join('\n');
  const next = buildScene(b);
  assert.ok(next.cards[0].height > old.cards[0].height);
  assert.ok(next.elements.filter(e => e.type === 'text').every(e => e.size >= 18));
});
test('rejects missing links and incorrect endpoints', () => {
  const b = clone(base); b.links.pop(); assert.throws(() => buildScene(b), /links/);
  const c = clone(base); c.links[0].to = 'missing-node'; assert.throws(() => buildScene(c), /Link/);
});
test('rejects duplicate node IDs', () => {
  const b = clone(base); b.nodes[1].id = b.nodes[0].id; assert.throws(() => buildScene(b), /Duplicate ID/);
});
test('requires a stop condition for a cycle', () => {
  const b = clone(specs.find(s => s.layout === 'cycle')); delete b.stop; assert.throws(() => buildScene(b), /stop/);
});
test('rejects an unbroken identifier that would overflow its card', () => {
  const b = clone(base); b.nodes[0].body = 'a'.repeat(100); assert.throws(() => buildScene(b), /too long/);
});
test('asks the author to split content that exceeds its line limit', () => {
  const b = clone(base); b.nodes[0].body = 'A long explanation fills this card. '.repeat(15); assert.throws(() => buildScene(b), /lines/);
});
test('SVG preserves the supplied title, captions and accents and escapes markup', () => {
  const b = clone(base);
  b.question = 'Does A < B?';
  b.nodes[0].body = 'café <script> & tea';
  b.captions = { example: 'Case study', takeaway: '', limit: '' };
  const svg = toSVG(buildScene(b));
  assert.ok(svg.includes('<title>Does A &lt; B?</title>'));
  assert.ok(svg.includes('Case study'));
  assert.ok(!svg.includes('Takeaway:'));
  assert.ok(!svg.includes('Limit of the example:'));
  assert.ok(svg.includes('café'));
  assert.ok(svg.includes('&lt;script&gt;'));
  assert.ok(!svg.includes('<script>'));
});
test('detects overlapping text after an edit', () => {
  const s = buildScene(base), texts = s.elements.filter(e => e.type === 'text');
  texts[1].x = texts[0].x; texts[1].y = texts[0].y;
  assert.throws(() => checkScene(s), /overlap/);
});
test('detects an arrow crossing a card after an edit', () => {
  const s = buildScene(base), c = s.cards[0], a = s.elements.find(e => e.type === 'arrow');
  a.points = [[c.x - 10, c.y + c.height - 5], [c.x + c.width + 10, c.y + c.height - 5]];
  assert.throws(() => checkScene(s), /card/);
});
test('CLI writes the files and protects an existing drawing', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'explain-by-drawing-test-'));
  try {
    const input = path.join(tmp, 'input.json'), output = path.join(tmp, 'output');
    fs.writeFileSync(input, JSON.stringify(base));
    const run = () => spawnSync(process.execPath, [path.join(__dirname, 'draw.cjs'), input, output], { encoding: 'utf8' });
    assert.equal(run().status, 0);
    const before = fs.readFileSync(path.join(output, 'board.excalidraw'), 'utf8');
    assert.equal(JSON.parse(before).type, 'excalidraw');
    assert.equal(JSON.parse(fs.readFileSync(path.join(output, 'verification.json'))).renderedReview, 'required');
    assert.notEqual(run().status, 0);
    assert.equal(fs.readFileSync(path.join(output, 'board.excalidraw'), 'utf8'), before);
  } finally {
    assert.equal(path.dirname(path.resolve(tmp)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(tmp).startsWith('explain-by-drawing-test-'));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
console.log(`${count} checks passed. Review diagram meaning and factual accuracy separately.`);
