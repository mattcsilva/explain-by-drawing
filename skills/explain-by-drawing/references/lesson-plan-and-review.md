# From a question to a board

Use this short plan while authoring. Prepare it before positioning the elements, using the information already available from the user.

## Plan each board

1. **Question.** What will the reader be able to answer after looking at the board?
2. **Answer.** Write one accurate sentence that answers the question. Check it before drawing.
3. **Example.** Which request, object, value or situation will you follow from beginning to end?
4. **Prerequisites.** Which terms or symbols will the reader need? Give the meaning in familiar words, its role in the mechanism and an example before depending on it.
5. **Relationship.** Is the question about a sequence, repetition, comparison, location or another relationship? Choose the arrangement accordingly.
6. **Connections.** For every arrow, trace the source, what moves or changes and its destination. For independent cases, specify what changes and what stays comparable.
7. **Limit.** Which condition, omission or simplification could lead to a wrong conclusion? Put it next to the relevant part.

For a question about where a test runs, follow a test request from a laptop to a remote machine and follow its result back. Put the running test inside the remote machine, and explain interface, network and process as the reader encounters them. What happens to the running test during a disconnection depends on the session and whether the remote machine stays on.

## Teach prerequisites at the point of use

When one definition introduces another unfamiliar term, explain the underlying idea. Show a short ordered list of numbers when introducing a vector. Then show how the next component uses those numbers. A synonym alone rarely explains an operation.

If foundations compete for space with the main mechanism, put them on a supporting board before the one that uses them. Show where to resume the main example. A term marked “covered” in the study record tells you what was presented. Use evidence of understanding to decide how much review the reader needs.

State the depth of the picture precisely. A comparison might illustrate the effect of context, for instance. Explain the attention calculation on a separate board if the reader asks how the model produces that effect.

## Choose a layout

| Reader's question | Starting layout | What to show |
|---|---|---|
| How does this change form? | `sequence` | The same example at each stage and the operation between stages |
| What happens on each attempt? | `cycle` | Feedback that changes the next attempt and a condition for exiting |
| What changes between these cases? | `compare` | Comparable cases with a controlled difference |
| Where does this happen or belong? | `regions` | Meaningful boundaries and the information that crosses them |

The supplied region layout supports two regions with a round trip. The cycle layout supports four stages. Pick a manual layout or another format when the example requires a different structure.

Keep one question per board when that improves readability. Several boards can follow the same example from an overview to a closer look and then a failure case. Keep names, positions and colors recognizable. Place foundations before the first board that depends on them, even if you drew them later.

## Review the content and the image separately

**Content review.** Follow the example like a first-time reader. Can you identify each transformation's input, operation and output? Is there an unexplained jump? Can you identify how each state is reached? Check whether the conclusion follows under the stated conditions, what ends the loop and where a failure goes.

**Image review.** Open the render at reading size on the intended display. Check text, arrowheads, contrast, margins, footer and reading order. A geometry check catches some layout errors. Checking the facts and understanding the actual reading experience require separate reviews.

When either review reveals a problem, fix the cause and render again. A dense sentence can become two stages. An arrow can have its own corridor. An unfamiliar term can gain a worked example.

## Common failures and repairs

| Finding | Repair |
|---|---|
| An outer box hides an arrow | Draw containers first and put visible connections above them. |
| An arrow crosses a sentence | Reserve one corridor for the connection and nearby space for its label. |
| A “pause” state is isolated | Show how execution reaches it, or attach the condition to the relevant part of the flow. |
| A stage consists of technical names | Give each central term a meaning, role and example where it first appears. |
| Several conditions crowd the footer | Move each condition closer to its part or give limits a supporting board. |
| Regenerating would erase annotations | Generate into a new directory, then reconcile the changes with the current board. |

Deliver the board with a brief reading path. Add the reasons and conditions the picture leaves implicit. Record evidence of understanding only when the reader has supplied it.
