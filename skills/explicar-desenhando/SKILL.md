---
name: explicar-desenhando
description: "Teach a concept through editable explanatory drawings. Use when someone asks to learn through diagrams, understand a mechanism visually, or continue a lesson on an existing board. Supports Excalidraw in Obsidian and standalone diagrams, with optional study memory."
---

# Explain by Drawing

Use a drawing to help the learner locate something, follow a change or predict a consequence. Deliver a readable drawing and a short guide to reading it. Prefer editable Excalidraw boards in Obsidian when available and respect the user's choice of format.

## Establish the question

Start from the user's current question and the material available in the conversation. If the learner is returning to a board, find the relevant part and reuse its names, positions and annotations. Let the current question take priority over an earlier suggested next step. Keep a single-question explanation focused.

Use familiar words, short sentences and one idea per block. Lead with the idea that answers the question. Show the input, what acts on it and the result. Explain conditions that change the result. When storage or execution is central to the question, identify where actions happen, who controls them and what survives an interruption. Verify specialized, changing or consequential claims against appropriate sources.

## Teach prerequisites in reading order

Before drawing, identify what the learner must know to follow each transition. For every essential new term, abbreviation or symbol, give its technical name, a plain definition, its role here and a concrete example at first use. If the definition contains another unfamiliar concept, teach that prerequisite first. Respect an explicit request to skip a foundation.

Apply this to the diagram itself. Put a short explanation next to the relevant part. In a calculation, identify the inputs, units, operation and meaning of the result. Mark invented values, assumptions and simplifications. When a prerequisite needs its own board, show when to read it and where to return. A glossary helps with later lookup. A past mention of a term, a compliment or silence provides no evidence that the learner can apply it.

## Plan and compose the drawing

Use the [lesson plan](references/lesson-plan-and-review.md) to prepare the question, answer, example, prerequisites, transitions and scope of each new board. Do this as authoring work. A learner should be able to receive the lesson without first completing a questionnaire.

Choose the arrangement by the relationship it must show. Use containment for location or responsibility, a sequence for transformations, a cycle for repeated actions with feedback, matching panels for a controlled comparison, and labeled axes with units for quantities. Make every arrow readable as an action or a transfer with an identifiable source and destination. For comparisons, say what changes and what stays fixed.

Read the relevant [worked example](references/worked-examples.md). When one of the four layouts fits, adapt its input and use the [layout generator](references/components.md) to produce an SVG preview and an editable Excalidraw file. It calculates spacing and checks for collisions. For other relationships, compose the board manually. If Node.js is unavailable, use the examples and an available drawing tool. Preserve the chosen format and report any practical limitation.

Follow the [drawing design guide](references/drawing-design.md) for reading order, labels and visual review. For creating, editing or exporting directly through the Obsidian plugin, use the [Obsidian and Excalidraw guide](references/obsidian-excalidraw.md).

## Teach with the board

Guide the learner through the example in reading order. Match the learner's language in the explanation, diagram labels and generator captions. Use the accompanying text for reasons and conditions the drawing leaves implicit. In a conversation, evolve the same board as the question changes. Keep recognizable pieces in corresponding positions across stages.

Where helpful, vary one condition and ask for a prediction, such as what happens to a remote test when the network connection drops. A learner who asks for the full explanation can read it directly. When using an analogy, identify what corresponds to the real mechanism and where the analogy stops.

## Review and deliver

1. Trace the example from start to finish. Check new vocabulary, inputs, outputs, causes, stopping conditions and how each state is reached. Verify the conclusion under the conditions shown.
2. Inspect the rendered board at reading size. Check text clipping, arrow direction, labels, contrast, margins and the footer. Correct the drawing and regenerate affected previews.
3. Preserve the editable original and the user's annotations. Before changing an existing board, read its current version, preserve a recoverable copy and reconcile recent edits. Use a fresh directory when running the generator.
4. Deliver the relevant image, the editable file or board link, and a brief indication of where to resume. Describe which preview or application view you actually inspected. When Obsidian integration is unavailable, offer an available representation such as an SVG or a small Mermaid diagram.

## Optional study memory

When the user asks for continuity across sessions, or their workspace instructions already request it, use `estudo-continuo` if installed and an authorized destination is available. Discover it through the environment's skill catalog. Read the topic and its resume point before teaching. After a meaningful step, record concepts, questions, the learner's demonstrated understanding and the next step. Link the board to the relevant note and honor existing permissions.

The drawing workflow stands on its own. If requested study memory is unavailable, deliver the lesson and a short summary the learner can save. Keep creating the requested board separate from permission to create a vault, monitor other chats, publish content or execute a system depicted in a lesson.
