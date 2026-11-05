# Reusable drawing components

The generator takes a JSON lesson plan and writes an SVG preview, an editable Excalidraw board and a geometry report. It runs offline with the Node.js 18+ standard library. [Generator](../scripts/draw.cjs)

## Generate and review a board

1. Choose a worked example with the same relationship you intend to explain. [Worked examples](worked-examples.md)
2. Copy its JSON file into your workspace. Replace the question, terms, example and relationships. Check each claim against the new subject.
3. From the skill directory, run the command below with your own input and a new output directory.

```sh
node "scripts/draw.cjs" "lesson.json" "lesson-output"
```

4. Inspect `lesson-output/board.svg` at reading size. It uses a monospace font to preview the geometry. Open `board.excalidraw` in the target editor when available and check how the installed fonts render.
5. Read `verification.json` for the geometry result. Review the explanation and the rendered image separately. When adjusting the input, generate into a fresh directory. For a board with user annotations, reconcile the changes with the current board before saving.

## Input fields

| Field | What to provide |
|---|---|
| `layout` | `sequence`, `cycle`, `compare` or `regions` |
| `question` | The question displayed as the board title |
| `example` | A concrete situation to follow, with any invented data identified |
| `nodes` | The parts in reading order, each with a unique `id`, a `title` and a `body`. Optional `value` highlights the item being followed. Optional `color` sets an accent. |
| `links` | Connections with `from`, `to` and `label`, in layout order |
| `takeaway` | A plain-language answer to the question |
| `limit` | The condition or simplification that affects the answer |
| `captions` | Optional display prefixes for `example`, `change`, `stop`, `takeaway` and `limit`. Supply the actual prefix, including its punctuation, in the lesson's language. An empty string displays the content alone. |

A useful `value` is short enough to recognize at a glance, such as “cat”, 42 or a small list of numbers. Explain the function of the part, the terms it introduces and what has happened to the example in `body`. Color options are `blue`, `purple`, `green` and `amber`. Name each role in words and reuse its color across related boards.

| Layout | Expected nodes and links | Additional fields |
|---|---|---|
| `sequence` | Two to four nodes, with each linked to the next in array order | — |
| `cycle` | Four nodes, clockwise from the upper left. Include all four links, ending with the return to the first node. | `stop` describes when to finish, pause or stop at a limit |
| `compare` | Two nodes side by side and `links: []` | `change` identifies the difference between the cases |
| `regions` | Two regions with one link in each direction. Give the left-to-right link first. | Each node has an `items` list with one to three descriptions of parts inside it |

The four-step sequence uses a wider page to preserve type size. Check it on the intended screen and split it across boards if it becomes too small. Label each arrow with the operation or the item it carries. Choose another layout or draw by hand when the actual relationship calls for a different number or direction of connections.

## Layout and validation

The generator wraps text, reserves margins and sizes boxes from their contents. It aligns comparable cases, reserves corridors for arrows and places the footer below the diagram. It checks for overlapping text, arrows crossing text or boxes, and elements outside the page. Repeated node IDs, incorrect link order, oversized words and excessive text produce actionable errors.

When content exceeds a limit, shorten a label or give the underlying concept its own board. Keep the text legible. The width estimate assumes a monospace font for Latin-script text. Use manual composition for emoji or CJK text and inspect unfamiliar glyphs in the target editor. System fonts and renderers can differ.

Text, boxes and connectors are separate editable elements. After dragging a box in Excalidraw, adjust its text and unbound connectors and inspect the connections again.

## Obsidian and direct use

Import `board.excalidraw` through the installed Excalidraw plugin to use the board inside an Obsidian vault. For native `.excalidraw.md` notes, use the plugin API to handle its compressed data. [Obsidian workflow](obsidian-excalidraw.md)

The module exports `buildScene(spec)`, `toSVG(scene)` and `toExcalidraw(scene)` for use in an automation script. When updating an existing drawing, preserve its current element IDs, resources and annotations.

Run the included checks from the skill directory.

```sh
node "scripts/verify.cjs"
```

The checks exercise the generator with synthetic examples and temporary files. Assess the quality of a lesson by following its example and inspecting the finished board in addition to running these checks.
