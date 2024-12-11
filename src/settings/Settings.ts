export interface SettingsObject { // Establishes a set of settings and their possible values
  hoverBanding: boolean,
  hoverBandingOpacity: number,
  hoverBandingColor: string,
  hoverBandingTransitionTime: string,

  zebraStripes: boolean,
  zebraStripesOpacity: number,
  zebraStripesColor: string,

  dragHandle: boolean,
}

const DEFAULT_SETTINGS: SettingsObject = { // Sets the default setting values
  hoverBanding: false,
  hoverBandingOpacity: 20,
  hoverBandingColor: 'var(--notionize-hover-banding-color)',
  hoverBandingTransitionTime: '.2s',

  zebraStripes: false,
  zebraStripesOpacity: 20,
  zebraStripesColor: 'var(--notionize-zebra-stripes-color)',

  dragHandle: false,
};

export interface Storage { // Establishes a storage to save and load setting data
  loadData(): Promise<SettingsObject>;
  saveData(settings: SettingsObject): Promise<void>;
}

type Callback = () => void;

export class Settings { // The class that handles our settings
  private storage: Storage;
  private values: SettingsObject;
  private callbacks: Set<Callback>;

  constructor(storage: Storage) {
    this.storage = storage;
    this.callbacks = new Set();
  }
   
  getSetting(featureName: keyof SettingsObject) {
    return this.values[featureName] as any;
  }

  setSetting(featureName: keyof SettingsObject, value: any) {
    this.set(featureName, value);
  }

  onChange(callback: Callback) { // When the settings change, add the callback function to the set
    this.callbacks.add(callback);
  }

  removeCallback(callback: Callback): void { // Remove the callback from the set
    this.callbacks.delete(callback);
  }

  reset(key: string) { // Reset the setting back to its default
    console.log('reset pre: ' + key + ' ' + DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS])
    if (key in DEFAULT_SETTINGS) {
      const defaultValue = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
      this.set(key as keyof SettingsObject, defaultValue); // Reset to the default value
    }
    console.log('reset post: ' + key + ' ' + this.values[key as keyof SettingsObject])
  }

  async load() { // When loading, establish the default settings then apply any local changes
    this.values = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.storage.loadData(),
    );
  }

  async save() { // Save a setting value locally
    await this.storage.saveData(this.values);
  }

  getValues(): SettingsObject { // Get the values of all settings
    return { ...this.values };
  }

  private set<T extends keyof SettingsObject>( key: T, value: SettingsObject[T], ): void { // Iterate through the set of callbacks and call all of them to update the storage values
    this.values[key] = value;
    for (const cb of this.callbacks) {
      cb();
    }
  }
}