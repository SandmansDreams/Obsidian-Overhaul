/*
NOTES:
- Can use the .cm-active CSS class in order to do the line preview
- Might be able to use the CSS thing ::before to append it to the collapsible folder icon and inherit its properties
- Look into widgets
  - Use inline widgets
- IMPLEMENT THE HANDLE AS A BUTTON
- Use the DataTransfer object to handle movement of data
- Look into this.registerMarkdownCodeBlocksProcessor() for codeblock ease

TODO:
- Select an move a set of lines at once (might need to implement block functionality for this)
- Column blocks
*/






import { Plugin, Editor, MarkdownView,  } from 'obsidian';
import { WidgetType, Decoration, EditorView, } from '@codemirror/view';

// Widget class for the handle
export class HandleWidget extends WidgetType {
    toDOM(view: EditorView): HTMLElement {
        const handle = document.createElement('span');
        handle.innerText = '≡';
        handle.className = 'drag-handle';
        handle.draggable = true;
        handle.addEventListener('dragstart', this.handleDrag(event: DragEvent));
        return handle;
    }
}

// Main plugin class
export default class Blocks extends Plugin {
    private dragHandle: HandleWidget;

    // Load the plugin
    async onload() {
        console.log('Blocks Plugin Loaded') //REMOVE

        this.registerDomEvent(document, 'mouseenter', (event : MouseEvent) => this.renderHandle(event), true);
    }

    // Unload the plugin
    async onunload() {
        console.log('Blocks Plugin Unoaded') //REMOVE
    }

    checkEnvironment() {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);

        // Make sure we are in markdown view
        if (!view) {
            console.log('Check Failed'); // REMOVE before final compilation
            return false;
        }
      
        // Make sure the target container element contains the target? Redundant??? (This was suggested by someone on the discord)
        // if (!view.containerEl.contains(target)) {
        //     console.log('Check Failed'); // REMOVE before final compilation
        //     return false;
        // }

        // Psuedocode
        // if (inside the text container) {
        //     return true;
        // }
        

        console.log('Check Passed'); // REMOVE before final compilation
        return true;
    }

    renderHandle (editor: Editor, event: MouseEvent) {
        if (this.checkEnvironment()) {
            const target = event.target as HTMLElement;
            //editor = this.app.workspace.getActiveViewOfType(MarkdownView);

            // Remove the drag handle if it exists
            if (this.dragHandle) {
                this.dragHandle.destroy(this.dragHandle);
            }
    
            this.dragHandle = new HandleWidget();

        } else {
            return;
        }
        
    }

    // Do the dragging of the handle itself
    handleDrag (event: DragEvent) {
        event.dataTransfer?.setData('text/plain', lineNumber.toString());
    }
}








