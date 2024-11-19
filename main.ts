/* TODO
[ ] Add the ability to assign a key command to the move line up command
[ ] Add undo steps to the move line up command
*/


import { Plugin, Editor, MarkdownView, setIcon, addIcon, Menu, EditorPosition } from 'obsidian';
import { gutter, GutterMarker, ViewPlugin, ViewUpdate, WidgetType, Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { StateField, StateEffect, RangeSet, RangeSetBuilder, EditorState, Facet, Extension, Transaction } from "@codemirror/state";

export default class Blocks extends Plugin { // The main plugin class
    private changeTable/*: ChangeSpec[]*/ = [];
    
    async onload() { // Things that happen on plugin load
        console.log('Blocks Plugin Loaded') //REMOVE

        this.addCommand({ // Adds a command to the command pallete
            id: 'move-current-line-up',
            name: 'Move current line up',
            hotkeys: [],
            editorCallback: (editor: Editor, view: MarkdownView) => { // Checks to see if there is an editor active before running the command
                this.shiftLine(true, editor, view);
            }
        });

        this.addCommand({ // Adds a command to the command pallete
            id: 'move-current-line-down',
            name: 'Move current line down',
            hotkeys: [],
            editorCallback: (editor: Editor, view: MarkdownView) => { // Checks to see if there is an editor active before running the command
                this.shiftLine(false, editor, view);
            }
        });
    }

    async onunload() { // Things that will be unloaded when the plugin is disabled
        console.log('Blocks Plugin Unoaded') //REMOVE
    }  

    dispatchChanges(editor: Editor) { // Dispatch changes to the state for undoability
        editor.transaction({
            changes: this.changeTable
        });
    }

    shiftLine(isUp: boolean, editor: Editor, view: MarkdownView) { // Shifts a line into a different position
        const cursorPos: EditorPosition = editor.getCursor(); // Gets the cursor position
        const line: number = cursorPos.line; // Gets the current line number the cursor is on
        const lineText: string = editor.getLine(line); // Gets the text on the line the cursor is on

        switch (true) {
            case isUp && line === 0: // Case 1: Trying to move the first line up when at line 0 - do nothing
                return;
            case !isUp && line === editor.lineCount() - 1: // Case 2: Trying to move the last line down when at the last line - do nothing
                return;
            case isUp: { // Case 3: Move the current line up
                const aboveLine: number = line - 1; // Gets the above line's number
                const aboveLineText: string = editor.getLine(aboveLine); // Gets the text on the above line
                cursorPos.line -= 1; // Updates the cursor position to be on the line the current line shifts to
    
                editor.setLine(line, aboveLineText); // Place the above line on the current line
                editor.setLine(aboveLine, lineText); // Place the current line on the above line
                editor.setCursor(cursorPos); // Sets the cursor at its new position on the above line
                break;
            }
            case !isUp: { // Case 4: Move the current line down
                const belowLine: number = line + 1; // Gets the below line's number
                const belowLineText: string = editor.getLine(belowLine); // Gets the text on the below line
                cursorPos.line += 1; // Updates the cursor position to be on the line the current line shifts to
    
                editor.setLine(line, belowLineText); // Place the below line on the current line
                editor.setLine(belowLine, lineText); // Place the current line on the below line
                editor.setCursor(cursorPos); // Sets the cursor at its new position on the below line
                break;
            }
            default: return; // Fallback case: do nothing
        }
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
}