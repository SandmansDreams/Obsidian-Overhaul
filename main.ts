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
    MarkdownView,
    Plugin
} from 'obsidian';

// Main Plugin Function
export default class BlocksPlugin extends Plugin {
    private handle: HTMLElement | null = null; // Store reference to the handle

    async onload() {
        console.log('Obsidian Blocks Loaded');

        // Register mouse event listeners using arrow functions
        this.registerDomEvent(document, 'mouseenter', (event: MouseEvent) => { this.handleMouseEnter(event); }, true);
        this.registerDomEvent(document, 'mouseleave', (event: MouseEvent) => { this.handleMouseLeave(event); }, true);
    }

    onunload() {
        console.log('Obsidian Blocks UnLoaded');
    }

    // Add a bounding box and handle on mouse enter
    handleMouseEnter(event: MouseEvent) {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);

        if (view) {
            const target = event.target as HTMLElement;
            const callout = target.closest('.callout');
            const codeblockLine = target.closest('.HyperMD-codeblock-begin');

            if (callout) {
                this.addBoundingBox(callout as HTMLElement);
                this.addHandle(callout as HTMLElement);
                console.log('Highlighted callout');
            }

            if (codeblockLine) {
                const codeblockContainer = this.findCompleteCodeBlock(codeblockLine as HTMLElement);
                if (codeblockContainer.length > 0) {
                    this.addBoundingBoxMultiple(codeblockContainer);
                    this.addHandle(codeblockContainer[0]);  // Add handle to the first line
                    console.log('Highlighted full code block');
                }
            }

            if (target.classList.contains('cm-line')) {
                this.addBoundingBox(target);
                this.addHandle(target);
                console.log('Highlighted line');
            }
        }
    }

    // Remove the bounding box and handle on mouse leave
    handleMouseLeave(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const callout = target.closest('.callout');
        const codeblockLine = target.closest('.HyperMD-codeblock-begin');
    
        if (callout) {
            this.removeBoundingBox(callout as HTMLElement);
            this.removeHandle();
            return;
        }
    
        if (codeblockLine) {
            const codeblockContainer = this.findCompleteCodeBlock(codeblockLine as HTMLElement);
            if (codeblockContainer.length > 0) {
                this.removeBoundingBoxMultiple(codeblockContainer);
                this.removeHandle();
                return;
            }
        }
    
        if (target.classList.contains('cm-line')) {
            this.removeBoundingBox(target);
            this.removeHandle();
        }
    }

    // Add bounding box styles for a single element
    addBoundingBox(element: HTMLElement) {
        element.style.outline = '2px solid grey';
        element.style.borderRadius = '5px';
    }

    // Add bounding box styles for multiple elements (code block)
    addBoundingBoxMultiple(elements: HTMLElement[]) {
        elements.forEach((element) => {
            this.addBoundingBox(element);
        });
    }

    // Remove bounding box styles for a single element
    removeBoundingBox(element: HTMLElement) {
        element.style.outline = '';
        element.style.borderRadius = '';
    }

    // Remove bounding box styles for multiple elements
    removeBoundingBoxMultiple(elements: HTMLElement[]) {
        elements.forEach((element) => {
            this.removeBoundingBox(element);
        });
    }

    // Add a draggable handle as a visual element
    addHandle(element: HTMLElement) {
        if (!this.handle) {
            this.handle = document.createElement('div');
            this.handle.className = 'drag-handle';
            this.handle.innerHTML = '&#x2630;';
            this.handle.style.position = 'fixed';
            this.handle.style.cursor = 'grab';
            this.handle.style.fontSize = '14px';
            this.handle.style.color = 'grey';
            this.handle.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            this.handle.style.borderRadius = '3px';
            this.handle.style.zIndex = '1000';

            document.body.appendChild(this.handle);
        }

        const rect = element.getBoundingClientRect();
        
        if (this.handle) {
            this.handle.style.left = `${rect.left - 30}px`;
            this.handle.style.top = `${rect.top + (rect.height / 2)}px`;
        }
    }

    // Remove the handle when the mouse leaves
    removeHandle() {
        if (this.handle) {
            this.handle.remove();
            this.handle = null;
        }
    }

    // Function to find and return all lines of the code block
    findCompleteCodeBlock(codeblockLine: HTMLElement): HTMLElement[] {
        const codeBlockLines: HTMLElement[] = [];
        let currentElement: HTMLElement | null = codeblockLine;

        // Traverse down to get all lines in the block
        while (currentElement && currentElement.classList.contains('cm-line')) {
            codeBlockLines.push(currentElement);
            currentElement = currentElement.nextElementSibling as HTMLElement;
        }

        return codeBlockLines;
    }
}