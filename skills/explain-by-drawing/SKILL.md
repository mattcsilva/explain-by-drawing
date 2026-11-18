---
name: explain-by-drawing
description: "Use when someone asks for a drawing or diagram to explain a concept, show how something works, or show why a result is true. Requests include 'draw how it works', 'desenha pra eu entender' and 'mostre isso em um esquema'. Create an editable drawing with a short reading guide, or expand part of an existing board when the learner asks for more detail. Supports standalone SVG and Excalidraw in Obsidian."
---

# Explain by Drawing

Use a drawing to help the learner locate something, follow a change or predict a consequence. Include a short reading guide with each drawing you create or update. Respect the user's choice of format. When the format is open and an Obsidian integration is already available, prefer an editable Excalidraw board.

## Identify the requested result and check feasibility

Start with the learner's current question and what they expect to receive. Use the conversation to distinguish a new drawing, a change to a particular board, or a walkthrough of an existing drawing. Honor any specified format, file and destination. When returning to a board, reuse the names and positions from the relevant part. Keep a single-question explanation focused.

Before composing, check only what this delivery needs, using the files, permissions and tools already available. For a new SVG, a way to write the file at the requested destination is enough to start. For a walkthrough, read the drawing. For an edit, locate and read the current board, confirm you can save changes to it, and preserve its annotations. For work directly in Obsidian, check the [local integration](references/obsidian-excalidraw.md).

When the request is clear and feasible, proceed directly. If a tool is unavailable, use another available route that meets the request. If a required input is still missing after checking the available context, ask for that item. If the requested result is out of reach, explain the blocker and offer the closest feasible alternative. Ask before changing an explicitly requested file, format or destination.

Use familiar words, short sentences and one idea per block. Lead with the idea that answers the question. Show the input, what acts on it and the result. Explain conditions that change the result. When storage or execution is central to the question, identify where actions happen, who controls them and what survives an interruption. Verify specialized, changing or consequential claims against appropriate sources.

## Teach prerequisites in reading order

Before drawing, identify what the learner must know to follow each transition. For every essential new term, abbreviation or symbol, give its technical name, a plain definition, its role here and a concrete example at first use. If the definition contains another unfamiliar concept, teach that prerequisite first. Respect an explicit request to skip a foundation.

Apply this to the diagram itself. Put a short explanation next to the relevant part. In a calculation, identify the inputs, units, operation and meaning of the result. Mark invented values, assumptions and simplifications. When a prerequisite needs its own board, show when to read it and where to return. A glossary helps with later lookup. A past mention of a term, a compliment or silence provides no evidence that the learner can apply it.

## Plan and compose the drawing

Use the [lesson plan](references/lesson-plan-and-review.md) to prepare the question, answer, example, prerequisites, transitions and scope of each new board. Do this as authoring work. A learner should be able to receive the lesson without first completing a questionnaire.

Choose the arrangement by finishing this sentence for yourself: “The reader can tell ___ by looking at ___.” Draw the evidence the answer depends on. Use boundaries for location, stages for a transformation, or aligned marks on a common scale for a change in quantity. For a claim about shape, draw the objects and mark the correspondence that explains it. For a choice or loop exit, put the deciding question at the fork and label each relevant path through to its outcome. For a comparison, keep the reference case visible and change one condition.

Trace the example on a quick sketch before choosing a tool. When a [worked example](references/worked-examples.md) fits every essential relationship, adapt its input and use the [layout generator](references/components.md) for an SVG preview and editable Excalidraw file. If the template hides a decision, a physical shape or a quantity the reader needs to see, compose that part directly in the requested drawing format. With limited tools, a few labeled editable shapes or paths can carry the same explanation.

For a request for depth, locate the first box or arrow whose label names an operation the learner still needs explained. Open that exact part in an inset or a linked board. Carry its label and the same example into the detail, show the intermediate change, then point back to where its result is used. Repeat for the other dependencies the question actually asks about. Stop once the learner can trace the answer at the requested depth. A single picture can be enough.

Follow the [drawing design guide](references/drawing-design.md) for reading order, labels and visual review.

## Teach with the board

Guide the learner through the example in reading order. Match the learner's language in the explanation, diagram labels and generator captions. Use the accompanying text for reasons and conditions the drawing leaves implicit. In a conversation, evolve the same board as the question changes. Keep recognizable pieces in corresponding positions across stages.

Where helpful, vary one condition and ask for a prediction, such as what happens to a remote test when the network connection drops. A learner who asks for the full explanation can read it directly. When using an analogy, identify what corresponds to the real mechanism and where the analogy stops.

## Review and deliver

1. Cover the reading guide and trace the example on the drawing. Point to what establishes the answer. Follow each relevant alternative to its result and, for a detail view, back to the named step. If a necessary link exists only in prose, add the missing mark, intermediate state or path. Check the facts and the conclusion under the conditions shown.
2. Inspect the rendered board at reading size. Check text clipping, arrow direction, labels, contrast, margins and the footer. Correct the drawing and regenerate affected previews.
3. Preserve the editable original and the user's annotations. Before changing an existing board, read its current version, preserve a recoverable copy and reconcile recent edits. Use a fresh directory when running the generator.
4. Deliver the requested result and a brief indication of where to resume. For a new or updated drawing, confirm the saved output at its destination and provide the editable file or board link. Describe which preview or application view you inspected. If rendering was unavailable, state that visual review is still pending.

## Optional study memory

When the user asks for continuity across sessions, or their workspace instructions already request it, use `continuous-study` if installed and an authorized destination is available. Discover it through the environment's skill catalog. Read the topic and its resume point before teaching. After a meaningful step, record concepts, questions, the learner's demonstrated understanding and the next step. Link the board to the relevant note and honor existing permissions.

The drawing workflow stands on its own. If requested study memory is unavailable, deliver the lesson and a short summary the learner can save. Keep creating the requested board separate from permission to create a vault, monitor other chats, publish content or execute a system depicted in a lesson.
