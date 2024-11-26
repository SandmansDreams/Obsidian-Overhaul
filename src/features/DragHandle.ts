import { Decoration, DecorationSet, EditorView, PluginSpec, PluginValue, ViewPlugin, ViewUpdate, WidgetType, BlockInfo, Rect, } from '@codemirror/view';
import { RangeSet, RangeSetBuilder, StateEffect, StateField, Transaction, TransactionSpec, SelectionRange, EditorState, Extension, } from '@codemirror/state';
import { Notice, Platform, Plugin, Editor, App, MarkdownView, WorkspaceLeaf } from "obsidian";
import { Feature } from "./Feature";
import { MakeDirectoryOptions } from 'fs';
import { eventNames } from 'process';

// Main Feature Class
export class DragHandle implements Feature { // Used to grab the load and unload methods
    private dropZone: HTMLDivElement;
    private dropZonePadding: HTMLDivElement;
    private validDrops: Element[];
    private originState: DragOriginState | null = null;
    //private state: DragPostState | null = null;
    
    constructor ( 
        private plugin: Plugin,
        private view: MarkdownView,
    ) {};

    async load() { 
        this.plugin.registerEditorExtension(handleRender); 
        
        this.createDropZone();
        //this.getValidDrops();
        this.registerDOMEvents();
    }

    async unload() {
        this.removeDropZone();
        this.unregisterDOMEvents();
    }

    registerDOMEvents() {
        document.addEventListener('dragenter', (event: DragEvent) => {
            this.handleDragEnter(event);
        });

 /*        document.addEventListener('drop', (event: DragEvent) => {
            this.handleDrop(event);
        }); */
    }

    unregisterDOMEvents() {
        document.removeEventListener('dragenter', (event: DragEvent) => {
            this.handleDragEnter(event);
        });

/*         document.removeEventListener('drop', (event: DragEvent) => {
            this.handleDrop(event);
        }); */
    }

    createDropZone() { // Creates the drop zone visualizer for the drag handle
        // Creating a div to hold the drop zone and pad it without glitching
        this.dropZonePadding = document.createElement("div");
        this.dropZonePadding.classList.add("drop-zone-padding");

        // The visual part of the drop zone
        this.dropZone = this.dropZonePadding.appendChild(document.createElement("div"));
        this.dropZone.classList.add("drop-zone");
        this.dropZone.style.display = "none"; // Makes the zone invisible when loaded

        document.body.appendChild(this.dropZonePadding);
    }
    
    removeDropZone() { // Removes the drop zone from the document
        document.body.removeChild(this.dropZonePadding);
        // @ts-ignore
        this.dropZonePadding = null;
        // @ts-ignore
        this.dropZone = null;
    }

    private handleDragEnter = (event: DragEvent) => { 
        event.preventDefault();
        event.stopPropagation(); // May break it
    }

    private handleDrop = (event: DragEvent) => {
        event.preventDefault();
        //event.stopPropagation(); 

        let data = event.dataTransfer?.getData('text/plain');
        
    }
}

// Widget Class
export class HandleWidget extends WidgetType { // Establishes the handle widget
    constructor( // Called when the widget is created
        //public leaf: WorkspaceLeaf,
        protected view: MarkdownView,
        protected line: number,
        /* public selectionStart: EditorPosition,
        public selectionEnd: EditorPosition, */
        protected plugin: Plugin,
    ) { 
        super();
    }

    eq(other: HandleWidget) { // Used to compare different handle widgets and avoid rendering duplicates
        return other.line === this.line ;
    }

    toDOM(view: EditorView): HTMLElement { // What happens when the DOM is loaded
        // The handle container and background
        const handleIndicator = document.createElement('div');
        handleIndicator.className = 'drag-handle-indicator';
        handleIndicator.setAttribute('contenteditable', 'false'); // Makes it so the handle cannot be deleted with backspace
        handleIndicator.setAttribute('aria-hidden', 'true');
        handleIndicator.draggable = true;

        // The actual visual element of the handle
        const handleIcon = handleIndicator.appendChild(document.createElement('div'));
        handleIcon.className = 'drag-handle-icon';
        handleIcon.innerText = '⠿';
        handleIcon.setAttribute('contenteditable', 'false');
        handleIcon.setAttribute('aria-hidden', 'true');

        /* handleIndicator.onclick = (event) => { // Click event for bringing up a menu
            this.handleClick();
        }; */

        handleIndicator.ondragstart = (event) => { // Drag event for beginning the drag and creating an element preview
            let parentEl = handleIndicator.parentElement;

            if (parentEl){ // Have to confirm if parentEl exists because dataTransfer methods can't accept null
                // Have to use JS to establish the styles because for some reason it selects way more than just the parent element otherwise
                parentEl.style.backgroundColor = 'var(--interactive-hover)';
                parentEl.style.borderRadius = '5px';
                parentEl.style.boxShadow = '3px 3px 5px black';

                // Set the data for the JS drag and drop API
                //let selection = this.editor.getRange({line: this.line, ch: this.selectionStart}, {line: this.line, ch: this.selectionEnd});
                event.dataTransfer?.setData('text/plain', view.state.doc.lineAt(this.line).text);
                console.log('text saved to dataTransfer: ' + view.state.doc.lineAt(this.line).text);
                event.dataTransfer?.setDragImage(parentEl, 0, parentEl.clientHeight/2);
            }
            // NOTE: Add implementation so the user can move, copy, or create a document heading link to the content
        }

        handleIndicator.ondrop = (event) => {
            event.preventDefault();
            
            let data = event.dataTransfer?.getData('text/plain') as string;
            let coords = {x: event.clientX, y: event.clientY};
            let newPos: number = view.posAtCoords(coords) as number;
            let newLine = view.state.doc.lineAt(newPos);

            //view.state.doc.replace(newLine.from, newLine.to, data);
            
            
            
        }

        return handleIndicator;
    }
    
    ignoreEvent(event: Event): boolean { // Ensures that no events are ignored by the handle
        return false;
    }

    /* coordsAt(dom: HTMLElement, pos: number, side: number): Rect | null { // Override the way screen coordinates for positions at/in the widget are found
        // May be used for visual offset later?
    } */

    destroy() {} // Used to destroy the widget, returns undefined
}

// View Plugin Class
class HandleViewPlugin { // View plugin class
    plugin: Plugin;
    public editor: MarkdownView;
    decorations: DecorationSet;

    constructor(view: EditorView) { // Called on plugin load
        //this.editor = this.plugin.app.workspace.getActiveViewOfType(MarkdownView) as MarkdownView;
        //console.log('Editor: ' + this.editor);
        this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) { // Called when the view changes
        if (update.docChanged || update.viewportChanged || update.focusChanged) {
        this.decorations = this.buildDecorations(update.view);
        }
    }

    destroy() {} // Used to get rid of view plugin effects

    buildDecorations(view: EditorView): DecorationSet { // Adds widgets to a render queue and then renders them to the document
        /* ToDo:
        - Handles only appear on every other line or any line with content (likely appearing where linebreaks are in the source)
          - Either make it so only lines with letters have handles or that all lines have handles reguardless
        - The handle widget does not care about the collapse widget at all
          - No idea how to make this happen, may have to access the syntaxTree and just place it beside them
          - The widgets have auto-ordering if you put them in the same place, only issue is I have no idea how the collapse indicators are rendered
        - There are still some rendeing issues
          - Need to do the selection code for chunks of content like callouts and codeblocks
          - Handles tab things in, indenting paragraphs (which I like but is not how collapse indicators work) 
          - Handles do not render after indents
          - Scale changes with the font size (in stuff like headings) but the div size does not
            - Fix by making the handle consistent size not font variable, may be fixed by making it an SVG icon
        - Want the content highlighted when the handle is hovered so you can visualize what you are about to move, could do this with clone
        */
       
        const builder = new RangeSetBuilder<Decoration>();

        for (let { from, to } of view.visibleRanges) {
            for (let pos = from; pos <= to; pos++ ) {
                let line = view.state.doc.lineAt(pos);
                builder.add(line.from, line.from, Decoration.widget({
                    widget: new HandleWidget(this.editor, line.number, this.plugin),
                    side: -1,
                    inlineOrder: true,
                }));
                pos = line.to + 1;
            }
        }

        return builder.finish();
    }
};

// Assigning the view plugin to a variable
const handleRender: Extension = ViewPlugin.fromClass(
    HandleViewPlugin, 
    {decorations: (value: HandleViewPlugin) => value.decorations},
);

// Interfaces
interface DragOriginState { // The original editor and location of the line being dragged
    editor: Editor,
    //leaf: WorkspaceLeaf,
    line: number,
}

interface PotentialDropTarget {
    line: number;
    content: string;
}

// Functions
/* function isHandle(event: DragEvent) {
    let targetEl: HTMLElement = event.target as HTMLElement;

    while (targetEl) { // Waits so that the if statement can traverse up the element tree
        if (targetEl.classList.contains("drag-handle-indicator")) {
            return true;
        }
    }
  
    return false;
}

function getEditor(): Editor {
    return this.app.view.workspace.getActiveViewOfType(MarkdownView);
} */

/* function getLeaf(): WorkspaceLeaf {
    return this.app.view.WorkspaceLeaf.view.getLeaf();
} */

/* function getEditorViewFromElement(element: HTMLElement) { 
    while (element && !element.classList.contains("cm-editor")) {
        element = element.parentElement as HTMLElement;
    }
  
    if (!element) {
      return null;
    }
  
    return EditorView.findFromDOM(element);
} */