/* 
Create a new way to establish settings
    Should pass in name, description, type (Category or Normal), and subtype
use display() to create all the setting elements
*/


import { App, Plugin, PluginSettingTab, Setting, Component, TextComponent, ButtonComponent, DropdownComponent, ColorComponent, SearchComponent, debounce, Vault } from "obsidian";

import { Feature, } from "./Feature";
import { Settings, } from "../services/Settings";
import { FeatureSetting } from "src/services/FeatureComponent";
import { isNativeError } from "util/types";

type Callback = () => void;

export class SettingsTab implements Feature {
    constructor(
        private plugin: Plugin,
        private settings: Settings,
    ) { }
    
    async load() {
        this.plugin.addSettingTab(new NotionizePluginSettingsTab(this.plugin, this.plugin.app, this.settings));
    }
    
    async unload() { } // Empty as this will never be unloaded unless the plugin itself is unloaded
}

class NotionizePluginSettingsTab extends PluginSettingTab { // Handles the settings tab
    constructor(
        plugin: Plugin,
        app: App,
        private settings: Settings,
    ) {
        super(app, plugin);
    }

    display(): void { // Method for displaying the settings to the setting tab
        // Main
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h1', { text: "Notionize Settings"});
        
        // Features
        containerEl.createEl('h2', { text: "Features:"});

        // Hover Banding
        const hoverFeatureEl = containerEl.createDiv();
        hoverFeatureEl.addClass('notionize-feature-setting');
        const hoverMainEl = hoverFeatureEl.createDiv();
        hoverMainEl.addClass('notionize-feature-main-el');
        const hoverChildEl = hoverFeatureEl.createDiv();
        hoverChildEl.addClass('notionize-child-settings');

        const hoverBandingFeature = new Setting(hoverMainEl)
            .setName('Hover Banding')
            .setDesc('Add a highlight to the line the mouse is hovering over.')
            .addToggle(async (toggle) => { 
                toggle
                    .setValue(this.settings.hoverBand)
                    .onChange(async (value) => {
                        this.settings.hoverBand = value;
                        await this.settings.save();
                        this.toggleChildren(hoverChildEl, value);
                    })
                    this.toggleChildren(hoverChildEl, toggle.getValue());
            })

        const hoverBandingOpacity = new Setting(hoverChildEl)
            .setName('Opacity')
            .setDesc('How opaque the hover band color is.')
            .addSlider(async (slider) => { 
                slider
                .setValue(this.settings.hoverBandOpacity)
                .setLimits(5, 100, 5)
                .onChange(async (value) => {
                    this.settings.hoverBandOpacity = value;
                    await this.settings.save();
                })
                .setDynamicTooltip();
            })
            .addExtraButton((button) => {
                button
                    .setIcon('reset')
                    .onClick(async () => {
                        this.settings.reset('hoverBandingOpacity');
                        await this.settings.save();
                    })
            })
            
        const hoverBandingColor = new Setting(hoverChildEl)
            .setName('Color')
            .setDesc('The color of the hover band.')
            .addColorPicker(async (picker) => { 
                picker
                .setValue(this.settings.hoverBandColor)
                .onChange(async (value) => {
                    this.settings.hoverBandColor = value;
                    await this.settings.save();
                })
            })
            .addExtraButton((button) => {
                button
                    .setIcon('reset')
                    .onClick(async () => {
                        this.settings.reset('hoverBandingColor');
                        await this.settings.save();
                    })
            })
            
        // Zebra Stripes
        const zebraFeatureEl = containerEl.createDiv();
        zebraFeatureEl.addClass('notionize-feature-setting');
        const zebraMainEl = zebraFeatureEl.createDiv();
        zebraMainEl.addClass('notionize-feature-main-el');
        const zebraChildEl = zebraFeatureEl.createDiv();
        zebraChildEl.addClass('notionize-child-settings');

        const zebraStripesFeature = new Setting(zebraMainEl)
            .setName('Zebra Stripes')
            .setDesc('Adds a slight tint to every other line in the editor.')
            .addToggle(async (toggle) => { 
                toggle
                    .setValue(this.settings.zebraStripes)
                    .onChange(async (value) => {
                        this.settings.zebraStripes = value;
                        await this.settings.save();
                        this.toggleChildren(zebraChildEl, value);
                    })
                    this.toggleChildren(zebraChildEl, toggle.getValue());
            })

        const zebraStripesOpacity = new Setting(zebraChildEl)
            .setName('Opacity')
            .setDesc('How opaque the zebra stripe color is.')
            .addSlider(async (slider) => { 
                slider
                .setValue(this.settings.zebraStripesOpacity)
                .setLimits(5, 100, 5)
                .onChange(async (value) => {
                    this.settings.zebraStripesOpacity = value;
                    await this.settings.save();
                })
                .setDynamicTooltip();
            })
            .addExtraButton((button) => {
                button
                    .setIcon('reset')
                    .onClick(async () => {
                        this.settings.reset('zebraStripesOpacity');
                        await this.settings.save();
                    })
            })

        const zebraStripesColor = new Setting(zebraChildEl)
            .setName('Color')
            .setDesc('The color of the zebra stripes.')
            .addColorPicker(async (picker) => { 
                picker
                .setValue(this.settings.zebraStripesColor)
                .onChange(async (value) => {
                    this.settings.zebraStripesColor = value;
                    await this.settings.save();
                })
            })
            .addExtraButton((button) => {
                button
                    .setIcon('reset')
                    .onClick(async () => {
                        this.settings.reset('zebraStripesColor');
                        await this.settings.save();
                    })
            })

        // Drag Handles


        // Other
        containerEl.createEl('h2', { text: "Other:"});
    }

    toggleChildren(element: HTMLElement, value: boolean) {
        element.toggle(value);
    }
}