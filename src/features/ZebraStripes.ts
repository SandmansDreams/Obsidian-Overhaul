import { Plugin } from "obsidian";
import { Feature } from "./Feature";
import { Settings } from "../services/Settings";

const ZEBRA_STRIPES_CLASS = 'notionize-zebra-stripes';

// Feature Class
export class ZebraStripes implements Feature {
    private isEnabled: boolean
    private updateInterval: number
    
    constructor (
        private plugin: Plugin,
        private settings: Settings,
    ) {
        this.isEnabled = this.settings.zebraStripes;
    }

    async load() {
        this.updateStriping()
        this.updateInterval = window.setInterval(() => {
            this.updateStriping();
        }, 1000);
    }

    async unload() {
        clearInterval(this.updateInterval);
        document.body.classList.remove(ZEBRA_STRIPES_CLASS);
    }

    private updateStriping = () => {
        const exists = document.body.classList.contains(ZEBRA_STRIPES_CLASS);

        if (this.isEnabled && !exists) {
            document.body.classList.add(ZEBRA_STRIPES_CLASS);
        }

        if (!this.isEnabled && exists) {
            document.body.classList.remove(ZEBRA_STRIPES_CLASS);
        }
    }
}


/*
let baseTheme: any; // NOTE: Not sure what type theme is...
let stepSize: Facet<number, number>;
let stripe: Decoration;

// Feature Class
export class ZebraStripes implements Feature {
    constructor (
        private plugin: Plugin,
        private settings: Settings,
    ) { }

    async load() {
        this.setDecoration();
        this.defineTheme();
        this.defineFacet();

        this.plugin.registerEditorExtension(stripes(this.settings.zebraStripes, 2));
    }

    async unload() {

    }

    setDecoration() {
        stripe = Decoration.line({
            attributes: {class: 'notionize-zebra-stripe'}
        });
    }

    defineTheme() { // Defines the theme colors for each theme type
        let documentTree = this.plugin.app.workspace.containerEl.parentElement?.parentElement?.parentElement?.parentElement; // NOTE: Find a better way to do this check
        //console.log(documentTree);
        
        switch (documentTree?.classList.contains('theme-dark')) {
            case true:
                baseTheme = EditorView.baseTheme({ "&dark .notionize-zebra-stripe": {backgroundColor: "#1a2727"}});
                break;
            case false:
                baseTheme = EditorView.baseTheme({ "&light .notionize-zebra-stripe": {backgroundColor: "#d4fafa"}});
                break;
            default:
                baseTheme = EditorView.baseTheme({ "&dark .notionize-zebra-stripe": {backgroundColor: "#1a2727"}});
        }

    }

    defineFacet() { // Defines a facet with default value 2 to determine step size
        stepSize = Facet.define<number, number>({
            combine: values => values.length ? Math.min(...values) : 2
        })
    }
}

// View Plugin
const showStripes = (isEnabled: boolean) => ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = this.stripeDeco(view, isEnabled);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged) {
            this.decorations = this.stripeDeco(update.view, isEnabled)
        }
    }

    stripeDeco(view: EditorView, enabled: boolean) {
        if (!enabled) {
            return Decoration.none;
        }
        
        let step = view.state.facet(stepSize)
        let builder = new RangeSetBuilder<Decoration>()
        for (let {from, to} of view.visibleRanges) {
          for (let pos = from; pos < to;) {
            let line = view.state.doc.lineAt(pos);
            if ((line.number % step) === 0) {
                builder.add(line.from, line.from, stripe);
            }
            pos = line.to + 1;
          }
        }
        return builder.finish();
    }

    destroy() {}
}, {
    decorations: v => v.decorations
})

// Export the extension as a plugin
function stripes(isEnabled: boolean, step?: number): Extension { // Returns the extension to the plugin
    return [
        baseTheme,
        step == null ? [] : stepSize.of(step), // Defines the default step size if nothing is provided
        showStripes(isEnabled),
    ];
}
*/