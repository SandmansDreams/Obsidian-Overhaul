/* Establishes the view plugin */

import { ViewPlugin, ViewUpdate, Decoration, DecorationSet, EditorView, } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language'; // The syntax tree is the HTML file, we should not need to do this
import { HandleWidget } from './HandleWidget';

class HandleViewPlugin { // View Plugin Class
    decorations: DecorationSet; // Stores active decorations 
    view: EditorView; // The view that renders the decoration
    //block: true; // Defines the widget as block rather than in-line

    constructor(view: EditorView) { // Called when the class is called
        this.view = view; // Set the view of the class equal to the constructed parameter
        this.decorations = this.build(view); // Build decorations to the view when the plugin is initialized
        console.log('HandleViewPlugin constructer called');
    }

    update(update: ViewUpdate) { // Called when the view updates
        console.log('View update called in View Plugin');
        this.view = update.view; // Updates the view
        if (update.docChanged || update.viewportChanged || update.focusChanged) { // Check for a change in the document, focus, or viewport, not 100% sure what the focus is
            this.build(update.view) // Rebuild
            console.log('Viewport rebuilt');
        }
    }

    destroy(): void {} // Returns undefined

    build(view: EditorView): DecorationSet { // Populates the decorations onto the document
        let builder = new RangeSetBuilder<Decoration>(); // Establishes a RangeSetBuilder for decorations and holds the decorations temporarily

        for (let { from, to } of view.visibleRanges) { // For all visible lines
            console.log('Found visible ranges from: ' + from + ' to: ' + to);
            for (let pos = from; pos <= to; pos++) { // Iterate over all lines in visible ranges
                let line = view.state.doc.lineAt(pos); // Get each line
                builder.add(line.from, line.from, Decoration.widget({ // Add widget to render queue
                    widget: new HandleWidget(view, line.from), // Place widget on the line in this view at the node location
                    side: -1 // Determines the side of the anchor the widget appears on, ordered by number, negative is left
                }));
            /* syntaxTree(view.state).iterate({ // Checks the visible range of lines
                from,
                to,
                enter(node) { // On each HTML node
                    if (node.type.name.includes('fold-indicator')) { // Check if there is a fold indicator, don't need to check for indents because the indicator appears at every indented location
                        console.warn(`Unexpected node type: ${node.type.name}`);
                        console.log('Attempted to render a HandleWidget on a fold indicator:');
                        console.log('Node Name: ' + node.type.name + ' | Node Pos: ' + from) // REMOVE
                        builder.add( // Add to the builder queue
                            node.from,
                            node.from, 
                            Decoration.widget({ 
                                widget: new HandleWidget(view, node.from), // Place widget on the line in this view at the node location
                                side: -1 // Determines the side of the anchor the widget appears on, ordered by number, negative is left
                            })
                        );
                        console.log('HandleWidget added to builder queue');
                    } else {
                        console.log('Attempted to render a HandleWidget not attached to a fold indicator:');
                        console.log('Node Name: ' + node.type.name + ' | Node Pos: ' + from);
                        //return; // NOTE: Here for testing purposes to stop a handle rendering everywhere to begin
                        builder.add( // Add to the builder queue
                            node.from,
                            node.from, 
                            Decoration.widget({ 
                                widget: new HandleWidget(view, node.from), // Place widget on the line in this view at the node location
                                side: -1 // Determines the side of the anchor the widget appears on, ordered by number, negative is left
                            })
                        ); 
                    } */    
            }
        };
        return builder.finish(); // Not totally sure what this does   
    }
}

export const createHandleViewPlugin = () => { // Function to return the view plugin
    console.log('Attempted to populate view plugin with decorations')
    return ViewPlugin.define( // Defines a new view plugin (using kinda strange syntax, this is just using an arrow function)
        (view: EditorView) => new HandleViewPlugin(view), // Honestly I have no clue what the rest of this does
        {
            decorations: (p) => p.decorations, // Provides decorations to the view plugin during construction
        }
    );
}
