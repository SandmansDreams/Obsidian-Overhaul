/* The drag handle widget class */

import { EditorView, lineNumbers, WidgetType, } from '@codemirror/view';
import { Editor, EditorPosition, MarkdownView, Plugin, } from 'obsidian';

export class HandleWidget extends WidgetType { // Establishes the handle widget
    constructor( // Called when the widget is created
        //public leaf: WorkspaceLeaf,
        public line: number,
        /* public selectionStart: EditorPosition,
        public selectionEnd: EditorPosition, */
        public plugin: Plugin,
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

            view.state.doc.replace(newLine.from, newLine.to, data);
            
            
            
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