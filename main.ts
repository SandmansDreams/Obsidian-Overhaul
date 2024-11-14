/* import { Plugin, Editor, MarkdownView } from 'obsidian';
import { gutter, GutterMarker, Decoration, EditorView } from '@codemirror/view';
import { RangeSetBuilder } from "@codemirror/state";

export class HandleGutter extends GutterMarker { // Gutter for the handles
    constructor(public readonly text: string) { // When object is created, pass a string?
        super();
    }

    eq(other: HandleGutter): boolean { // Check for another HandleGutter and set this.text equal to its text
        return other instanceof HandleGutter && this.text === other.text;
    }

    toDOM() { // Create the handle in the dom
        return document.createTextNode(this.text);
    }

    destroy(dom: HTMLElement): void { // When line is scrolled out of view, remove the rendering of the gutter marker for that line
        if (!document.body.contains(dom)) dom.remove();
    }
}

export default class Blocks extends Plugin { // The main plugin class  
    // Variable declaration
    private view: MarkdownView | null = this.app.workspace.getActiveViewOfType(MarkdownView);
    //private changesBuffer = [];

    async onload() { // Things that happen on plugin load
        console.log('Blocks Plugin Loaded'); //REMOVE

        //this.initializeGutter();
        this.testGutter();
    }

    async onunload() { // Things that will be unloaded when the plugin is disabled
        console.log('Blocks Plugin Unoaded'); //REMOVE
    }
    
    checkEditor(view: MarkdownView | null) { // Check to see if we are in a markdown file editor
        if (!view) { // If we are not in the markdown view, fail the check and stop the function
            return false;
        }
        return true;
    }   
    
    testGutter() { // Gutter to test how it works
        return new HandleGutter("+");
    }

    initializeGutter() { // Creates the cm gutter and fills it with blank space	
        if (this.checkEditor(this.view)) {
            const emptyMarker = new class extends GutterMarker {
                toDOM() { return document.createTextNode("≡") }
            }
    
            const emptyLineGutter = gutter({
                lineMarker(view, line) {
                    return line.from == line.to ? emptyMarker : null;
                },
                initialSpacer: () => emptyMarker
            });
    
            console.log('Gutter Initialized'); //REMOVE
        } else {
            console.log('Gutter Failed To Initialize'); //REMOVE
        }
    }
    
    
    // decorateLines(view: MarkdownView) { // Decorates the lines selected with a highlight
    //     const highlight = Decoration.line({ // NOT 100% SURE WHAT ANY OF THIS DOES...
    //         attributes: {class: "highlight"} // highlight needs to be a CSS class, I want to use the default for Obsidian but can't find it
    //     });
        
    //     let builder = new RangeSetBuilder<Decoration>();
        
    //     for (let {from, to} of view.visibleRanges) {
    //         for (let pos = from; pos <= to;) {
    //             builder.add(line.to, line.from, highlight);
    //         }
    //         }
    //         return builder.finish()	
    //     }  
    
    // dispatchChanges(view: MarkdownView, /*rangeStart, rangeEndBLA) { // Dispatch the state change for undoing actions
    //     view.dispatch({changes: this.changesBuffer});
    //     this.changesBuffer = [];
        
    //     /*
    //     //POSSIBLE ALT: let state = EditorTransaction.changes?;
    //     let state = EditorState.create(view.document); // NOT SURE IF THIS IS HOW THIS WORKS...
    //     let transaction = state.update({changes: [{from: rangeStart, to: rangeEnd}]});
    //     view.dispatch(transaction);
    //     BLA
    // }
} 
*/

import { Plugin } from 'obsidian';
import { gutter, GutterMarker } from '@codemirror/view';

export class HandleGutter extends GutterMarker { // Gutter for the handles
    constructor(public readonly text: string) { // When object is created, pass a string?
        super();
    }

    toDOM() { // Create the handle
        return document.createTextNode(this.text);
    }

    destroy(dom: HTMLElement): void { // When line is scrolled out of view, remove the rendering of the gutter marker for that line
        if (!document.body.contains(dom)) dom.remove();
    }
 }

export default class Blocks extends Plugin { // The main plugin class
  async onload() { // Things that happen on plugin load
        this.testGutter();
   }

  testGutter() { // Gutter to test how it works
        return new HandleGutter("+");
   }
}

