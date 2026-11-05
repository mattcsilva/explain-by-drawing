# Worked examples and drawing decisions

Choose an example that expresses the same relationship as the question. Inspect its preview and use its JSON as a starting point. Each file is a complete input to the drawing generator.

## 1. Follow a transformation

“How does a piece of text become numbers?”

Follow “cat” from a unit of text to the illustrative identifier 42, then to an invented vector. Three boxes run from left to right. Each box shows what the same example looks like at that stage. Each arrow names the lookup. The reader meets each term beside the value it describes. [Input](../assets/examples/01-sequence.json) · [Preview](../assets/examples/01-sequence.png)

This arrangement lets the reader point to the numeric label and separately point to the list used in calculations. A pair of labels such as “tokenization → embedding” would skip the object being transformed. An ID's numeric magnitude carries no measure of the word's importance.

To adapt the layout for currency or unit conversion, show the quantity, operation and unit at each step. Verify the numbers against the actual example and replace the token-specific terminology.

## 2. Show a loop and how it ends

“How can I revise a paragraph over several attempts?”

A vague claim prompts a round of revision. A criterion guides the draft, a review identifies what is missing and that feedback changes the next attempt. A separate line below the circuit gives a stopping condition. [Input](../assets/examples/02-cycle.json) · [Preview](../assets/examples/02-cycle.png)

The return arrow matters because it carries new information. Give it a label that identifies the feedback. An unexplained loop leaves the reader wondering whether improvement or termination will ever occur. If the question concerns several branches or transitions, use a separate state diagram to show where each path leads.

For an agent example, follow a request through a tool call, authorized execution and the result supplied to the next model call. Explain each new term and identify the change in the next input. Tool execution in a real system requires its own authorization.

## 3. Compare cases with one controlled difference

“Can I recover the text after closing my editor?”

Follow the same sentence in two versions of the same situation. One version saves it to a file before the editor closes. The other keeps it only in working memory. Equal-sized boxes with the same internal structure invite comparison. The cases are independent, so leave the space between them free of arrows. [Input](../assets/examples/03-comparison.json) · [Preview](../assets/examples/03-comparison.png)

The conditions determine the result. The memory-only case assumes that autosave is off. The saved case assumes a completed write and a file the editor can read later. If you also change the editor, network or storage configuration, the reader has to guess which change explains recovery.

For another comparison, use the same ambiguous word in two sentences and change its surrounding context. That illustrates how the interpretation changes. A lesson on how an attention mechanism computes the effect needs a second board.

## 4. Show boundaries and exchanges

“Where does the test run when I use a remote development environment?”

Place the laptop's interface in one region and the program that executes the test in the other. Nest components inside the machine where they belong. Use one arrow for the request and a second for the result, with space between regions to label each. Define interface, process and network where they appear. [Input](../assets/examples/04-regions.json) · [Preview](../assets/examples/04-regions.png)

The location of each part contributes to the answer. Moving execution into the laptop's region would change the meaning of the drawing. State what the outer boxes represent. Stored files and a running process have different lifetimes, so a drawing about storage alone cannot establish that a running task survives a lost connection.

You can apply the same reasoning to a client and server, departments or devices. Name the boundary you chose. For a one-way transfer, use a more suitable layout or draw that single direction manually.

## Reuse a worked example

Write the new lesson plan before replacing its labels. Check whether the layout still represents the relationship accurately, and follow the new example all the way through to its conclusion.
