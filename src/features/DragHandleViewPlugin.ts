/* The DragHandle controller feature 

Cannot use a view plugin as it does not have access the the Editor and cannot make file changes even through widgets...
*/

// CodeMirror imports
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, } from '@codemirror/view';
import { Extension, RangeSetBuilder, } from '@codemirror/state';
import { Plugin, Editor, WorkspaceLeaf, MarkdownView } from "obsidian";
import { HandleWidget } from './DragHandleWidget';

// View plugin
class HandleViewPlugin { // View plugin class
    plugin: Plugin;
    public editor: MarkdownView;
    decorations: DecorationSet;

    constructor(view: EditorView) { // Called on plugin load
        this.editor = this.plugin.app.workspace.getActiveViewOfType(MarkdownView) as MarkdownView;
        console.log('Editor: ' + this.editor);
        this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) { // Called when the view changes
        if (update.docChanged || update.viewportChanged || update.focusChanged) {
        this.decorations = this.buildDecorations(update.view);
        }
    }

    destroy() {} // Used to get rid of view plugin effects

    buildDecorations(view: EditorView): DecorationSet { // Adds widgets to a render queue and then renders them to the document
        /* ToDo:
        - Handles only appear on every other line or any line with content (likely appearing where linebreaks are in the source)
          - Either make it so only lines with letters have handles or that all lines have handles reguardless
        - The handle widget does not care about the collapse widget at all
          - No idea how to make this happen, may have to access the syntaxTree and just place it beside them
          - The widgets have auto-ordering if you put them in the same place, only issue is I have no idea how the collapse indicators are rendered
        - There are still some rendeing issues
          - Need to do the selection code for chunks of content like callouts and codeblocks
          - Handles tab things in, indenting paragraphs (which I like but is not how collapse indicators work) 
          - Handles do not render after indents
          - Scale changes with the font size (in stuff like headings) but the div size does not
            - Fix by making the handle consistent size not font variable, may be fixed by making it an SVG icon
        - Want the content highlighted when the handle is hovered so you can visualize what you are about to move, could do this with clone
        */
       
        const builder = new RangeSetBuilder<Decoration>();

        for (let { from, to } of view.visibleRanges) {
            for (let pos = from; pos <= to; pos++ ) {
                let line = view.state.doc.lineAt(pos);
                builder.add(line.from, line.from, Decoration.widget({
                    widget: new HandleWidget(this.editor, line.number, this.plugin),
                    side: -1,
                    inlineOrder: true,
                }));
                pos = line.to + 1;
            }
        }

        return builder.finish();
    }
};

// Assigning the view plugin to a variable
export const handleRender: Extension = ViewPlugin.fromClass(
    HandleViewPlugin, 
    {decorations: (value: HandleViewPlugin) => value.decorations},
);