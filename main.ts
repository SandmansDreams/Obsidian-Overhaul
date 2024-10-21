import { Editor, Plugin } from 'obsidian';

export default class DragDropPlugin extends Plugin {

async onload() {
	console.log('Loading Drag-and-Drop Plugin');

	// Add the custom styles for the drag handle
	this.addStyles();

	// Initialize drag-and-drop functionality
	this.initializeDragDrop();
}

onunload() {
    console.log('Unloading Drag-and-Drop Plugin');
}

// Function to initialize drag-and-drop in the active editor
initializeDragDrop() {
    this.app.workspace.on('active-leaf-change', () => {
	const editor = this.getEditor();
	if (editor) {
        this.enableDragAndDrop(editor);
	}
    });
}

// Get the current active editor (returns Editor or null if no editor is active)
getEditor(): Editor | null { // Basically, what you've done here is now it's own method. https://docs.obsidian.md/Plugins/Editor/Editor
    const leaf = this.app.workspace.activeLeaf; // https://docs.obsidian.md/Reference/TypeScript+API/Workspace/activeLeaf
    if (leaf && leaf.view && leaf.view.sourceMode) {
	const editor = leaf.view.sourceMode.cmEditor;
		return editor ? (editor as Editor) : null;
    }
    return null;
}

  // Enable drag-and-drop for lines in the editor
enableDragAndDrop(editor: Editor) {
    editor.on('renderLine', (cmLine: any, lineNumber: number) => {
	console.log('Rendering line: ', lineNumber); // Add this log
	// Create the drag handle element
	const handle = document.createElement('span');
	handle.className = 'drag-handle';
		cmLine.dom.prepend(handle); // Add the handle before the line content

	// Make the handle draggable
	handle.draggable = true;

	// Handle drag start
	handle.addEventListener('dragstart', (event: DragEvent) => {
        event.dataTransfer?.setData('text/plain', lineNumber.toString());
	});

      // Handle dropping the line
	cmLine.dom.addEventListener('drop', (event: DragEvent) => {
        event.preventDefault();
        const draggedLineNumber = event.dataTransfer?.getData('text/plain');
        if (draggedLineNumber !== null) {
		const targetLineNumber = editor.coordsChar({ left: event.clientX, top: event.clientY }).line;
		this.moveLine(editor, parseInt(draggedLineNumber, 10), targetLineNumber);
        }
	});

      // Handle drag over (allow drop)
	cmLine.dom.addEventListener('dragover', (event: DragEvent) => {
        event.preventDefault();
	});
    });
}

  // Move a line from one position to another
moveLine(editor: Editor, from: number, to: number) {
    const lineContent = editor.getLine(from);
    editor.replaceRange('', { line: from, ch: 0 }, { line: from + 1, ch: 0 }); // Remove the original line
    editor.replaceRange(lineContent + '\n', { line: to, ch: 0 }); // Insert at the new position
}

  // Add custom styles for the drag handle
addStyles() {
    const style = document.createElement('style');
    style.textContent = `
	.drag-handle {
        display: inline-block;
        cursor: grab;
        visibility: hidden;
        width: 12px;
        height: 12px;
        margin-right: 8px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><circle cx="2" cy="2" r="2" fill="black"/><circle cx="2" cy="6" r="2" fill="black"/><circle cx="2" cy="10" r="2" fill="black"/><circle cx="6" cy="2" r="2" fill="black"/><circle cx="6" cy="6" r="2" fill="black"/><circle cx="6" cy="10" r="2" fill="black"/><circle cx="10" cy="2" r="2" fill="black"/><circle cx="10" cy="6" r="2" fill="black"/><circle cx="10" cy="10" r="2" fill="black"/></svg>') no-repeat center;
	}
	.cm-line:hover .drag-handle {
        visibility: visible;
	}
    `;
    document.head.appendChild(style);
}
}













//import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
















// // Remember to rename these classes and interfaces!

// interface MyPluginSettings {
// 	mySetting: string;
// }

// const DEFAULT_SETTINGS: MyPluginSettings = {
// 	mySetting: 'default'
// }

// export default class MyPlugin extends Plugin {
// 	settings: MyPluginSettings;

// 	async onload() {
// 		await this.loadSettings();

// 		// This creates an icon in the left ribbon.
// 		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
// 			// Called when the user clicks the icon.
// 			new Notice('This is a notice!');
// 		});
// 		// Perform additional things with the ribbon
// 		ribbonIconEl.addClass('my-plugin-ribbon-class');

// 		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
// 		const statusBarItemEl = this.addStatusBarItem();
// 		statusBarItemEl.setText('Status Bar Text');

// 		// This adds a simple command that can be triggered anywhere
// 		this.addCommand({
// 			id: 'open-sample-modal-simple',
// 			name: 'Open sample modal (simple)',
// 			callback: () => {
// 				new SampleModal(this.app).open();
// 			}
// 		});
// 		// This adds an editor command that can perform some operation on the current editor instance
// 		this.addCommand({
// 			id: 'sample-editor-command',
// 			name: 'Sample editor command',
// 			editorCallback: (editor: Editor, view: MarkdownView) => {
// 				console.log(editor.getSelection());
// 				editor.replaceSelection('Sample Editor Command');
// 			}
// 		});
// 		// This adds a complex command that can check whether the current state of the app allows execution of the command
// 		this.addCommand({
// 			id: 'open-sample-modal-complex',
// 			name: 'Open sample modal (complex)',
// 			checkCallback: (checking: boolean) => {
// 				// Conditions to check
// 				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
// 				if (markdownView) {
// 					// If checking is true, we're simply "checking" if the command can be run.
// 					// If checking is false, then we want to actually perform the operation.
// 					if (!checking) {
// 						new SampleModal(this.app).open();
// 					}

// 					// This command will only show up in Command Palette when the check function returns true
// 					return true;
// 				}
// 			}
// 		});

// 		// This adds a settings tab so the user can configure various aspects of the plugin
// 		this.addSettingTab(new SampleSettingTab(this.app, this));

// 		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
// 		// Using this function will automatically remove the event listener when this plugin is disabled.
// 		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
// 			console.log('click', evt);
// 		});

// 		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
// 		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
// 	}

// 	onunload() {

// 	}

// 	async loadSettings() {
// 		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
// 	}

// 	async saveSettings() {
// 		await this.saveData(this.settings);
// 	}
// }

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }


