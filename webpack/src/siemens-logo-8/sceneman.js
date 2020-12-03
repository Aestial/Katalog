import * as THREE from 'three';
import LightingManager from './lightman';

export default class SceneManager {
    constructor(renderer){
        this.data = data.sceneman;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.data.background);
        // this.scene.fog = new THREE.Fog(0x606060, 200, 10000);
        this.lighting = new LightingManager(this.scene, renderer);
        // this.addHelpers();
    }
    add(object) {
        this.scene.add(object);
    }
    addHelpers() {
        this.addAxes();
        this.addGrid();
        this.addGround();
    }
    addAxes() {
        const axesHelper = new THREE.AxesHelper(100);
        this.scene.add(axesHelper);
    }
    addGrid() {
        const grid = new THREE.GridHelper(10000, 500, 0x7f7f7f, 0x7f7f7f);
        grid.material.opacity = 0.5;
        grid.material.transparent = true;
        this.scene.add(grid);
    }
    addGround() {
        const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000 ), new THREE.MeshPhongMaterial( { color: 0x606060, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add( mesh );
    }
}