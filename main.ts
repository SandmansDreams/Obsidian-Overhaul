/* TODO
[ ] Add the ability to assign a key command to the move line up command
[ ] Add undo steps to the move line up command
*/


import { Plugin, Editor, MarkdownView, setIcon, addIcon, Menu, EditorPosition } from 'obsidian';
import { gutter, GutterMarker, ViewPlugin, ViewUpdate, WidgetType, Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { StateField, StateEffect, RangeSet, RangeSetBuilder, EditorState, Facet, Extension } from "@codemirror/state";

export default class Blocks extends Plugin { // The main plugin class
    async onload() { // Things that happen on plugin load
        console.log('Blocks Plugin Loaded') //REMOVE

        this.addCommand({
            id: 'move-current-line-up',
            name: 'Move current line up',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const line: number = editor.getCursor().line; // Gets the current line number the cursor is on
                const aboveLine: number = line - 1; // Gets the above line's number
                const lineText: string = editor.getLine(line); // Gets the text on the line the cursor is on
                const aboveLineText: string = editor.getLine(aboveLine); // Gets the text on the above line
                const cursorPos: EditorPosition = editor.getCursor();
                cursorPos.line = cursorPos.line - 1;
                
                if(line && aboveLine) {
                    editor.setLine(line, aboveLineText); // Place the above line on the current line
                    editor.setLine(aboveLine, lineText); // Place the current line on the above line
                    editor.setCursor(cursorPos);
                } else {
                    return;
                }
            }
        })
    }

    async onunload() { // Things that will be unloaded when the plugin is disabled
        console.log('Blocks Plugin Unoaded') //REMOVE
    }
  
    isEditor() { // Check to see if we are in a markdown file editor
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        
        if (!view) { // If we are not in the markdown view, fail the check and stop the function
            console.log('Not in MarkdownView') //REMOVE
            return false;
        }
        console.log('In MarkdownView') //REMOVE
        return true;
    }   

    moveLineUp() {

    }
}