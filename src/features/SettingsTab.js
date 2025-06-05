import { PluginSettingTab, Setting, setIcon } from 'obsidian';

export default class SettingsTab {
  constructor(plugin, settings) {
    this.plugin = plugin;
    this.settings = settings;
  }

  async load() {
    this.plugin.addSettingTab(new CustomSettingsTab(this.plugin.app, this.plugin, this.settings));
  }

  async unload() {}
}

class CustomSettingsTab extends PluginSettingTab {
  constructor(app, plugin, settings) {
    super(app, plugin);
    this.settings = settings;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Features:' });

    this.initializeFeature({
      containerEl,
      featureDisplayName: 'Hover banding',
      description: 'Add a highlight to the line the mouse is hovering over',
      childSettings: [
        { name: 'Color', description: 'The color of the hover band', type: 'colorPicker' },
        { name: 'Transition time', description: 'How long it takes the hover band to fade in / out (in seconds)', type: 'slider', limits: [0, 5, 0.1] },
      ],
    });

    this.initializeFeature({
      containerEl,
      featureDisplayName: 'Zebra stripes',
      description: 'Add a color to every other line in the editor',
      childSettings: [
        { name: 'Color', description: 'The color of the stripes', type: 'colorPicker' },
      ],
    });

    this.initializeFeature({
      containerEl,
      featureDisplayName: 'Drag handle',
      description: 'Add a drag handle to the hovered line, also has click functionality',
    });
  }

  initializeFeature({ containerEl, featureDisplayName, description, childSettings = [] }) {
    const featureName = this.toCamelCase(featureDisplayName);
    const featureKey = featureName;
    let [mainEl, childEl, collapseIndicatorEl, featureSetting] = this.createFeature(featureName, featureDisplayName, description, containerEl);

    featureSetting.settingEl.prepend(collapseIndicatorEl);
    collapseIndicatorEl.addEventListener('click', () => {
      this.toggleCollapse(collapseIndicatorEl, childEl, !childEl.isShown());
    });

    childSettings.forEach(({ name, description, type, limits, placeholder }) => {
      const setting = this.createSetting(name, description, childEl);
      const nameCamelCase = this.toCamelCase(featureDisplayName + ' ' + name);

      if (type === 'slider') {
        this.addSliderSetting(setting, nameCamelCase, limits);
      } else if (type === 'colorPicker') {
        this.addColorPickerSetting(setting, nameCamelCase);
      } else if (type === 'textInput') {
        this.addTextInputSetting(setting, nameCamelCase, placeholder);
      }
    });

    featureSetting.addToggle((toggle) => {
      toggle
        .setValue(this.settings.getSetting(featureKey))
        .onChange(async (value) => {
          this.settings.setSetting(featureKey, value);
          await this.settings.save();
          this.handleFeatureToggle(collapseIndicatorEl, childEl, value);
        });
      this.handleFeatureToggle(collapseIndicatorEl, childEl, toggle.getValue());
    });
  }

  toCamelCase(displayName) {
    return displayName
      .split(' ')
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');
  }

  createFeature(featureName, featureDisplayName, featureDescription, containerEl) {
    const [mainEl, childEl, collapseIndicatorEl] = this.createFeatureDivs(featureName, containerEl);
    const featureSetting = this.createSetting(featureDisplayName, featureDescription, mainEl);
    return [mainEl, childEl, collapseIndicatorEl, featureSetting];
  }

  createFeatureDivs(featureName, containerEl) {
    const featureEl = containerEl.createDiv();
    featureEl.addClass('notionize-feature-setting');
    featureEl.id = featureName + 'Container';

    const mainEl = featureEl.createDiv();
    mainEl.addClass('notionize-feature-main-el');
    mainEl.id = featureName + 'Main';

    const childEl = featureEl.createDiv();
    childEl.addClass('notionize-child-settings');
    childEl.id = featureName + 'Children';

    const collapseIndicatorEl = containerEl.createSpan();
    collapseIndicatorEl.id = featureName + 'CollapseIndicator';
    setIcon(collapseIndicatorEl, 'right-triangle');
    collapseIndicatorEl.toggle(false);

    return [mainEl, childEl, collapseIndicatorEl];
  }

  createSetting(featureDisplayName, featureDescription, containerEl) {
    return new Setting(containerEl).setName(featureDisplayName).setDesc(featureDescription);
  }

  addResetButton(setting, key) {
    setting.addExtraButton((button) => {
      button.setIcon('reset').onClick(async () => {
        this.settings.reset(key);
        await this.settings.save();
      });
    });
  }

  handleFeatureToggle(collapseIndicator, collapsibleElement, value) {
    if (collapsibleElement.hasChildNodes()) {
      this.toggleCollapseIndicator(collapseIndicator, value);
      this.toggleCollapse(collapseIndicator, collapsibleElement, value);
    } else {
      this.toggleCollapseIndicator(collapseIndicator, false);
      this.toggleCollapse(collapseIndicator, collapsibleElement, false);
    }
  }

  toggleCollapse(indicator, collapsibleElement, value) {
    if (value === true) {
      indicator.style.transform = 'rotate(0deg)';
      collapsibleElement.toggle(true);
    } else if (value === false) {
      indicator.style.transform = 'rotate(-90deg)';
      collapsibleElement.toggle(false);
    } else {
      this.toggleCollapse(indicator, collapsibleElement, !indicator.isShown());
    }
  }

  toggleCollapseIndicator(indicator, value) {
    if (value === true) {
      indicator.toggle(true);
    } else if (value === false) {
      indicator.toggle(false);
    } else {
      indicator.toggle(!indicator.isShown());
    }
  }

  addSliderSetting(setting, key, limits) {
    setting.addSlider((slider) => {
      slider
        .setValue(this.settings.getSetting(key))
        .onChange(async (value) => {
          this.settings.setSetting(key, value);
          await this.settings.save();
        })
        .setDynamicTooltip();
      if (limits != null) {
        slider.setLimits(...limits);
      }
    });
    this.addResetButton(setting, key);
  }

  addColorPickerSetting(setting, key) {
    setting.addColorPicker((picker) => {
      picker
        .setValue(this.settings.getSetting(key))
        .onChange(async (value) => {
          this.settings.setSetting(key, value);
          await this.settings.save();
        });
    });
    this.addResetButton(setting, key);
  }

  addTextInputSetting(setting, key, placeholder) {
    setting.addText((textbox) => {
      textbox
        .setValue(this.settings.getSetting(key))
        .onChange(async (value) => {
          this.settings.setSetting(key, value);
          await this.settings.save();
        });
      if (placeholder !== undefined) {
        textbox.setPlaceholder(placeholder);
      }
    });
    this.addResetButton(setting, key);
  }

  hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return `${r}, ${g}, ${b}, ${alpha}`;
    }
    return `${r}, ${g}, ${b},`;
  }
}
