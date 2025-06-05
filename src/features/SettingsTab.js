import { PluginSettingTab, Setting } from 'obsidian';

export default class SettingsTab {
  constructor(plugin, settings) {
    this.plugin = plugin;
    this.settings = settings;
  }

  async load() {
    this.plugin.addSettingTab(new Tab(this.plugin, this.plugin.app, this.settings));
  }

  async unload() {}
}

class Tab extends PluginSettingTab {
  constructor(plugin, app, settings) {
    super(app, plugin);
    this.settings = settings;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Drag Handles')
      .setDesc('Add drag handles to the editor.')
      .addToggle(toggle => {
        toggle.setValue(this.settings.dragHandles).onChange(async value => {
          this.settings.dragHandles = value;
          await this.settings.save();
        });
      });

    new Setting(containerEl)
      .setName('Hover Band')
      .setDesc('Highlight line under the cursor.')
      .addToggle(toggle => {
        toggle.setValue(this.settings.hoverBand).onChange(async value => {
          this.settings.hoverBand = value;
          await this.settings.save();
        });
      });

    new Setting(containerEl)
      .setName('Zebra Stripes')
      .setDesc('Tint every other line in the editor.')
      .addToggle(toggle => {
        toggle.setValue(this.settings.zebraStripes).onChange(async value => {
          this.settings.zebraStripes = value;
          await this.settings.save();
        });
      });

    new Setting(containerEl)
      .setName('Debug')
      .setDesc('Enable debug logs.')
      .addToggle(toggle => {
        toggle.setValue(this.settings.debug).onChange(async value => {
          this.settings.debug = value;
          await this.settings.save();
        });
      });
  }
}
