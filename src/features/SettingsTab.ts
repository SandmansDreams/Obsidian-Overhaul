import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

import { Feature, } from "./Feature";
import { Settings, } from "../services/Settings";

export class SettingsTab implements Feature {
    constructor(
        private plugin: Plugin,
        private settings: Settings,
    ) { }
    
    async load() {
        this.plugin.addSettingTab(new NotionizePluginSettingsTab(this.plugin, this.plugin.app, this.settings));
    }
    
    async unload() { }
}

class NotionizePluginSettingsTab extends PluginSettingTab {
    constructor(
        plugin: Plugin,
        app: App,
        private settings: Settings,
    ) {
        super(app, plugin);
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName("Drag Handles")
            .setDesc("Add drag handles to the view to move lines and change types easily.")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.settings.dragHandles)
                    .onChange(async (value) => {
                        this.settings.dragHandles = value;
                        await this.settings.save();
                    });
            });

        new Setting(containerEl)
            .setName("Hover Band")
            .setDesc("Add a highlight to the line the mouse is hovering over.")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.settings.hoverBand)
                    .onChange(async (value) => {
                        this.settings.hoverBand = value;
                        await this.settings.save();
                    });
            });

        new Setting(containerEl)
            .setName("Zebra Stripes")
            .setDesc("Adds a slight tint to every other line in the editor.")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.settings.zebraStripes)
                    .onChange(async (value) => {
                        this.settings.zebraStripes = value;
                        await this.settings.save();
                    });
            });

        new Setting(containerEl)
            .setName("Debug")
            .setDesc("Enables console.log statements for debugging")
            .addToggle((toggle) => {
                toggle
                    .setValue(this.settings.debug)
                    .onChange(async (value) => {
                        this.settings.debug = value;
                        await this.settings.save();
                    });
            });
    }
}
