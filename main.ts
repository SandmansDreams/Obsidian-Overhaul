import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, View, } from 'obsidian';
import { StateEffect, EditorState, StateField, Transaction, } from '@codemirror/state'
import { EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view'

const docSizePlugin = ViewPlugin.fromClass(class {
	dom: HTMLElement;

	constructor(view: EditorView) {
		this.dom = view.dom.appendChild(document.createElement("div"))
		this.dom.style.cssText =
			"position: absolute; inset-block-start: 2px; inset-inline-end: 5px"
		this.dom.textContent = ('CH: ' + view.state.doc.length.toString());
	}
  
	update(update: ViewUpdate) {
	  	if (update.docChanged)
			this.dom.textContent = ('CH: ' + update.state.doc.length.toString());
	}
  
	destroy() { this.dom.remove() }
});

export default class Notionize extends Plugin {
	view = this.app.workspace.getActiveViewOfType(MarkdownView);
	
	async onload() {
		if (this.view) {
			const editorView = this.view.editor as Editor;
			//this.initialize(editorView);
		}
		
		this.registerEditorExtension(docSizePlugin);
	}

	onunload() {

	}

	initialize(editor: Editor) {
		
	}
}