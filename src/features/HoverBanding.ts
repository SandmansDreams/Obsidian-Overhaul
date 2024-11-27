import { Feature } from "./Feature";
import { Settings } from "../services/Settings";

const HOVER_BANDING_CLASS = '.cm-line:hover';

export class HoverBanding implements Feature {
    private updateInterval: number;
    
    constructor (
        private settings: Settings,
    ) { }

    async load() {
        this.applyHoverClass();

        this.updateInterval = window.setInterval(() => { // Sets the update interval to check for changes to the body class
            this.applyHoverClass();
        }, 1000);
    }

    async unload() {
        clearInterval(this.updateInterval);
        this.removeHoverClass();
    }

    applyHoverClass() {
        const isEnabled = this.settings.hoverBand;
        const isApplied = document.body.classList.contains(HOVER_BANDING_CLASS)

        if (isEnabled && !isApplied) {
            document.body.classList.add(HOVER_BANDING_CLASS);
        }

        if (!isEnabled && isApplied) {
            this.removeHoverClass();
        }
    }

    removeHoverClass() {
        document.body.classList.remove(HOVER_BANDING_CLASS);
    }
}