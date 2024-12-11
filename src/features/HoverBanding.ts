/* Changes the background of the line currently hovered over with the mouse */

import { Feature } from "./Feature";
import { Settings } from "../settings/Settings";

const HOVER_BANDING_CLASS = 'notionize-hover-banding';

export class HoverBanding implements Feature {
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

    private updateHoverClass = () => { // Update all parts of the hover banding settings
        const isEnabled = this.settings.getSetting('hoverBanding');
        const isApplied = document.body.classList.contains(HOVER_BANDING_CLASS);

        let newTime = this.settings.getSetting('hoverBandingTransitionTime') as string;
        const newColor = this.settings.getSetting('hoverBandingColor');
        
        document.body.style.setProperty('--notionize-hover-banding-transition-time', (newTime + 's') as string);
        console.log('banding transition ' + newTime + 's');
        document.body.style.setProperty('--notionize-hover-banding-color', newColor);
        console.log('banding color ' + newColor);

        if (isEnabled && !isApplied) {
            document.body.classList.add(HOVER_BANDING_CLASS);
        }

        if (!isEnabled && isApplied) {
            document.body.classList.remove(HOVER_BANDING_CLASS);
        }
    }
}