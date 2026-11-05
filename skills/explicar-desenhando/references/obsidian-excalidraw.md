# Editable boards in Obsidian

## Check the local integration

Use the vault authorized for the lesson. Locate the Obsidian command-line interface (CLI) for the installed operating system. Check that the application is running, the CLI is enabled, and the Excalidraw plugin is available.

In the PowerShell examples, first set `$obsidianCli` to the actual executable path and `$vaultName` to the target vault name. Adapt the invocation for other shells and use the installed CLI's help to check supported commands.

```powershell
& $obsidianCli "vault=$vaultName" eval 'code=JSON.stringify({pluginLoaded:!!app.plugins.plugins["obsidian-excalidraw-plugin"],automate:typeof ExcalidrawAutomate})'
```

The examples use the plugin's ExcalidrawAutomate API. Check the installed methods or its official documentation if the API differs. Respect existing plugin restrictions and authorization for installing integrations or changing settings.

The reusable generator creates a standard `.excalidraw` file that can be imported through the plugin. Use the native workflow below to create a plugin-managed Markdown board or edit an existing one. [Drawing components](components.md)

## Create a board

Look for an existing board that covers the question. Use the requested directory or follow the vault's filing convention. For example, a vault organized by subject might use `Studies/<Topic>/Boards/<Name>.excalidraw.md`. The plugin API handles its own compressed data format.

Run a local JavaScript authoring file through the CLI. Wrap asynchronous code in an immediately invoked async function, because top-level `await` is unavailable in this evaluation context. Return a short result with the board path, frame count and element count.

```powershell
& $obsidianCli "vault=$vaultName" eval 'code=eval(require("fs").readFileSync("C:/path/to/lesson.js","utf8"))'
```

In the script, get the API with `const ea = ExcalidrawAutomate`. Check that the destination is available before creating a new file. Calling `ea.clear()` resets the automation buffer while preserving the open drawing. The following outline shows how to create elements inside a frame.

```javascript
ea.clear();
ea.canvas.theme = 'light';
ea.canvas.viewBackgroundColor = '#fffdf7';
// Set ea.style for each element type before adding it.
// Relevant fields include fontFamily, fontSize, strokeColor, backgroundColor,
// fillStyle, strokeWidth, strokeStyle and roughness.
const frameId = ea.addFrame(0, 0, 1080, 760, 'The question for this stage');
const boxId = ea.addRect(60, 180, 280, 180);
const labelId = ea.addText(80, 210, 'Name and function');
const arrowId = ea.addArrow([[350, 270], [500, 270]], {endArrowHead: 'arrow'});
for (const id of [boxId, labelId, arrowId]) ea.getElement(id).frameId = frameId;
// Add the destination, connection label and other lesson elements before saving.
```

Reset styles between element types so a box fill cannot leak into the next arrow. Choose sizes and coordinates for the actual content. After drawing, save through the plugin API.

```javascript
await ea.checkAndCreateFolder(folder);
const savedPath = await ea.create({
  filename: title,
  foldername: folder,
  silent: true,
  plaintext: guideText,
  frontmatterKeys: {
    'excalidraw-plugin': 'parsed',
    'excalidraw-open-md': false,
    type: 'study-board',
    topic,
    updated: date
  }
});
```

Define `folder`, `title`, `guideText`, `topic` and `date` for this lesson. The plugin adds the `.excalidraw.md` extension to the filename. Put sources and limits in the linked note or in the board's own guide.

## Edit an existing board

1. Open the exact file and preserve a recoverable copy before editing. The optional `estudo-continuo` skill provides a snapshot helper. A local backup is sufficient when working independently.
2. Select the view by file path. With multiple drawings open, match the desired file before setting the automation view.

   ```javascript
   const leaf = app.workspace.getLeavesOfType('excalidraw')
     .find(item => item.view.file?.path === boardPath);
   if (!leaf) throw new Error('Open the target board before editing.');
   ea.setView(leaf.view, true);
   ```

3. Get fresh elements with `ea.getViewElements()`. Match current IDs against the parts you intend to change. Treat an older manifest as a hint.
4. Use `ea.clear()` and `ea.copyViewElementsToEAforEditing(selectedElements)` before changing those parts. When editing text, keep `rawText`, `text` and `originalText` in sync when those fields are present. Increment `version` where required by the plugin.
5. Save the change with `await ea.addElementsToView(false, true)` and read it back. Preserve current annotations, image resources and other elements. Run creation scripts only for new boards.

## Export, open and inspect

`await ea.createPNG(undefined, 1, {withBackground:true, withTheme:true}, undefined, 'light', 25)` returns a PNG Blob from the elements in the automation buffer. To export one frame, copy the frame and its current children into that buffer. Include any associated image resources.

Write the ArrayBuffer with `app.vault.createBinary` for a new preview or `modifyBinary` to update an existing one. One preview per stage often makes a lesson easier to follow. Open the PNG at reading size and refresh the affected previews after editing.

```powershell
& $obsidianCli "vault=$vaultName" open 'path=Studies/Topic/Boards/Lesson.excalidraw.md'
& $obsidianCli "vault=$vaultName" dev:screenshot 'path=C:/path/to/open-board.png'
```

Substitute real paths. After opening and verifying the target view, use `ea.viewZoomToElements(false, stageElements, 0.18)` as a starting point and adjust the framing to leave room for the interface. Inspect the screenshot to assess legibility.

Deliver a link to the editable board and the image of the current stage. Report precisely which output you inspected. Remote synchronization or monitoring would require a separate workflow and authorization.
