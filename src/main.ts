/* Where all the magic happens, establishment of the plugin class */

import { Plugin, Editor, MarkdownView, setIcon, addIcon, Menu, MarkdownPostProcessorContext, FileView, Notice } from 'obsidian';
import { gutter, GutterMarker, ViewPlugin, ViewUpdate, WidgetType, Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { StateField, StateEffect, RangeSet, RangeSetBuilder, EditorState, Facet, Extension } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { handleRender } from './HandleViewPlugin';
import { HandleWidget } from './HandleWidget';

export default class Blocks extends Plugin { // The main plugin class
    async onload() { // Things that happen on plugin load
        const editor = this.app.workspace.getActiveViewOfType(MarkdownView);
        
        this.initializeHandles();
    }

    async onunload() { // Things that will be unloaded when the plugin is disabled

    }

    initializeHandles() {
        this.registerEditorExtension([handleRender]); // Registers the handle rendering view plugin as an editor extension so that it actually does something, this calles the constructor method
    }

    getEditor(): MarkdownView | null {
        return this.app.workspace.getActiveViewOfType(MarkdownView);
    }
    
    public handleDrag() {

    }

    public handleClick() {

    }
}