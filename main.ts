// Import Obsidian API's needed
import { MarkdownView, Plugin } from 'obsidian';

// Main Plugin Class
export default class BlocksPlugin extends Plugin {
    // Variable declaration
    private draggableElement : HTMLElement;
    private elementData: string = '';
    private clone : Node; //= this.element.cloneNode(true); | May have to change this or make it part of a function

    // Load function events and needs when plugin is loaded
    async onload() {
        console.log('Obsidian Blocks Plugin Loaded');

        this.registerDomEvent(document, 'mouseenter', (event: MouseEvent) => this.hoverSelect(event), true);
        this.registerDomEvent(document, 'mouseleave', (event: MouseEvent) => this.hoverDeselect(event), true);
        //this.registerDomEvent(document, 'dragstart', (event: MouseEvent) => this.drag(event), true);
    }
    
    // Unload anything to conserve system resources when plugin is disabled
    async onunload() {
        console.log('Obsidian Blocks Plugin Unloaded');
    }

    hoverSelect(event : MouseEvent) {
        // Variable declaration
        let target : HTMLElement = event.target as HTMLElement
        let targetName : string = target.tagName;

        // Check if the is the markdown view and cancel running the function if it isn't
        // May not be necessary as the mouse event happens when a document element is hovered? Does this make it not work in source or reading view?
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) {
            return;
        }

        if (!view.containerEl.contains(target)) {
            return;
        }

        // Function checks for everything else first and cm-line last because everything has the cm-line class
        if (targetName = 'cm-callout') {
            console.log("Targeted: cm-callout on lines... don't know yet");
            this.createClone(target)
        } else if (targetName = 'HyperMD-codeblock') {
            console.log("Targeted: codeblock (not actually yet)");
            return;
        } else if (targetName = 'cm-line') {
            console.log("Targeted: cm-line");
            this.createClone(target)
        }
    }

    hoverDeselect(event : MouseEvent) {

    }

    createClone(target : HTMLElement) {
        // Avoid creating multiple clones
        if (this.clone) {
            this.clone.parentNode?.removeChild(this.clone);
            console.log('Clone removed.')
        }

        // Clone the element as a node
        target.style.opacity = '.2'
        this.clone = target.cloneNode(true);

        // Append the new node to the original node
        target.appendChild(this.clone);
        console.log('Clone created.')
    }
}




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