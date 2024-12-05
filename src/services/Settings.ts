interface SettingsObject { // Establishes a set of settings and their possible values
  hoverBanding: boolean,
  hoverBandingOpacity: number,
  hoverBandingColor: string,
  zebraStripes: boolean,
  zebraStripesOpacity: number,
  zebraStripesColor: string,
  dragHandle: boolean,
}

const DEFAULT_SETTINGS: SettingsObject = { // Sets the default setting values
  hoverBanding: false,
  hoverBandingOpacity: 20,
  hoverBandingColor: 'var(--color-accent)',
  zebraStripesOpacity: 20,
  zebraStripesColor: 'var(--color-base-10)',
  zebraStripes: false,
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
  

  // Hover Band
  get hoverBanding() {
    return this.values.hoverBanding;
  }
  
  set hoverBanding(value: boolean) {
    this.set('hoverBanding', value);
  }

  get hoverBandingOpacity() {
    return this.values.hoverBandingOpacity;
  }
  
  set hoverBandingOpacity(value: number) {
    this.set('hoverBandingOpacity', value);
  }

  get hoverBandingColor() {
    return this.values.hoverBandingColor;
  }
  
  set hoverBandingColor(value: string) {
    this.set('hoverBandingColor', value);
  }
  

  // Zebra Stripes
  get zebraStripes() {
    return this.values.zebraStripes;
  }
  
  set zebraStripes(value: boolean) {
    this.set("zebraStripes", value);
  }

  get zebraStripesOpacity() {
    return this.values.zebraStripesOpacity;
  }
  
  set zebraStripesOpacity(value: number) {
    this.set('zebraStripesOpacity', value);
  }

  get zebraStripesColor() {
    return this.values.zebraStripesColor;
  }
  
  set zebraStripesColor(value: string) {
    this.set('zebraStripesColor', value);
  }
  
  
  // Drag Handles
  get dragHandle() {
    return this.values.dragHandle;
  }

  set dragHandle(value: boolean) {
    this.set("dragHandle", value);
  }
  
  // 
  onChange(callback: Callback) { // When the settings change, add the callback function to the set
    this.callbacks.add(callback);
  }

  removeCallback(callback: Callback): void { // Remove the callback from the set
    this.callbacks.delete(callback);
  }

  reset(key: string) { // Reset the setting back to its default
    if (key in DEFAULT_SETTINGS) {
      const defaultValue = DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS];
      this.set(key as keyof SettingsObject, defaultValue); // Reset to the default value
    }
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