# Explain by Drawing

`explain-by-drawing` is a standalone teaching skill for OpenCode. It turns a question into an editable diagram, explains the terms needed to read it, and follows one concrete example through the mechanism. A small offline generator lays out the text, boxes and arrows. Study memory is available as a separate, optional skill.

![A token mapped to an ID and then to a vector](skills/explain-by-drawing/assets/examples/01-sequence.png)

## Install

Download the [v2 package](https://github.com/mattcsilva/explain-by-drawing/releases/latest) or clone the repository. Copy the entire `skills/explain-by-drawing` directory into one of the OpenCode skill locations.

| Scope | Destination |
| --- | --- |
| One project | `<project>/.opencode/skills/explain-by-drawing/` |
| All your projects | `~/.config/opencode/skills/explain-by-drawing/` |

OpenCode discovers the skill from `SKILL.md` in that directory. Keep the accompanying `references`, `assets` and `scripts` folders together. When updating an installation, preserve any local customizations. See the [OpenCode skill documentation](https://opencode.ai/docs/skills/).

## Try it

> Use explain-by-drawing to show where a test runs when I use a remote development environment. Follow one test request from my laptop to the remote machine and back.

For a working example, run the following from the repository root with Node.js 18 or later. Choose a new output directory for each run.

```sh
node skills/explain-by-drawing/scripts/draw.cjs skills/explain-by-drawing/assets/examples/01-sequence.json token-board
```

Open `token-board/board.svg` for a preview or open `token-board/board.excalidraw` in Excalidraw to edit individual elements. The generator uses only Node's standard library. To work inside Obsidian, use its Excalidraw plugin. Native automation also uses Obsidian's command-line interface.

## What's in v2

- A [lesson plan and review guide](skills/explain-by-drawing/references/lesson-plan-and-review.md) for choosing an example, explaining prerequisites and checking the result.
- Four [worked examples](skills/explain-by-drawing/references/worked-examples.md) with input files, diagrams and notes on the design decisions.
- [Reusable components](skills/explain-by-drawing/references/components.md) for a sequence, a cycle, a comparison or two regions exchanging information.

Run the generator checks with `node skills/explain-by-drawing/scripts/verify.cjs`. They test layout, content preservation, export and protection of existing files. Review the explanation and the rendered image separately.

## Optional study memory

To save and resume lessons across chats, copy `optional/continuous-study` alongside `explain-by-drawing` in the same skills directory. Give the assistant the path to your Obsidian vault and permission to maintain your study notes. The optional snapshot helper uses Python 3.9 or later. [Study memory instructions](optional/continuous-study/SKILL.md)