/* Alpha 1, non-working
// Import API's
import { on } from 'events';
import { MarkdownView, Plugin, } from 'obsidian';
import { EditorView, WidgetType } from '@codemirror/view';
import { createBrotliCompress } from 'zlib';

// Creates a widget class for the handle
export class HandleWidget extends WidgetType {
    toDOM(view: EditorView): HTMLElement {
        const handle = document.createElement('span');
        handle.innerText = '::';
        handle.draggable = true;
        handle.className = 'drag-handle';
        handle.addEventListener('dragstart', handleHandler(event: DragEvent));
        return handle;
    }
}

// Main Plugin Class
export default class BlocksPlugin extends Plugin {
    private handleBuffer : string = ''; // May not be needed if thing works
    private clone : HTMLElement; // No idea if this should be a node or HTMLElement or what the difference is
    private dragHandle = new HandleWidget();

    // Load function events and needs when plugin is loaded
    async onload() {
        console.log('Obsidian Blocks Plugin Loaded'); // REMOVE before final compilation

        // DOM events, do not use 'mouseover' as it activates every time the mouse is moved on an event, make sure to clear these 
        //this.registerDomEvent(document, 'mouseenter', (event: MouseEvent) => this.testRender(event), true);
        this.registerDomEvent(document, 'mouseenter', (event: MouseEvent) => this.handleRender(event), true);
        this.registerDomEvent(document, 'mouseleave', (event: MouseEvent) => this.handleRemover(event), true);
        //this.registerDomEvent(document, 'dragstart', (event: MouseEvent) => this.drag(event), true);
    }
    
    // Unload anything to conserve system resources when plugin is disabled
    async onunload() {
        console.log('Obsidian Blocks Plugin Unloaded'); // REMOVE before final compilation
    }

    
    // Test rendering function to figure out how to instance an HTML element
    testRender(event: MouseEvent) {
        //console.log(event.target);
        const target : HTMLElement = event.target as HTMLElement;
        const isWorkspace = this.checkEnvironment(target);

        // If the workspace check passes, do the function, otherwise cancel it
        if (isWorkspace) {
            this.dragHandle = document.createElement('span');
            this.dragHandle.className = 'drag-handle';
            this.dragHandle.innerText = '::';
    
            target.appendChild(this.dragHandle);
        } else {
            return;
        }
    }
    

    // Check if the mouse is inside the editor and not anywhere else
    // May want to update this to make sure the mouse is within the text container in the viewport the test still passes if the title and tab are hovered over, might be ".cm-resize"?
    checkEnvironment(target: HTMLElement) {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);

        // Make sure we are in markdown view
        if (!view) {
            console.log('Check Failed'); // REMOVE before final compilation
            return false;
        }
      
        // Make sure the target container element contains the target? Redundant??? (This was suggested by someone on the discord)
        if (!view.containerEl.contains(target)) {
            console.log('Check Failed'); // REMOVE before final compilation
            return false;
        }

        Psuedocode
        if (inside the text container) {
            return true;
        }
        

        console.log('Check Passed'); // REMOVE before final compilation
        return true;
    }

    // Render the handle when the line or element is hovered over
    handleRender (event : MouseEvent) {
        this.handleBuffer = '';
        const target : HTMLElement = event.target as HTMLElement
        //const targetClass : ??? = target.???;
        const targetClass : string = target.className;
        const isWorkspace = this.checkEnvironment(target);

        if (isWorkspace) {

            Psuedocode
            // Handle things differently depending on the class of the target, each of these should update the 'handleBuffer'
            if (targetClass === 'cm-callout') {
                const parent = target.closest('callout');
                get the lines the callout is on
                this.handleBuffer = the data on the lines found

                // ChatGPT did have this working at some point
                place the handle at the midpoint of the callout
                    find the lines, determine the height, and place it in the center?
                    use decorations to prepend the symbol to the parent element (callout)?
            } else if (targetClass === 'HyperMD-codeblock') {
                const topParentLine = go up in divs to find the 'HyperMD-codeblock-beginning' (or whatever) and get the line its on
                const bottomParentLine = go down in divs to find the 'HyperMD-codeblock-ending' (or whatever) and get the line its on
                this.handleBuffer = all the data on those lines and between

                place the handle at the midpoint of the codeblock
                    find the lines, determine the height, and place it in the center?
                    use decorations to prepend the symbol to the parent element (HyperMD-codeblock)? This might not work since its not a container
            } else 
            if (targetClass === 'cm-line') { // This should handle everything that is not grouped or a special case (may not handle images or embeded notes)
                this.handleBuffer = target.getText();
            } 

            // No clue if this syntax is correct
            // May need to append dragHandle
            this.dragHandle.addEventListener("dragstart", (event : DragEvent) => this.handleHandler(event), true);
        } else {
            return;
        }       
    }

    handleRemover (event : MouseEvent) {
        
    }

    // Handle the drag and drop of the handle
    handleHandler(event : DragEvent) {

        //this.createClone();

        
    }

    // UNTESTED, creates a clone and appends it to the drag handle
    createClone() {
        // Avoid creating multiple clones
        if (this.clone) {
            this.clone.remove() // Needs to be changed if clone becomes a node
            console.log('Clone copy removed.')
        }

        // Clone the element as an HTML Element
        this.clone = document.createElement('span');
        this.clone.id = 'clone'; // May not be needed
        this.clone.className = 'drag-clone';
        this.clone.innerText = this.handleBuffer;

        // Append the new node to the original node
        this.dragHandle.appendChild(this.clone);
        console.log('Clone created.')
    }
}
*/




