/* Creates the widget class, used to add instances off the widget thoroughout the document */

import { EditorView, WidgetType } from "@codemirror/view";

export class HandleWidget extends WidgetType { // Creates the drag handle class to be instanced
    constructor( // Passed when HandleWidget is called
        public el: HTMLElement, // HTML element of the widget
        readonly view: EditorView, // The view the widget is on
        // NOTE: Maybe add a position check for duplicate culling
    ) {
        super(); // Refers to the WidgetType constructor method (somehow?)
    }
    
    eq(other: HandleWidget) { // Checks other widgets for being in the same place on the same doc and prevents duplicates, may need more checks
        return other.el === this.el && other.view === this.view;
    }
        
    toDOM() { // Creates the widget's DOM element
        const handle = document.createSpan("drag-handle");
        //handle..addEventListener("click", (evt) => {
            //const menu = new Menu();;
        //}
        //handle.registerDomEvent(document, 'dragstart', (event : DragEvent) => this.handleHandler(event), true);
        
        return handle;
    }
    
    ignoreEvent() { // Ensures no events should be ignored by the widget
        return false;
    }
}