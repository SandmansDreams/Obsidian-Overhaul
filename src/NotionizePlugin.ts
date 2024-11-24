/* Establishement of the main plugin class and loading of features */

import { Plugin, Editor, MarkdownView, setIcon, addIcon, Menu, MarkdownPostProcessorContext, FileView, Notice } from 'obsidian';
import { gutter, GutterMarker, ViewPlugin, ViewUpdate, WidgetType, Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { StateField, StateEffect, RangeSet, RangeSetBuilder, EditorState, Facet, Extension } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { Feature } from "./features/Feature";
import { DragHandle } from "./features/DragHandle";

export default class NotionizePlugin extends Plugin { // The main plugin class
    //private extensions: Extension[]; // Establishes an array of editor extensions so they can be loaded all in one go
    private features: Feature[]; // Establishes an array of features so they can be loaded all in one go

    async onload() { // What happens when plugin is loaded
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        
        /* this.extensions = [ // Contains all the extensions that need to be loaded
            new DragHandleViewPlugin(

            ),
        ]; */
        
        this.features = [ // Contains all the features that need to be loaded
            new DragHandle(
                this, // Pass this plugin to the feature
            ),
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

    async loadFeatures(features: Feature[]) { // Go through the list of features and load them individually
        for (const feature of this.features) {
            await feature.load();
        }
    }
}