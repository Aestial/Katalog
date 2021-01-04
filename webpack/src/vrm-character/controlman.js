import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class ControlManager {
    constructor(camera, domElement){
        this.data = data.controlman;
        this.camera = camera;
        this.controls = new OrbitControls(camera, domElement);
        this.controls.target.set(this.data.target.x, this.data.target.y, this.data.target.z);
        this.controls.maxDistance = this.data.maxDistance;
        this.controls.minDistance = this.data.minDistance;        
        this.controls.autoRotate = false;
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
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
        this.setAzimuthLimits(this.data.minAzimuthAngle, this.data.maxAzimuthAngle);
        this.setPolarLimits(this.data.minPolarAngle, this.data.maxPolarAngle);
        this.update();
    }
    setAzimuthLimits(min, max) {
        this.controls.minAzimuthAngle = min/180 * Math.PI;
        this.controls.maxAzimuthAngle = max/180 * Math.PI;
        this.update();
    }
    setPolarLimits(min, max) {
        this.controls.minPolarAngle = min/180 * Math.PI;
        this.controls.maxPolarAngle = max/180 * Math.PI;
        this.update();
    }
    setDistanceLimits(min, max) {
        this.controls.minDistance = min;
        this.controls.maxDistance = max;
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