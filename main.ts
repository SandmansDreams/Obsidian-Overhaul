/* NOTES
There are several possible ways to accomplish this, but it needs to be able to access all markdown instances including callouts and images
1. Select all the text within a range depending on the type of thing that is there (lines and headings are just line selections, callouts are groups of lines)
2. Store the value in the line or set of lines temporarily and delete it on the current line
3. Show visuals of dragging the group as it floats over the doc and shows a preview of where it will be placed
4. Use editor.replaceRange() to replace the line with stored data, shift other lines around drop position
5. Clear the data in the temporary buffer

Maybe use the cursor to place text, but if so, make sure to put it back afterwards
May need to make an editor extension
 */

import {
    Plugin
} from 'obsidian';

// Main Plugin Function
export default class BlocksPlugin extends Plugin {
    private handle: HTMLElement | null = null; // Store reference to the handle

    async onload() {
    console.log('Persistent Bounding Box Plugin Loaded');

    // Register mouse event listeners using arrow functions
    this.registerDomEvent(document, 'mouseenter', (event: MouseEvent) => {
        this.handleMouseEnter(event);
    }, true);

    this.registerDomEvent(document, 'mouseleave', (event: MouseEvent) => {
        this.handleMouseLeave(event);
    }, true);
    }

    // Add a bounding box and handle on mouse enter
    handleMouseEnter(event: MouseEvent) {
    // Check if the mouse is within the editor area
    const editor = document.querySelector('.markdown-preview-view, .markdown-source-view');
    if (!editor || !editor.contains(event.target as HTMLElement)) {
        return; // Exit if not within the editor
    }

    const target = event.target as HTMLElement;

    // Check if the target is a callout
    if (this.isCallout(target)) {
        const callout = target.closest('.callout') as HTMLElement;
        this.addBoundingBox(callout);
        this.addHandle(callout);  // Add draggable handle
        console.log('Added handle to callout');
        return;  // Ensure the callout gets priority
    }

    // Handle individual lines
    if (target && target.classList.contains('cm-line')) {
        this.addBoundingBox(target);
        this.addHandle(target);  // Add draggable handle
        console.log('Added handle to line');
    }
    }

    // Remove the bounding box and handle on mouse leave
    handleMouseLeave(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Check if the target is a callout
    if (this.isCallout(target)) {
        const callout = target.closest('.callout') as HTMLElement;
        this.removeBoundingBox(callout);
        this.removeHandle();  // Remove draggable handle
        return;
    }

    // Handle individual lines
    if (target && target.classList.contains('cm-line')) {
        this.removeBoundingBox(target);
        this.removeHandle();  // Remove draggable handle
    }
    }

    // Function to check if the target is part of a callout
    isCallout(target: HTMLElement): boolean {
    return !!target.closest('.callout');
    }

    // Add bounding box styles (persistent) with grey color and no padding
    addBoundingBox(element: HTMLElement) {
    element.style.outline = '2px solid grey';  // Grey bounding box
    element.style.borderRadius = '5px';        // Rounded corners
    }

    // Remove bounding box styles
    removeBoundingBox(element: HTMLElement) {
    element.style.outline = '';               // Remove bounding box
    element.style.borderRadius = '';          // Reset rounded corners
    }

    // Add a draggable handle as a visual element
    addHandle(element: HTMLElement) {
    // If handle already exists, just update its position
    if (!this.handle) {
        this.handle = document.createElement('div');
        this.handle.className = 'drag-handle';
        this.handle.innerHTML = '&#x2630;';  // Six-dot symbol (you can customize)
        this.handle.style.position = 'fixed'; // Fixed positioning for overlay
        this.handle.style.cursor = 'grab';    // Drag cursor
        this.handle.style.fontSize = '14px';
        this.handle.style.color = 'grey';
        this.handle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';  // Temporary background for visibility
        this.handle.style.borderRadius = '3px';  // Rounded corners for the handle
        this.handle.style.zIndex = '1000';  // Make sure it's on top

        document.body.appendChild(this.handle);
    }

    // Set handle position next to the hovered element
    const rect = element.getBoundingClientRect();
    if (this.handle) {
        this.handle.style.left = `${rect.left - 30}px`; // Position to the left of the element
        this.handle.style.top = `${rect.top + (rect.height / 2)}px`; // Center vertically
    }
    }

    // Remove the handle when the mouse leaves
    removeHandle() {
    if (this.handle) {
        this.handle.remove();
        this.handle = null; // Reset the handle reference
    }
    }

