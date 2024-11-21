/* Creates the widget class, used to add instances off the widget thoroughout the document */

import { EditorView, WidgetType } from "@codemirror/view";

export class HandleWidget extends WidgetType { // Creates the drag handle class to be instanced
    constructor( // Passed when HandleWidget is called
        readonly view: EditorView, // The view the widget is on
        readonly from: number,
        // NOTE: Maybe add a position check for duplicate culling
    ) {
        console.log('HandleWidget constructed');
        super(); // Refers to the WidgetType constructor method (somehow?)
    }
    
    eq(other: HandleWidget) { // Checks other widgets for being in the same place on the same doc and prevents duplicates, may need more checks
        console.log('Other from: ' + other.from + ' | This from: ' + this.from);
        return other.from === this.from; // View comparison removed for potential issues but might need to be re-added
    }
        
    toDOM() { // Creates the widget's DOM element
/*         const handleWraper = document.createSpan('drag-handle'); // Creates a span to contain the handle and use for hitboxing
        handleWraper.className = 'drag-handle'; // Applies the CSS class
        handleWraper.setAttribute('contenteditable', 'false'); // Makes it so the span cant be edited with the text tools
        handleWraper.setAttribute('aria-hidden', 'true'); // Can't read a handle, may not be needed */

        // NOTE: May not need to wrap the handle in a span so testing without for now

        const handleIndicator = /* handleWraper.appendChild( */document.createSpan("drag-handle-indicator")/* ) */; // Creates the visual part of the handle
        handleIndicator.className = "drag-handle-indicator"; // NOTE: enabled for surety, may not be needed and might be handled by createSpan
        handleIndicator.textContent = "⠿";
        handleIndicator.setAttribute('contenteditable', 'false'); // Makes it so the span cant be edited with the text tools
        handleIndicator.setAttribute('aria-hidden', 'true'); // Can't read a handle
        
        //handle.addEventListener("click", (evt) => {
            //const menu = new Menu();;
        //}
        //handle.registerDomEvent(document, 'dragstart', (event : DragEvent) => this.handleHandler(event), true);
        console.log(handleIndicator + ' toDOM run.');
        return handleIndicator; // Returns the handle widget
    }
    
    ignoreEvent() { // Ensures no events should be ignored by the widget
        return false;
    }
}