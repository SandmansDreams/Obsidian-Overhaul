interface SettingsObject { // Establishes a set of settings and their values
  dragHandles: boolean,
  hoverBand: boolean,
  zebraStripes: boolean,
  debug: boolean,
}

const DEFAULT_SETTINGS: SettingsObject = { // Sets the default setting values
  dragHandles: false,
  hoverBand: false,
  zebraStripes: false,
  debug: false,
};

export interface Storage {
  loadData(): Promise<SettingsObject>;
  saveData(settings: SettingsObject): Promise<void>;
}

type Callback = () => void;

export class Settings {
  private storage: Storage;
  private values: SettingsObject;
  private callbacks: Set<Callback>;

  constructor(storage: Storage) {
    this.storage = storage;
    this.callbacks = new Set();
  }
  
  get dragHandles() {
    return this.values.dragHandles;
  }

  set dragHandles(value: boolean) {
    this.set("dragHandles", value);
  }

  get hoverBand() {
    return this.values.hoverBand;
  }

  set hoverBand(value: boolean) {
    this.set('hoverBand', value);
  }

  get zebraStripes() {
    return this.values.zebraStripes;
  }

  set zebraStripes(value: boolean) {
    this.set("zebraStripes", value);
    console.log('Zebra Stripes toggled to ' + value);
  }

  get debug() {
    return this.values.debug;
  }

  set debug(value: boolean) {
    this.set("debug", value);
  }

  onChange(callback: Callback) { // When the settings change, add the callback function to the set
    this.callbacks.add(callback);
  }

  removeCallback(callback: Callback): void { // Remove the callback from the set
    this.callbacks.delete(callback);
  }

  reset() {
    for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
      this.set(k as keyof SettingsObject, v);
    }
  }

  async load() {
    this.values = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.storage.loadData(),
    );
  }

  async save() {
    await this.storage.saveData(this.values);
  }

  getValues(): SettingsObject {
    return { ...this.values };
  }

  private set<T extends keyof SettingsObject>( key: T, value: SettingsObject[T], ): void {
    this.values[key] = value; // Update the value in `this.values`
  
    for (const callback of this.callbacks) { // Notify all registered callbacks of the change
      callback(); // Call each callback function
    }
  }
}