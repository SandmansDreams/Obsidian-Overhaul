/* Establishement of the main plugin class and loading of features */

// External Imports
import { Plugin, Editor, MarkdownView, setIcon, addIcon, Menu, MarkdownPostProcessorContext, FileView, Notice } from 'obsidian';
import { gutter, GutterMarker, ViewPlugin, ViewUpdate, WidgetType, Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { StateField, StateEffect, RangeSet, RangeSetBuilder, EditorState, Facet, Extension, Line } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';

// Internal Imports
import { Settings } from "./services/Settings";
import { Feature } from "./features/Feature";
import { DragHandle } from "./features/DragHandle";
import { LineStripes } from "./features/ZebraStripes";
import { HoverBanding } from "./features/HoverBanding";

declare global {
    const PLUGIN_VERSION: string;
    const CHANGELOG_MD: string;
}

export default class NotionizePlugin extends Plugin { // The main plugin class
    private features: Feature[]; // Establishes an array of features so they can be loaded all in one go
    protected settings: Settings;

    async onload() { // What happens when plugin is loaded
        await this.prepSettings();
        
        //const view = this.app.workspace.getActiveViewOfType(MarkdownView) as MarkdownView;
        
        this.features = [ // Contains all the features that need to be loaded
            new DragHandle(
                this,
                this.app.workspace.getActiveViewOfType(MarkdownView) as MarkdownView, // Does not work, disable later
            ),
            
            new LineStripes(
                this,
            ),

            new HoverBanding(
                this.settings,
            )
        ];

        for (const feature of this.features) { // Load all features individually
            await feature.load();
        }
    }

    async onunload() { // What happens when plugin is unloaded
        for (const feature of this.features) { // Unload all features individually
            await feature.unload();
        }
    }
    
    async loadEditorExtensions(extensions: Extension[]) { // Go through the list of extensions and load them individually
        extensions.forEach(extension => {
            this.registerEditorExtension(extension); // Can't use await on this, may need to 
        });
    }

    async loadFeatures() { // Go through the list of features and load them individually
        for (const feature of this.features) {
            await feature.load();
        }
    }

    protected async prepSettings() {
        this.settings = new Settings(this);
        await this.settings.load();
    }
} 
