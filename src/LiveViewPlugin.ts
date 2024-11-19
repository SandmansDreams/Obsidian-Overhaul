/* Establishes the view plugin */

import { ViewPlugin, ViewUpdate, Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { RangeSet, RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { HandleWidget } from './HandleWidget';

export function liveViewPlugin() { // Establishes the view plugin that handles widgets
    class HandleViewPlugin { // View Plugin Class
        view: EditorView;
        side: -1; // Determines the side of the anchor the widget appears on, ordered by number, negative is left
        //block: true; // Defines the widget as block rather than in-line
        decorations: DecorationSet; // Stores active decorations 

        constructor(view: EditorView) { // Called when the class is called
            this.view = view; // Set the view of the class equal to the constructed parameter
            this.build(view); // Build decorations to the view when the plugin is initialized
        }

        update(update: ViewUpdate) { // Called when the view updates
            this.view = update.view; // Updates the view
            if (update.docChanged || update.viewportChanged) { // Check for a change in the document or the viewport
                this.build(update.view) // Rebuild
            }
        }

        destroy(): void {
            return void 0;
        }

        build(view: EditorView) { // Creates the decorations
            try {
                const builder = new RangeSetBuilder<Decoration>();
                
                const createHandleDecoration = (from: number, to: number) => {
                    const el = document.createSpan('drag-handle');
                    
                    const deco = Decoration.widget({ // Define the decoration widget
                        widget: new HandleWidget(el, view), // Define the widget passing the element and view
                        block: true,
                        from,
                        to
                    });


                }
            }
        }
    }

    return ViewPlugin.fromClass(HandleViewPlugin, { // NEEDS CHANGES, STRAIGHT COPIED
        decorations: v => {
            return v.decorations.update({
                filter: (from, to) =>
                    from == to || !v.view.state.selection.ranges.filter(r => (r.from < from ? r.to > from : r.from < to)).length
            });
        }
    })
}