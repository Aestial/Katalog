import * as THREE from 'three';
import { renderman  as params } from './params';

export default class RenderManager {
    constructor(container){
        this.container = container;
        this.width = window.innerWidth; 
        this.height = window.innerHeight;
        this.aspectRatio = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: params.antialias,
        });
        this.dom = this.renderer.domElement;
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 2000);
        this.camera.position.set(params.camPos.x, params.camPos.y, params.camPos.z);
        this.configure();
        // Events
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();
    }
    clear() {
        this.renderer.clear();
    }
    configure() {
        this.container.appendChild(this.dom);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.autoClear = params.autoClear;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.LinearToneMapping;
        this.renderer.toneMappingExposure = params.exposure;
    }
    onWindowResize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        // h = w / aspectRatio;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}