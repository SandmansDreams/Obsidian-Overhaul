/* The setting tab and menu establishment */

import { App, Plugin, PluginSettingTab, Setting, setIcon, Component, TextComponent, ButtonComponent, DropdownComponent, ColorComponent, SearchComponent, debounce, Vault } from "obsidian";

import { Feature, } from "./Feature";
import { Settings, SettingsObject } from "../settings/Settings";
import { validateHeaderName } from "http";

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

        this.initializeFeature({ // Hover Banding
            containerEl: containerEl,
            featureDisplayName: 'Hover banding',
            description: 'Add a highlight to the line the mouse is hovering over',
            childSettings: [
                { name: 'Color', description: 'The color of the hover band', type: 'colorPicker' },
                { name: 'Transition time', description: 'How long it takes the hover band to fade in / out (in seconds)', type: 'slider', limits: [0, 5, .1]},
            ]
        });

        this.initializeFeature({ // Zebra Stripes
            containerEl: containerEl,
            featureDisplayName: 'Zebra stripes',
            description: 'Add a color to every other line in the editor',
            childSettings: [
                { name: 'Color', description: 'The color of the stripes', type: 'colorPicker' },
            ]
        });

        this.initializeFeature({ // Drag Handle
            containerEl: containerEl,
            featureDisplayName: 'Drag handle',
            description: 'Add a drag handle to the hovered line, also has click functionality',
        });
    }

    private initializeFeature({ // Create a feature setting and its children in one go
        containerEl,
        featureDisplayName,
        description,
        childSettings = [],
    }: {
        containerEl: HTMLElement;
        featureDisplayName: string;
        description: string;
        childSettings?: Array<{ name: string; description: string; type: 'slider' | 'colorPicker' | 'textInput'; limits?: [number, number, number]; placeholder?: string }>;
    }) {
        const featureName = this.toCamelCase(featureDisplayName);
        const featureNameKey = featureName as keyof SettingsObject; 
        let [ mainEl, childEl, collapseIndicatorEl, featureSetting ] = this.createFeature(featureName, featureDisplayName, description, containerEl);
        
        // Type conversion because for some reason no matter what some elements return as an HTMLSpan despite typing pre and post type them
        mainEl = mainEl as HTMLElement;
        childEl = childEl as HTMLElement;
        collapseIndicatorEl = collapseIndicatorEl as HTMLElement;
        featureSetting = featureSetting as Setting;

        // The collapse indicator
        featureSetting.settingEl.prepend(collapseIndicatorEl);
        collapseIndicatorEl.addEventListener('click', () => { this.toggleCollapse(collapseIndicatorEl, childEl, !childEl.isShown()) });
        
        childSettings?.forEach(({ name, description, type, limits, placeholder }) => { // Handle child settings, done before the feature so the collapse toggle can work correctly
            const setting = this.createSetting(name, description, childEl);
            const nameCamelCase = this.toCamelCase(featureDisplayName + ' ' + name) as keyof SettingsObject; // Have to pass the display name or else toCamelCase() breaks
            
            if (type === 'slider') {
                this.addSliderSetting(setting, nameCamelCase, limits!);
            } else if (type === 'colorPicker') {
                this.addColorPickerSetting(setting, nameCamelCase);
            } else if (type === 'textInput') {
                this.addTextInputSetting(setting, nameCamelCase, placeholder);
            }
        });

        featureSetting.addToggle(async (toggle) => { // Add toggle and collapse functionality
            toggle
                .setValue(this.settings.getSetting(featureNameKey) as boolean)
                .onChange(async (value) => {
                    this.settings.setSetting(featureNameKey, value);
                    await this.settings.save();
                    this.handleFeatureToggle(collapseIndicatorEl, childEl, value);
                });
            this.handleFeatureToggle(collapseIndicatorEl, childEl, toggle.getValue());
        });
        
    }
    
    private toCamelCase(displayName: string): string { // Converts the feature display name into a camelCase feature name, do NOT pass an already cammelCase'd value it will break
        return displayName
            .split(' ')
            .map((word, index) => 
                index === 0 
                    ? word.toLowerCase() 
                    : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Upercase subsequent words (just in case)
            ).join('');
    }

    private createFeature (featureName: string, featureDisplayName: string, featureDescription: string, containerEl: HTMLElement,) { // Creates the feature div's and main feature Setting
        const [ mainEL, childEl, collapseIndicatorEl ] = this.createFeatureDivs(featureName, containerEl);
        const featureSetting: Setting = this.createSetting(featureDisplayName, featureDescription, mainEL);
        return [ mainEL, childEl, collapseIndicatorEl, featureSetting ];
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
    
    private createSetting (featureDisplayName: string, featureDescription: string, containerEl: HTMLElement): Setting { // Create a basic Setting
        return new Setting(containerEl)
            .setName(featureDisplayName)
            .setDesc(featureDescription);
    }

    private addResetButton(setting: Setting, featureNameKey: keyof SettingsObject) { // Adds a reset button to any setting
        setting.addExtraButton((button) => {
            button
                .setIcon('reset')
                .onClick(async () => {
                    this.settings.reset(featureNameKey);
                    await this.settings.save();
                });
        });
    }
    
    private handleFeatureToggle(collapseIndicator: HTMLElement, collapsibleElement: HTMLElement, value: boolean) { // Checks if there are child nodes in the childSettings[] and act accordingly
        if (collapsibleElement.hasChildNodes()){ // If there are child settings, run normally
            this.toggleCollapseIndicator(collapseIndicator, value);
            this.toggleCollapse(collapseIndicator, collapsibleElement, value);
        } else { // If there are not child settings, just disable them always
            this.toggleCollapseIndicator(collapseIndicator, false);
            this.toggleCollapse(collapseIndicator, collapsibleElement, false);
        }
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

    private addSliderSetting(setting: Setting, childNameKey: keyof SettingsObject, limits?: [number, number, number]) { // Create a slider setting
        setting.addSlider(async (slider) => {
            slider
                .setValue(this.settings.getSetting(childNameKey))
                .onChange(async (value) => {
                    this.settings.setSetting(childNameKey, value);
                    await this.settings.save();
                })
                .setDynamicTooltip(); // Makes a tooltip pop up that shows the value
            if (limits != null) {
                slider.setLimits(...limits);
            }
        })
        this.addResetButton(setting, childNameKey);
    }

    private addColorPickerSetting(setting: Setting, childNameKey: keyof SettingsObject) {  // Creates a color picker setting
        setting.addColorPicker(async (picker) => {
            picker
                .setValue(this.settings.getSetting(childNameKey) as string)
                .onChange(async (value) => {
                    this.settings.setSetting(childNameKey, value);
                    await this.settings.save();
                });
        })
        this.addResetButton(setting, childNameKey);
    }

    private addTextInputSetting(setting: Setting, childNameKey: keyof SettingsObject, placeholder?: string) { // Creates a text input setting
        setting.addText(async (textbox) => {
            textbox
                .setValue(this.settings.getSetting(childNameKey) as string)
                .onChange(async (value) => {
                    this.settings.setSetting(childNameKey, value);
                    await this.settings.save();
                });
            if (placeholder != undefined) {
                textbox.setPlaceholder(placeholder);
            }
        })
        this.addResetButton(setting, childNameKey);
    }

    private hexToRGBA(hex: string, alpha?: string) { // Taken and modified from StackOverflow https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        if (alpha) {
            return `${r}, ${g}, ${b}, ${alpha}`;
        } else {
            return `${r}, ${g}, ${b},`;
        }
    }
}