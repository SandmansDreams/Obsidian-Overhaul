import { Plugin } from 'obsidian';
import Settings from './services/Settings.js';
import SettingsTab from './features/SettingsTab.js';
import ZebraStripes from './features/ZebraStripes.js';
import HoverBanding from './features/HoverBanding.js';
// import DragHandle from './features/DragHandle.js';

export default class OverhaulPlugin extends Plugin {
  async onload() {
    this.settings = new Settings(this);
    await this.settings.load();

    this.features = [
      new SettingsTab(this, this.settings),
      new ZebraStripes(this.settings),
      new HoverBanding(this.settings),
      // new DragHandle(this),
    ];

    for (const feature of this.features) {
      if (feature.load) await feature.load();
    }
  }

  async onunload() {
    if (this.features) {
      for (const feature of this.features) {
        if (feature.unload) await feature.unload();
      }
    }
  }
}
