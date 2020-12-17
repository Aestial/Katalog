import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class ControlManager {
    constructor(camera, domElement){
        this.data = data.controlman;
        this.camera = camera;
        this.controls = new OrbitControls(camera, domElement);
        this.controls.target.set(this.data.target.x, this.data.target.y, this.data.target.z);
        this.controls.maxDistance = this.data.maxDistance;
        this.controls.minDistance = this.data.minDistance;
        this.controls.autoRotate = true;
        this.controls.enableDamping = true;
        this.controls.keys = {            
            UP: 87, // W
            LEFT: 65, // A
            BOTTOM: 83, // S
            RIGHT: 68, // D
            // LEFT: 37, //left arrow
            // UP: 38, // up arrow
            // RIGHT: 39, // right arrow
            // BOTTOM: 40 // down arrow
        };
        this.update();
    }
    setLimits(min, max) {
        this.controls.minAzimuthAngle = min/180 * Math.PI;
        this.controls.maxAzimuthAngle = max/180 * Math.PI;
        this.update();
    }
    setPosition(position) {        
        this.camera.position.copy(position);
        this.update();
    }
    setTarget(target, autoRotate=false) {
        this.controls.target.copy(target);
        this.controls.autoRotate = autoRotate;
        this.controls.enableDamping = autoRotate;
        this.update();        
    }    
    update() {
        this.controls.update();
    }
}