/* NOTE: MOSTLY OUTLINER CODE */

interface SettingsObject { // Establishes a set of settings and their values
    enableHoverBand: boolean,
    dnd: boolean,
    debug: boolean,
}

const DEFAULT_SETTINGS: SettingsObject = { // Sets the default setting values
  enableHoverBand: false,
  dnd: false,
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
  }

  get enableHoverBand() {
    return this.values.enableHoverBand;
  }

  set enableHoverBand(value: boolean) {
    this.set('enableHoverBand', value);
  }

  get dragAndDrop() {
    return this.values.dnd;
  }

  set dragAndDrop(value: boolean) {
    this.set("dnd", value);
  }

  get debug() {
    return this.values.debug;
  }

  set debug(value: boolean) {
    this.set("debug", value);
  }

  onChange(cb: Callback) {
    this.callbacks.add(cb);
  }

  removeCallback(cb: Callback): void {
    this.callbacks.delete(cb);
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

  private set<T extends keyof SettingsObject>(
    key: T,
    value: SettingsObject[T],
  ): void {
    this.values[key] = value;

    for (const cb of this.callbacks) {
      cb();
    }
  }
}