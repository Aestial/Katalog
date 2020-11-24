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
        this.controls.update();
    }
}