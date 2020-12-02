import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { controlman  as params } from './params';

export default class ControlManager {
    constructor(camera, domElement){
        // Orbit controls
        this.controls = new OrbitControls(camera, domElement);
        this.controls.target.set(params.target.x, params.target.y, params.target.z);
        this.controls.maxDistance = params.maxDistance;
        this.controls.minDistance = params.minDistance;
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
}