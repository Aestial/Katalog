import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class ControlManager {
    constructor(camera, domElement){
        // Orbit controls
        this.controls = new OrbitControls(camera, domElement);
        this.controls.target.set(0, 3, 0);
        this.controls.maxDistance = 25;
        this.controls.minDistance = 10;
        this.controls.update();
    }
}