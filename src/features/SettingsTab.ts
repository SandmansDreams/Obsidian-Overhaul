/* The setting tab and menu establishment */

import { App, Plugin, PluginSettingTab, Setting, setIcon, Component, TextComponent, ButtonComponent, DropdownComponent, ColorComponent, SearchComponent, debounce, Vault } from "obsidian";

import { Feature, } from "./Feature";
import { Settings, } from "../services/Settings";
import { removeAllListeners } from "process";

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

        // General


        
        // Features
        containerEl.createEl('h2', { text: "Features:"});
        
        // Hover Banding
        let [ // Create all the divs and the feature setting in one go
            hoverBandingMainEl, 
            hoverBandingChildrenEl, 
            hoverBandingCollapseIndicatorEl, 
            hoverBandingFeatureSetting
        ] = this.createFeature(
            'hoverBanding',
            'Hover banding',
            'Add a highlight to the line the mouse is hovering over',
            containerEl
        );

        // Conversion because for some reason no matter what some elements return as an HTMLSpan despite typing pre and post return
        hoverBandingMainEl = hoverBandingMainEl as HTMLElement;
        hoverBandingChildrenEl = hoverBandingChildrenEl as HTMLElement;
        hoverBandingCollapseIndicatorEl = hoverBandingCollapseIndicatorEl as HTMLElement;
        hoverBandingFeatureSetting = hoverBandingFeatureSetting as Setting;

        // Create child settings and set up collapse indicator
        const hoverBandingOpacity = this.createSetting('Opacity', 'How opaque the hover band color is', hoverBandingChildrenEl);
        const hoverBandingColor = this.createSetting('Color', 'The color of the hover band', hoverBandingChildrenEl);
        hoverBandingFeatureSetting.settingEl.prepend(hoverBandingCollapseIndicatorEl);
        hoverBandingCollapseIndicatorEl.addEventListener('click', () => { 
            this.toggleCollapse(hoverBandingCollapseIndicatorEl, hoverBandingChildrenEl, !hoverBandingChildrenEl.isShown());
        });

        hoverBandingFeatureSetting.addToggle(async (toggle) => { // Add the toggle component to the setting
                toggle
                    .setValue(this.settings.hoverBanding) // Set the starting value
                    .onChange(async (value) => { // Set what happens when the setting changes
                        this.settings.hoverBanding = value;
                        await this.settings.save();
                        if (hoverBandingChildrenEl.hasChildNodes()) { // If there are children, toggle the indicator then toggle its state
                            this.toggleCollapseIndicator(hoverBandingCollapseIndicatorEl, value);
                            this.toggleCollapse(hoverBandingCollapseIndicatorEl, hoverBandingChildrenEl, value); 
                        }
                    })
                // Loads in with the correct state
                this.toggleCollapseIndicator(hoverBandingCollapseIndicatorEl, toggle.getValue());
                this.toggleCollapse(hoverBandingCollapseIndicatorEl, hoverBandingChildrenEl, toggle.getValue()); 
        })
        
        hoverBandingOpacity.addSlider(async (slider) => { // Hover band opacity slider
                slider
                    .setValue(this.settings.hoverBandingOpacity)
                    .setLimits(5, 100, 5)
                    .onChange(async (value) => {
                        this.settings.hoverBandingOpacity = value;
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
            
        hoverBandingColor.addColorPicker(async (picker) => { 
                picker
                    .setValue(this.settings.hoverBandingColor)
                    .onChange(async (value) => {
                        this.settings.hoverBandingColor = value;
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
        let [ // Create all the divs and the feature setting in one go
            zebraStripesMainEl, 
            zebraStripesChildrenEl, 
            zebraStripesCollapseIndicatorEl, 
            zebraStripesFeatureSetting
        ] = this.createFeature(
            'zebraStripes',
            'Zebra stripes',
            'Add a color to every other line in the editor',
            containerEl
        );

        // Conversion because for some reason no matter what some elements return as an HTMLSpan despite typing pre and post return
        zebraStripesMainEl = zebraStripesMainEl as HTMLElement;
        zebraStripesChildrenEl = zebraStripesChildrenEl as HTMLElement;
        zebraStripesCollapseIndicatorEl = zebraStripesCollapseIndicatorEl as HTMLElement;
        zebraStripesFeatureSetting = zebraStripesFeatureSetting as Setting;

        // Create child settings and set up collapse indicator
        const zebraStripesOpacity = this.createSetting('Opacity', 'How opaque the stripe color is', zebraStripesChildrenEl);
        const zebraStripesColor = this.createSetting('Color', 'The color of the stripe', zebraStripesChildrenEl);
        zebraStripesFeatureSetting.settingEl.prepend(zebraStripesCollapseIndicatorEl);
        zebraStripesCollapseIndicatorEl.addEventListener('click', () => { 
            this.toggleCollapse(zebraStripesCollapseIndicatorEl, zebraStripesChildrenEl, !zebraStripesChildrenEl.isShown());
        });

        zebraStripesFeatureSetting.addToggle(async (toggle) => { // Add the toggle component to the setting
                toggle
                    .setValue(this.settings.zebraStripes) // Set the starting value
                    .onChange(async (value) => { // Set what happens when the setting changes
                        this.settings.zebraStripes = value;
                        await this.settings.save();
                        if (zebraStripesChildrenEl.hasChildNodes()) { // If there are children, toggle the indicator then toggle its state
                            this.toggleCollapseIndicator(zebraStripesCollapseIndicatorEl, value);
                            this.toggleCollapse(zebraStripesCollapseIndicatorEl, zebraStripesChildrenEl, value); 
                        }
                    })
                // Loads in with the correct state
                this.toggleCollapseIndicator(zebraStripesCollapseIndicatorEl, toggle.getValue());
                this.toggleCollapse(zebraStripesCollapseIndicatorEl, zebraStripesChildrenEl, toggle.getValue()); 
        })
        
        zebraStripesOpacity.addSlider(async (slider) => { // Hover band opacity slider
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
            
        zebraStripesColor.addColorPicker(async (picker) => { 
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
        let [ // Create all the divs and the feature setting in one go
            dragHandleMainEl, 
            dragHandleChildrenEl, 
            dragHandleCollapseIndicatorEl, 
            dragHandleFeatureSetting
        ] = this.createFeature(
            'dragHandle',
            'Drag handle',
            'Add a drag handle to the hovered line, also has click functionality',
            containerEl
        );

        // Conversion because for some reason no matter what some elements return as an HTMLSpan despite typing pre and post return
        dragHandleMainEl = dragHandleMainEl as HTMLElement;
        dragHandleChildrenEl = dragHandleChildrenEl as HTMLElement;
        dragHandleCollapseIndicatorEl = dragHandleCollapseIndicatorEl as HTMLElement;
        dragHandleFeatureSetting = dragHandleFeatureSetting as Setting;

        // Set up collapse indicator
        dragHandleFeatureSetting.settingEl.prepend(dragHandleCollapseIndicatorEl);
        dragHandleCollapseIndicatorEl.addEventListener('click', () => { 
            this.toggleCollapse(dragHandleCollapseIndicatorEl, dragHandleChildrenEl, !dragHandleChildrenEl.isShown());
        });

        dragHandleFeatureSetting.addToggle(async (toggle) => { // Add the toggle component to the setting
                toggle
                    .setValue(this.settings.dragHandle) // Set the starting value
                    .onChange(async (value) => { // Set what happens when the setting changes
                        this.settings.dragHandle = value;
                        await this.settings.save();
                        if (dragHandleChildrenEl.hasChildNodes()) { // If there are children, toggle the indicator then toggle its state
                            this.toggleCollapseIndicator(dragHandleCollapseIndicatorEl, value);
                            this.toggleCollapse(dragHandleCollapseIndicatorEl, dragHandleChildrenEl, value); 
                        }
                    })
                // Loads in with the correct state
                this.toggleCollapseIndicator(dragHandleCollapseIndicatorEl, toggle.getValue());
                this.toggleCollapse(dragHandleCollapseIndicatorEl, dragHandleChildrenEl, toggle.getValue()); 
        })

    }

    private createFeature (featureName: string, featureNameProper: string, featureDescription: string, containerEl: HTMLElement,) { // Creates the feature div's and main feature Setting
        const [ mainEL, childEl, collapseIndicatorEl ] = this.createFeatureDivs(featureName, containerEl);
        const featureSetting: Setting = this.createSetting(featureNameProper, featureDescription, mainEL);
        return [ mainEL, childEl, collapseIndicatorEl, featureSetting as Setting ];
    }

    private createFeatureDivs (featureName: string, containerEl: HTMLElement) { // Create all the div's needed for the setting tab features
        // The container element for the entire feature 
        const featureEl = containerEl.createDiv();
        featureEl.addClass('notionize-feature-setting');
        featureEl.id = featureName + 'Container';

        // The container element for just the feature Setting
        const mainEl = featureEl.createDiv();
        mainEl.addClass('notionize-feature-main-el');
        mainEl.id = featureName + 'Main';

        // The container element for the child Settings
        const childEl = featureEl.createDiv();
        childEl.addClass('notionize-child-settings');
        childEl.id = featureName + 'Children';

        // The element of the collapse indicator
        const collapseIndicatorEl = containerEl.createSpan();
        collapseIndicatorEl.id = featureName + 'CollapseIndicator'
        setIcon(collapseIndicatorEl, 'right-triangle');
        collapseIndicatorEl.toggle(false);

        return [ mainEl, childEl, collapseIndicatorEl ];
    }

    private createSetting (featureNameProper: string, featureDescription: string, containerEl: HTMLElement): Setting { // Create a basic Setting
        const setting = new Setting(containerEl).setName(featureNameProper).setDesc(featureDescription);
        return setting;
    }

    private toggleCollapse(indicator: HTMLElement, collapsibleElement: HTMLElement, value?: boolean) { // Handles the collapsing or uncollapsing of the menu
        if (value === true) { // If true, uncollapse and reset
            indicator.style.transform = 'rotate(0deg)';
            collapsibleElement.toggle(true);
        } else if (value === false) { // If false, collapse and rotate
            indicator.style.transform = 'rotate(-90deg)';
            collapsibleElement.toggle(false);
        } else { // If value not provided, get the opposite value and recurr
            let newVal = !indicator.isShown();
            this.toggleCollapse(indicator, collapsibleElement, newVal);
        }
    }

    private toggleCollapseIndicator(indicator: HTMLElement, value?: boolean) { // Renders or deletes the collapse indicator based on the value of the toggle
        if (value === true) { // If true, make visible
            indicator.toggle(true);
        } else if (value === false) { // If false, make invisible
            indicator.toggle(false);
        } else { // If value not provided, toggle to the opposite value
            indicator.toggle(!indicator.isShown());
        }
    }
}