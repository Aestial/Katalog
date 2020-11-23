import Stats from 'three/examples/jsm/libs/stats.module.js';

export default class StatsManager {
    constructor(container) {
        this.stats = new Stats();
        this.stats.domElement.style.cssText = 
            'position:relative; top:-56px; left:0px;';
        container.appendChild(this.stats.dom);
    }
    update() {
        this.stats.update();
    }
}