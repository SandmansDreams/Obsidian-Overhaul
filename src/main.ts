/* Where all the magic happens, establishment of the plugin class */

import { Plugin, Editor, MarkdownView, setIcon, addIcon, Menu, MarkdownPostProcessorContext, FileView } from 'obsidian';
import { gutter, GutterMarker, ViewPlugin, ViewUpdate, WidgetType, Decoration, DecorationSet, EditorView } from '@codemirror/view';
import { StateField, StateEffect, RangeSet, RangeSetBuilder, EditorState, Facet, Extension } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { toUnicode } from 'punycode';
import { HandleWidget } from './HandleWidget';
import { liveViewPlugin } from './LiveViewPlugin';




//export default class Blocks extends Plugin { // The main plugin class
    
		
		
		/*
		private dragHandle: HandleWidget;
		private changesBuffer = []; // Holds document changes to be dispatched to the state manager, format: [{ from: start, change }, { from: start, to: end, change }]
	
		async onload() { // Things that happen on plugin load
        console.log('Blocks Plugin Loaded') //REMOVE
				addIcon('handle', svgContent: string): void;
				this.initializeHandles();

        //this.registerDomEvent(document, 'mouseenter', (event : MouseEvent) => this.getSelection(event), true); // On hover, run the function
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
    
    initializeHandles() {
		    
	  }
  
    getSelection(event: MouseEvent, view: EditorView) { // FOR NOW: just gets the line that the mouse is on and calls renderHandle
        const target = event.target;
        
        if (this.isEditor()) {
            const pos = view.coordsAtPos(target);
            const lineNumber = pos.line + 1; // CodeMirror lines are zero-indexed
            
            //const line = view?.editor.state.doc.lineAt(event.from).number; // Theoretically gets the line at the mouse position
            //this.renderHandle(event, line);
        }
    }
    
    changeType(event: MouseEvent) { // FOR NOW: just gets the line that the mouse is on and calls renderHandle
        
    }
    
    renderHandle(event: MouseEvent, line: number) { // On line enter, render the handle
        if (this.dragHandle) { // Remove the prior drag handle if it exists
            this.dragHandle.destroy(this.dragHandle);
        }
        
        this.dragHandle = new DragHandle();
    }
    
    handleHandler(event: DragEvent) { // FOR NOW: just gets the line that the mouse is on and calls renderHandle
        
    }
    */
    /*decorateLines(view: MarkdownView) { // Decorates the lines selected with a highlight
        const highlight = Decoration.line({ // NOT 100% SURE WHAT ANY OF THIS DOES...
            attributes: {class: "handle-highlight"} // highlight needs to be a CSS class, I want to use the default for Obsidian but can't find it
        });
        
        let builder = new RangeSetBuilder<Decoration>();
        
        for (let {from, to} of view.visibleRanges) {
            for (let pos = from; pos <= to;) {
                builder.add(line.to, line.from, highlight);
            }
            }
            return builder.finish()	
        }  
    
		dispatchChanges(view: MarkdownView, rangeStart, rangeEnd) { // Dispatch the state change for undoing actions
        view.dispatch({changes: changesBuffer});
        changesBuffer = [];
        
        //POSSIBLE ALT: let state = EditorTransaction.changes?;
        let state = EditorState.create(view.document); // NOT SURE IF THIS IS HOW THIS WORKS...
        let transaction = state.update({changes: [{from: rangeStart, to: rangeEnd}]});
        view.dispatch(transaction);
        
    }*/
