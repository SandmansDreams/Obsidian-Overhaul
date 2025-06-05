const DEFAULTS = {
  dragHandles: false,
  hoverBand: false,
  zebraStripes: false,
  debug: false,
};

export default class Settings {
  constructor(storage) {
    this.storage = storage;
    this.values = { ...DEFAULTS };
    this.callbacks = new Set();
  }

  get dragHandles() { return this.values.dragHandles; }
  set dragHandles(v) { this.set('dragHandles', v); }

  get hoverBand() { return this.values.hoverBand; }
  set hoverBand(v) { this.set('hoverBand', v); }

  get zebraStripes() { return this.values.zebraStripes; }
  set zebraStripes(v) { this.set('zebraStripes', v); }

  get debug() { return this.values.debug; }
  set debug(v) { this.set('debug', v); }

  onChange(cb) { this.callbacks.add(cb); }
  removeCallback(cb) { this.callbacks.delete(cb); }

  async load() {
    Object.assign(this.values, DEFAULTS, await this.storage.loadData());
  }

  async save() {
    await this.storage.saveData(this.values);
  }

  set(key, value) {
    this.values[key] = value;
    for (const cb of this.callbacks) cb();
  }
}
