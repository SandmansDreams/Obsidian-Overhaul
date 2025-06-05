const CLASS = 'overhaul-hover-banding';

export default class HoverBanding {
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
    const enabled = this.settings.hoverBand;
    const applied = document.body.classList.contains(CLASS);
    if (enabled && !applied) {
      document.body.classList.add(CLASS);
    } else if (!enabled && applied) {
      document.body.classList.remove(CLASS);
    }
  }
}