/* CHATGPT ONLY VERSION
import { MarkdownView, Plugin } from 'obsidian';

// Main Plugin Class
export default class BlocksPlugin extends Plugin {
    private handle: HTMLElement | null = null;
    private clonedElement: HTMLElement | null = null; // The cloned element used for dragging
    private isDragging: boolean = false; // To track if we're currently dragging
    private originalElement: HTMLElement | null = null; // The element being cloned

    async onload() {
        console.log('Obsidian Blocks Loaded');
        
        // Register mouse events
        this.registerDomEvent(document, 'mouseenter', (event: MouseEvent) => this.handleMouseEnter(event), true);
        this.registerDomEvent(document, 'mousedown', (event: MouseEvent) => this.startDragging(event), true);
        this.registerDomEvent(document, 'mousemove', (event: MouseEvent) => this.onMouseMove(event), true);
        this.registerDomEvent(document, 'mouseup', (event: MouseEvent) => this.endDragging(event), true);
    }

    onunload() {
        console.log('Obsidian Blocks Unloaded');
    }

    // Mouse enters the element, trigger cloning
    handleMouseEnter(event: MouseEvent) {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return;

        const target = event.target as HTMLElement;
        const callout = target.closest('callout');
        const codeblockLine = target.closest('HyperMD-codeblock-begin');

        // Only clone elements when the user hovers over them
        if (callout || codeblockLine) {
            this.cloneElement(target);
        }

        if (target.classList.contains('cm-line')) {
            this.cloneElement(target);
        }
    }

    // Clone the hovered element into a new overlay with the handle
    cloneElement(target: HTMLElement) {
        // Avoid creating multiple clones
        if (this.clonedElement) {
            this.clonedElement.remove();
        }

        // Clone the original element
        this.clonedElement = target.cloneNode(true) as HTMLElement;
        this.clonedElement.style.position = 'absolute';
        this.clonedElement.style.pointerEvents = 'none'; // Disable direct interactions with this element
        this.clonedElement.style.zIndex = '1000';
        this.clonedElement.style.opacity = '0.9'; // Slight transparency for visual feedback
        this.clonedElement.style.outline = '2px solid grey'; // Visual cue
        this.clonedElement.style.backgroundColor = 'black';
        this.originalElement = target; // Keep a reference to the original

        // Add the drag handle to the cloned element
        this.addHandle(this.clonedElement);

        // Append the cloned element to the body
        document.body.appendChild(this.clonedElement);

        // Position the cloned element over the original
        const rect = target.getBoundingClientRect();
        this.clonedElement.style.left = `${rect.left}px`;
        this.clonedElement.style.top = `${rect.top}px`;
        this.clonedElement.style.width = `${rect.width}px`;
        this.clonedElement.style.height = `${rect.height}px`;
    }

    // Add a handle to the cloned element
    addHandle(clonedElement: HTMLElement) {
        // Create a drag handle
        this.handle = document.createElement('div');
        this.handle.className = 'drag-handle';
        this.handle.innerHTML = '&#x2630;';
        this.handle.style.position = 'absolute';
        this.handle.style.left = '-30px'; // Place the handle to the left of the element
        this.handle.style.top = '50%';
        this.handle.style.transform = 'translateY(-50%)'; // Center the handle vertically
        this.handle.style.cursor = 'grab';
        this.handle.style.fontSize = '14px';
        this.handle.style.color = 'grey';
        this.handle.style.backgroundColor = 'rgba(255,255,255,0.8)';
        this.handle.style.borderRadius = '3px';
        this.handle.style.zIndex = '1001'; // Above the cloned element

        // Append the handle to the cloned element
        clonedElement.appendChild(this.handle);
    }

    // Start dragging the cloned element
    startDragging(event: MouseEvent) {
        if (event.target === this.handle) {
            this.isDragging = true;
            this.clonedElement!.style.pointerEvents = 'none'; // Prevent interactions with the cloned element
        }
    }

    // Move the cloned element during dragging
    onMouseMove(event: MouseEvent) {
        if (this.isDragging && this.clonedElement) {
            this.clonedElement.style.left = `${event.clientX - 20}px`; // Move with some offset
            this.clonedElement.style.top = `${event.clientY - 20}px`;
        }
    }

    // End dragging and "drop" the element into place
    endDragging(event: MouseEvent) {
        if (this.isDragging && this.clonedElement) {
            this.isDragging = false;

            // Get the drop target (where the user let go)
            const dropTarget = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
            const insertPosition = dropTarget.closest('cm-line');

            // Remove the clone after dropping
            this.clonedElement.remove();
            this.clonedElement = null;

            if (insertPosition && this.originalElement) {
                // Move the original element to the new position
                insertPosition.parentElement?.insertBefore(this.originalElement, insertPosition.nextElementSibling);

                // Reset styles on the original element
                this.originalElement.style.outline = '';
                this.originalElement.style.opacity = '1.0';
                this.originalElement = null;
            }
        }
    }
}
*/