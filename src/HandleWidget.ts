/* Creates the widget class, used to add instances off the widget thoroughout the document */

import { EditorView, WidgetType, BlockInfo } from '@codemirror/view';
import { Notice, requestUrl, Editor, Plugin, App, MarkdownView, } from 'obsidian';
import { eventNames } from 'process';
import Blocks from './main';

export class HandleWidget extends WidgetType {
    constructor( // Called when a handle widget is rendered
        public line: number,
        public ch: number,
        public text: string,
    ) {
        super();
    }

    eq(other: HandleWidget) { // Used to compare different handle widgets and avoid rendering duplicates
        return other.line === this.line && other.text === this.text;
    }
    
    toDOM(view: EditorView): HTMLElement { // What happens when the DOM is loaded
        // The handle container and background
        const handleIndicator = document.createElement('div');
        handleIndicator.className = 'drag-handle-indicator';
        handleIndicator.setAttribute('contenteditable', 'false'); // Makes it so the handle cannot be deleted with backspace
        handleIndicator.setAttribute('aria-hidden', 'true');
        handleIndicator.draggable = true;

        // The actual visual element of the handle
        const handleIcon = document.createElement('div');
        handleIcon.className = 'drag-handle-icon';
        handleIcon.innerText = '⠿';
        handleIcon.setAttribute('contenteditable', 'false');
        handleIcon.setAttribute('aria-hidden', 'true')

        handleIndicator.onclick = (event) => { // Click event for bringing up a menu
            this.handleClick();
        };

        handleIndicator.ondragstart = (event) => { // Drag event for beginning the drag and creating an element preview
            //this.handleDrag();
            let parentEl = handleIndicator.parentElement;

            if (parentEl){ // Have to confirm if parentEl exists because dataTransfer methods can't accept null
                // Have to use JS to establish the styles because for some reason it selects way more than just the parent element otherwise
                parentEl.style.backgroundColor = 'var(--interactive-hover)';
                parentEl.style.borderRadius = '5px';
                parentEl.style.boxShadow = '3px 3px 5px black';

                event.dataTransfer?.setData('text/plain', this.text);
                event.dataTransfer?.setDragImage(parentEl, 0, parentEl.clientHeight/2);
            }
            //parentEl.className = 'drag-clone';

            // @ts-ignore dataTransfer should not be null if a dragEvent occurs
            // event.dataTransfer.effectAllowed = 'copymove';
            // NOTE: Add implementation so the user can move, copy, or create a document heading link to the content
        }

        handleIndicator.ondragover = (event) => { // Drag event for creating a drop-zone preview and finding acceptable drops
            event.preventDefault; 
            
            // NOTE: Implement drop-zone preview
            //let hoveredNode = event.targetNode;
            //return;
        }

        handleIndicator.ondrop = (event) => { // Drop event for placing text
            event.preventDefault();
            const data = event.dataTransfer?.getData("text/plain");


/*             if (isAcceptableDrop) {
                console.log(isAcceptableDrop);

            } */
        }

        handleIndicator.appendChild(handleIcon);
        return handleIndicator;
    }

    ignoreEvent(event: Event): boolean { // Ensures that no events are ignored by the handle
        return false;
    }

    destroy() {} // Used to destroy the widget, returns undefined
    
    handleClick() { // What happens when handle is clicked
        return; // Temporary return for testing
    }

    handleDrag(data: DataTransfer) { // What happens when handle is dragged
        return;
    }

    getEditorFromPlugin = (plugin: Blocks): MarkdownView | null => {
        return plugin.getEditor();
    }
}
  