    onunload() {
    console.log('Persistent Bounding Box Plugin Unloaded');
    }


/*     // Add a persistent bounding box on hover
    handleMouseOver(event: MouseEvent) {
        const target = event.target as HTMLElement;

        // Check if the target is a callout
        if (this.isCallout(target)) {
            const callout = target.closest('.callout') as HTMLElement;
            this.addBoundingBox(callout);
            return;
        }

        // Handle individual lines
        if (target && target.classList.contains('cm-line')) {
            this.addBoundingBox(target);
        }
    }

    // Remove the bounding box on mouse out
    handleMouseOut(event: MouseEvent) {
        const target = event.target as HTMLElement;

        // Check if the target is a callout
        if (this.isCallout(target)) {
            const callout = target.closest('.callout') as HTMLElement;
            this.removeHandle(callout);
            return;
        }

        // Handle individual lines
        if (target && target.classList.contains('cm-line')) {
            this.removeHandle(target);
        }
    }

    // Function to check if the target is part of a callout
    isCallout(target: HTMLElement): boolean {
        return !!target.closest('.callout');
    }

    // Add bounding box styles (persistent) with grey color and no padding
    addHandle(element: HTMLElement) {
        element.style.outline = '3px solid grey';  // Grey bounding box
        element.style.borderRadius = '5px';        // Rounded corners

        const handle = document.createElement('div');
        handle.className = 'drag-handle';
        handle.innerHTML = '&#x2630;';  // Six-dot symbol (you can customize)
        handle.style.position = 'absolute';
        handle.style.left = '-20px';  // Position handle to the left
        handle.style.top = '50%';  // Vertically centered
        handle.style.transform = 'translateY(-50%)';
        handle.style.cursor = 'grab';  // Drag cursor
        handle.style.fontSize = '14px';
        handle.style.padding = '2px';
        handle.style.color = 'grey';
    
        // Attach the handle to the hovered element
        element.style.position = 'relative';  // Ensure the parent element has relative positioning
        element.appendChild(handle);
    }

    // Remove bounding box styles
    removeHandle(element: HTMLElement) {
        element.style.outline = '';
        element.style.borderRadius = '';

        const handle = element.querySelector('.drag-handle');
        if (handle) {
            element.removeChild(handle);
        }
    } */

/*     async handleHandler() {
        //const currentContainer = containerEl

        // Grabs the current active editor
        const editor = this.app.workspace.activeEditor?.editor;

        // If the editor is the Markdown View
        if (editor) {
            // Gets cursor as a position
            //const cursor = view.editor.getCursor();
        

            // this.registerDomEvent(document, 'hover', (evt: MouseEvent) => {
            //     console.log(document.elementFromPoint(e.clientX, e.clientY))
            // });

            // Registers click event
            // this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            //     console.log('click', evt);
            // });
        }
    } */

/*     getDropLocation() {
        // Returns the drop location of a mouse event
        return function getDropLocation(event: MouseEvent){
            
        }
    } */

}


//DEFAULT PLUGIN

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



//CHAT GPT VERSION

// import { Editor, Plugin } from 'obsidian';

// export default class DragDropPlugin extends Plugin {

// async onload() {
// 	console.log('Loading Drag-and-Drop Plugin');

// 	// Add the custom styles for the drag handle
// 	this.addStyles();

// 	// Initialize drag-and-drop functionality
// 	this.initializeDragDrop();
// }

// onunload() {
//     console.log('Unloading Drag-and-Drop Plugin');
// }

// // Function to initialize drag-and-drop in the active editor
// initializeDragDrop() {
//     this.app.workspace.on('active-leaf-change', () => {
// 	const editor = this.getEditor();
// 	if (editor) {
//         this.enableDragAndDrop(editor);
// 	}
//     });
// }

// // Get the current active editor (returns Editor or null if no editor is active)
// getEditor(): Editor | null {
//     const leaf = this.app.workspace.activeLeaf;
//     if (leaf && leaf.view && leaf.view.sourceMode) {
// 	const editor = leaf.view.sourceMode.cmEditor;
// 		return editor ? (editor as Editor) : null;
//     }
//     return null;
// }

//   // Enable drag-and-drop for lines in the editor
// enableDragAndDrop(editor: Editor) {
//     editor.on('renderLine', (cmLine: any, lineNumber: number) => {
// 	console.log('Rendering line: ', lineNumber); // Add this log
// 	// Create the drag handle element
// 	const handle = document.createElement('span');
// 	handle.className = 'drag-handle';
// 		cmLine.dom.prepend(handle); // Add the handle before the line content

// 	// Make the handle draggable
// 	handle.draggable = true;

// 	// Handle drag start
// 	handle.addEventListener('dragstart', (event: DragEvent) => {
//         event.dataTransfer?.setData('text/plain', lineNumber.toString());
// 	});

//       // Handle dropping the line
// 	cmLine.dom.addEventListener('drop', (event: DragEvent) => {
//         event.preventDefault();
//         const draggedLineNumber = event.dataTransfer?.getData('text/plain');
//         if (draggedLineNumber !== null) {
// 		const targetLineNumber = editor.coordsChar({ left: event.clientX, top: event.clientY }).line;
// 		this.moveLine(editor, parseInt(draggedLineNumber, 10), targetLineNumber);
//         }
// 	});

//       // Handle drag over (allow drop)
// 	cmLine.dom.addEventListener('dragover', (event: DragEvent) => {
//         event.preventDefault();
// 	});
//     });
// }

//   // Move a line from one position to another
// moveLine(editor: Editor, from: number, to: number) {
//     const lineContent = editor.getLine(from);
//     editor.replaceRange('', { line: from, ch: 0 }, { line: from + 1, ch: 0 }); // Remove the original line
//     editor.replaceRange(lineContent + '\n', { line: to, ch: 0 }); // Insert at the new position
// }

//   // Add custom styles for the drag handle
// addStyles() {
//     const style = document.createElement('style');
//     style.textContent = `
// 	.drag-handle {
//         display: inline-block;
//         cursor: grab;
//         visibility: hidden;
//         width: 12px;
//         height: 12px;
//         margin-right: 8px;
//         background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><circle cx="2" cy="2" r="2" fill="black"/><circle cx="2" cy="6" r="2" fill="black"/><circle cx="2" cy="10" r="2" fill="black"/><circle cx="6" cy="2" r="2" fill="black"/><circle cx="6" cy="6" r="2" fill="black"/><circle cx="6" cy="10" r="2" fill="black"/><circle cx="10" cy="2" r="2" fill="black"/><circle cx="10" cy="6" r="2" fill="black"/><circle cx="10" cy="10" r="2" fill="black"/></svg>') no-repeat center;
// 	}
// 	.cm-line:hover .drag-handle {
//         visibility: visible;
// 	}
//     `;
//     document.head.appendChild(style);
// }
// }