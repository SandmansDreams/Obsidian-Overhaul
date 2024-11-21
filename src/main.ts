/* Where all the magic happens, establishment of the plugin class */

import { Plugin, Editor, MarkdownView, setIcon, addIcon, Menu, MarkdownPostProcessorContext, FileView } from 'obsidian';
import { gutter, GutterMarker, ViewPlugin, ViewUpdate, WidgetType, Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { StateField, StateEffect, RangeSet, RangeSetBuilder, EditorState, Facet, Extension } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { emojiListPlugin } from './HandleViewPlugin';

export default class Blocks extends Plugin { // The main plugin class
    async onload() { // Things that happen on plugin load
        console.log('Blocks Plugin Loaded') //REMOVE
        this.initializeHandles();
    }

    async onunload() { // Things that will be unloaded when the plugin is disabled
        console.log('Blocks Plugin Unloaded') //REMOVE
    }

    initializeHandles() { // Initializes the view plugin and handle widgets
        console.log('initializeHandles called');
        this.registerEditorExtension([emojiListPlugin]); // Registers the view plugin as an editor extension
    }
}