const CLASS = 'overhaul-zebra-stripes';

export default class ZebraStripes {
  constructor(settings) {
    this.settings = settings;
    this.update = this.update.bind(this);
  }

  async load() {
    this.settings.onChange(this.update);
    this.update();
  }

  async unload() {
    this.settings.removeCallback(this.update);
    document.body.classList.remove(CLASS);
  }

  update() {
    const enabled = this.settings.zebraStripes;
    const applied = document.body.classList.contains(CLASS);
    if (enabled && !applied) {
      document.body.classList.add(CLASS);
    } else if (!enabled && applied) {
      document.body.classList.remove(CLASS);
    }
  }
}
