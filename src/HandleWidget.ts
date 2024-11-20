/* Creates the widget class, used to add instances off the widget thoroughout the document */

import { EditorView, WidgetType } from "@codemirror/view";

export class HandleWidget extends WidgetType { // Creates the drag handle class to be instanced
    constructor( // Passed when HandleWidget is called
        readonly view: EditorView, // The view the widget is on
        readonly from: number
        // NOTE: Maybe add a position check for duplicate culling
    ) {
        super(); // Refers to the WidgetType constructor method (somehow?)
    }
    
    eq(other: HandleWidget) { // Checks other widgets for being in the same place on the same doc and prevents duplicates, may need more checks
        return other.from === this.from && other.view === this.view;
    }
        
    toDOM() { // Creates the widget's DOM element
/*         const handleWraper = document.createSpan('drag-handle'); // Creates a span to contain the handle and use for hitboxing
        handleWraper.className = 'drag-handle'; // Applies the CSS class
        handleWraper.setAttribute('aria-hidden', 'true'); // Can't read a handle, may not be needed
        handleWraper.setAttribute('contenteditable', 'false'); // Makes it so the span cant be edited with the text tools */

        // NOTE: May not need to wrap the handle in a span so testing without for now

        const handleIndicator = /* handleWraper.appendChild( */document.createSpan({cls:  "drag-handle-indicator", text: "⠿"})/* ) */; // Creates the visual part of the handle, not sure what cls means
        handleIndicator.className = 'drag-handle-indicator'; // Applies the CSS class, may not be needed
        //handleIndicator.setAttribute('aria-hidden', 'true'); // Can't read a handle, may not be needed
        handleIndicator.setAttribute('contenteditable', 'false'); // Makes it so the span cant be edited with the text tools

        //handle.addEventListener("click", (evt) => {
            //const menu = new Menu();;
        //}
        //handle.registerDomEvent(document, 'dragstart', (event : DragEvent) => this.handleHandler(event), true);
        
        return handleIndicator; // Returns the handle widget
    }
    
    ignoreEvent() { // Ensures no events should be ignored by the widget
        return false;
    }
}