import * as exp from "constants";
import { Feature } from "./Feature";
import {  } from "@codemirror/language";
import { Extension, Facet, RangeSet, RangeSetBuilder } from "@codemirror/state";
import { Plugin } from "obsidian";
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, } from "@codemirror/view";

let baseTheme: any; // NOTE: Not sure what type theme is...
let stepSize: Facet<number, number>;
let stripe: Decoration;
let extensions: [];

// Feature Class
export class LineStripes implements Feature {
    
    constructor (
        private plugin: Plugin,
    ) { }

    async load() {
        stripe = Decoration.line({
            attributes: {class: 'line-stripes'}
        });

        this.defineTheme();
        this.defineFacet();

        //this.registerExtensions(extensions);
        this.plugin.registerEditorExtension(stripes());
    }

    async unload() {

    }

    defineTheme() { // Defines the theme colors for each theme type
        baseTheme = EditorView.baseTheme({
            "&light .cm-zebraStripe": {backgroundColor: "#d4fafa"},
            "&dark .cm-zebraStripe": {backgroundColor: "#1a2727"}
        })
    }

    defineFacet() { // Defines a facet with default value 2 to determine step size
        stepSize = Facet.define<number, number>({
            combine: values => values.length ? Math.min(...values) : 2
        })
    }

    registerExtensions(extensions: []) {
        extensions.forEach(element => {
            this.plugin.registerEditorExtension(element);
        });
    }
}

// View Plugin
const showStripes = ViewPlugin.fromClass(class {
    decorations: DecorationSet

    constructor(view: EditorView) {
        this.decorations = this.stripeDeco(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
            this.decorations = this.stripeDeco(update.view)
        }
    }

    stripeDeco(view: EditorView) {
        let step = view.state.facet(stepSize)
        let builder = new RangeSetBuilder<Decoration>()
        for (let {from, to} of view.visibleRanges) {
          for (let pos = from; pos <= to;) {
            let line = view.state.doc.lineAt(pos);
            if ((line.number % step) == 0) {
                builder.add(line.from, line.from, stripe);
            }
            pos = line.to + 1;
          }
        }
        return builder.finish();
    }
}, {
    decorations: v => v.decorations
})

// Export the extension as a plugin
function stripes(options: {step?: number} = {}): Extension { // Returns the extension to the plugin
    return [
        baseTheme,
        options.step == null ? [] : stepSize.of(options.step), // Defines the default step size if nothing is provided
        showStripes,
    ]
}
