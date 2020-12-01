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
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);        
        this.configure();
        // Events
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();
    }
    clear() {
        this.renderer.clear();
        // console.log(this.camera.position);
    }
    configure() {
        this.camera.position.set(params.cam.pos.x, params.cam.pos.y, params.cam.pos.z);
        this.camera.near = params.cam.near;
        this.camera.far = params.cam.far;
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
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}