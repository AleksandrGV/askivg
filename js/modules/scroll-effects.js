import { ScrollEffects, ResizeHandler } from './utils.js';
import { Animations } from './animations.js';

export class ScrollManager {
    constructor(sliders) {
        this.sliders = sliders;
    }

    init() {
        ScrollEffects.init();
        ResizeHandler.init(() => this.handleResize());
    }

    handleResize() {
        Animations.refreshAOS();
        if (this.sliders) {
            this.sliders.update();
        }
    }
}