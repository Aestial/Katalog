import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class ControlManager {
    constructor(camera, domElement){
        this.data = data.controlman;
        this.camera = camera;
        this.controls = new OrbitControls(camera, domElement);
        this.controls.target.set(this.data.target.x, this.data.target.y, this.data.target.z);
        this.controls.maxDistance = this.data.maxDistance;
        this.controls.minDistance = this.data.minDistance;
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
        this.controls.update();
    }
    setPosition(position) {        
        this.camera.position.copy(position);
        this.controls.update();
        // console.log(this.camera.position);
    }
    setTarget(target) {
        this.controls.target.copy(target);
        this.controls.update();
    }
}