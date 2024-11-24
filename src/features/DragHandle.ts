/* The DragHandle controller feature */

import { Decoration, DecorationSet, EditorView, PluginSpec, PluginValue, ViewPlugin, ViewUpdate, WidgetType, BlockInfo, Rect } from '@codemirror/view';
import { RangeSet, RangeSetBuilder, StateEffect, StateField, Transaction, TransactionSpec, SelectionRange, EditorState } from '@codemirror/state';
import { Notice, Platform, Plugin, Editor, App, MarkdownView, WorkspaceLeaf } from "obsidian";
import { Feature } from "./Feature";
import { handleRender } from './DragHandleViewPlugin';
import { MakeDirectoryOptions } from 'fs';
import { eventNames } from 'process';

export class DragHandle implements Feature { // The main feature class
    private dropZone: HTMLDivElement;
    private dropZonePadding: HTMLDivElement;
    private validDrops: Element[];
    private originState: DragOriginState | null = null;
    //private state: DragPostState | null = null;
    
    constructor ( 
        private plugin: Plugin,
        //private view: EditorView,
    ) {};

    async load() { 
        this.plugin.registerEditorExtension(handleRender); 
        
        this.createDropZone();
        //this.getValidDrops();
        this.registerDOMEvents();
    }

    async unload() {
        this.removeDropZone();
        this.unregisterDOMEvents();
    }

    registerDOMEvents() {
        document.addEventListener('dragenter', (event: DragEvent) => {
            this.handleDragEnter(event);
        });

 /*        document.addEventListener('drop', (event: DragEvent) => {
            this.handleDrop(event);
        }); */
    }

    unregisterDOMEvents() {
        document.removeEventListener('dragenter', (event: DragEvent) => {
            this.handleDragEnter(event);
        });

/*         document.removeEventListener('drop', (event: DragEvent) => {
            this.handleDrop(event);
        }); */
    }

    createDropZone() { // Creates the drop zone visualizer for the drag handle
        // Creating a div to hold the drop zone and pad it without glitching
        this.dropZonePadding = document.createElement("div");
        this.dropZonePadding.classList.add("drop-zone-padding");

        // The visual part of the drop zone
        this.dropZone = this.dropZonePadding.appendChild(document.createElement("div"));
        this.dropZone.classList.add("drop-zone");
        this.dropZone.style.display = "none"; // Makes the zone invisible when loaded

        document.body.appendChild(this.dropZonePadding);
    }
    
    removeDropZone() { // Removes the drop zone from the document
        document.body.removeChild(this.dropZonePadding);
        // @ts-ignore
        this.dropZonePadding = null;
        // @ts-ignore
        this.dropZone = null;
    }

    private handleDragEnter = (event: DragEvent) => { 
        event.preventDefault();
        event.stopPropagation(); // May break it
    }

    private handleDrop = (event: DragEvent) => {
        event.preventDefault();
        //event.stopPropagation(); 

        let data = event.dataTransfer?.getData('text/plain');
        
    }
}

// Interfaces
interface DragOriginState { // The original editor and location of the line being dragged
    editor: Editor,
    //leaf: WorkspaceLeaf,
    line: number,
}

interface PotentialDropTarget {
    line: number;
    content: string;
}

// Functions
/* function isHandle(event: DragEvent) {
    let targetEl: HTMLElement = event.target as HTMLElement;

    while (targetEl) { // Waits so that the if statement can traverse up the element tree
        if (targetEl.classList.contains("drag-handle-indicator")) {
            return true;
        }
    }
  
    return false;
}

function getEditor(): Editor {
    return this.app.view.workspace.getActiveViewOfType(MarkdownView);
} */

/* function getLeaf(): WorkspaceLeaf {
    return this.app.view.WorkspaceLeaf.view.getLeaf();
} */

/* function getEditorViewFromElement(element: HTMLElement) { 
    while (element && !element.classList.contains("cm-editor")) {
        element = element.parentElement as HTMLElement;
    }
  
    if (!element) {
      return null;
    }
  
    return EditorView.findFromDOM(element);
} */