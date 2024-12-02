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
import { HoverBanding } from "./features/HoverBanding";
import { SettingsTab } from './features/SettingsTab';
import { ZebraStripes } from './features/ZebraStripes';

declare global {
    const PLUGIN_VERSION: string;
    const CHANGELOG_MD: string;
}

export default class NotionizePlugin extends Plugin { // The main plugin class
    private features: Feature[] = []; // Establishes an array of features so they can be loaded all in one go
    protected settings: Settings;

    async onload() { // What happens when plugin is loaded   
        await this.prepSettings();

        this.features = [ // Contains all the features that need to be loaded
            new SettingsTab( this, this.settings, ),
            //new DragHandle( this ),
            new ZebraStripes( this.settings, ),
            new HoverBanding( this.settings, ),
        ];

        this.loadFeatures();
    }

    async onunload() { // What happens when plugin is unloaded
        this.unloadFeatures();
    }

    async loadFeatures() { // Go through the list of features and load them individually
        for (const feature of this.features) {
            await feature.load();
        }
    }

    async unloadFeatures() { // Go through the list of features and unload them individually
        for (const feature of this.features) {
            await feature.unload();
        }
    }

    protected async prepSettings() {
        this.settings = new Settings(this);
        await this.settings.load();
    }
} 