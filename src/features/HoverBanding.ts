import { Feature } from "./Feature";
import { Settings } from "../services/Settings";

const HOVER_BANDING_CLASS = 'notionize-hover-banding';

export class HoverBanding implements Feature {
    private isEnabled: boolean

    constructor (
        private settings: Settings,
    ) { }

    async load() {
        this.settings.onChange(this.updateHoverClass);
        this.updateHoverClass();
    }

    async unload() {
        this.settings.removeCallback(this.updateHoverClass);
        document.body.classList.remove(HOVER_BANDING_CLASS);
    }

    private updateHoverClass = () => {
        this.isEnabled = this.settings.hoverBand;
        const isApplied = document.body.classList.contains(HOVER_BANDING_CLASS)

        if (this.isEnabled && !isApplied) {
            document.body.classList.add(HOVER_BANDING_CLASS);
        }

        if (!this.isEnabled && isApplied) {
            document.body.classList.remove(HOVER_BANDING_CLASS);
        }
    }
}