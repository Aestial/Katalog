import * as THREE from 'three';

export default class RenderManager {
    constructor(container){
        this.data = data.renderman;
        this.container = container;
        this.width = window.innerWidth; 
        this.height = window.innerHeight;
        this.aspectRatio = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: this.data.antialias,
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
    }
    render(scene) {
        this.renderer.render(scene, this.camera);
    }
    configure() {
        this.camera.position.set(this.data.cam.pos.x, this.data.cam.pos.y, this.data.cam.pos.z);
        this.camera.near = this.data.cam.near;
        this.camera.far = this.data.cam.far;
        this.camera.fov = this.data.cam.fov / (this.aspectRatio);
        this.container.appendChild(this.dom);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.autoClear = this.data.autoClear;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = this.data.exposure;
    }
    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspectRatio = this.width / this.height;
        this.camera.aspect = this.aspectRatio;
        this.camera.fov = this.data.cam.fov / Math.log(this.data.cam.base + this.aspectRatio);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
}