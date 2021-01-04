import Stats from 'three/examples/jsm/libs/stats.module.js';

export default class StatsManager {
    constructor(container) {
        this.data = data.statsman;
        this.stats = new Stats();
        this.stats.domElement.style.cssText = 'position:relative; top:-100px; left:50px; width:100px';
        if (this.data.enabled)
            container.appendChild(this.stats.dom);
    }
    update() {
        this.stats.update();
    }
}