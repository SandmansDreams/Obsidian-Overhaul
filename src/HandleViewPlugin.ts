/* Establishes the view plugin */

import { ViewPlugin, ViewUpdate, Decoration, DecorationSet, EditorView, } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { HandleWidget } from './HandleWidget';

class HandleViewPlugin { // View Plugin Class
    decorations: DecorationSet; // Stores active decorations 
    view: EditorView; // The view that renders the decoration
    //block: true; // Defines the widget as block rather than in-line

    constructor(view: EditorView) { // Called when the class is called
        this.view = view; // Set the view of the class equal to the constructed parameter
        this.decorations = this.build(view); // Build decorations to the view when the plugin is initialized
    }

    update(update: ViewUpdate) { // Called when the view updates
        this.view = update.view; // Updates the view
        if (update.docChanged || update.viewportChanged || update.focusChanged) { // Check for a change in the document, focus, or viewport, not 100% sure what the focus is
            this.build(update.view) // Rebuild
        }
    }

    destroy(): void {
        return void(0); // Returns undefined
    }

    build(view: EditorView): DecorationSet { // Populates the decorations onto the document
        const builder = new RangeSetBuilder<Decoration>(); // Establishes a RangeSetBuilder for decorations and holds the decorations temporarily
        
        for (const { from, to } of view.visibleRanges) { // For all visible lines
            syntaxTree(view.state).iterate({ // Checks the visible range of lines
                from,
                to,
                enter(node) { // On each node (or line)
                    if (node.type.name.startsWith('fold-indicator')) { // Check if there is a fold indicator, don't need to check for indents because the indicator appears at every indented location
                        console.log('Node Name: ' + node.type.name + ' | Node Pos: ' + from) // REMOVE
                        builder.add( // Add to the builder queue
                            node.from - 1,
                            node.from - 1, 
                            Decoration.widget({ 
                                widget: new HandleWidget(view, node.from), // Place widget on the line in this view at the node location
                                side: -1 // Determines the side of the anchor the widget appears on, ordered by number, negative is left
                            })
                        ); 
                    } else {
                        return;
                        builder.add( // Add to the builder queue
                            node.from - 1,
                            node.from - 1, 
                            Decoration.widget({ 
                                widget: new HandleWidget(view, node.from), // Place widget on the line in this view at the node location
                                side: -1 // Determines the side of the anchor the widget appears on, ordered by number, negative is left
                            })
                        ); 
                    }
                        
                },
            });
        }
        return builder.finish();        
    }
}

export const createHandleViewPlugin = () => { // Function to return the view plugin
    return ViewPlugin.define( // Defines a new view plugin (using kinda strange syntax, this is just using an arrow function)
        (view: EditorView) => new HandleViewPlugin(view), // Honestly I have no clue what the rest of this does
        {
            decorations: (p) => p.decorations, // Provides decorations to the view plugin during construction
        }
    )
}
