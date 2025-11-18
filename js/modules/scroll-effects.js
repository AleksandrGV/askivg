const { ResizeHandler } = require('./utils.js');
const { Animations } = require('./animations.js');

class ScrollManager {
    constructor(sliders) {
        this.sliders = sliders;
    }

    init() {
        ResizeHandler.init(() => this.handleResize());
    }

    handleResize() {
        Animations.refreshAOS();
        if (this.sliders) {
            this.sliders.update();
        }
    }
}

module.exports = { ScrollManager };