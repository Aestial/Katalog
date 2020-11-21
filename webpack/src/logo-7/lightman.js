import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default class LightingManager {
    constructor(scene, renderer){
        this.scene = scene;
        this.renderer = renderer;        
        this.addEnvironment();
        this.addHemisphere();
        this.addDirectional();
    }
    addEnvironment() {
        const loader = new RGBELoader().setDataType(THREE.UnsignedByteType);
        loader.load(assets.envmap, this.onTextureLoaded.bind(this));
    }
    addDirectional() {        
        const dirLight = new THREE.DirectionalLight(0x7f7f7f, 0.75);
        dirLight.position.set(-100, 100, -100);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.top = 70;
        dirLight.shadow.camera.bottom = -70;
        dirLight.shadow.camera.left = -70;
        dirLight.shadow.camera.right = 70;
        this.scene.add(dirLight);
        // Shadow helper
        // this.scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
    }
    addHemisphere() {
        const hemiLight = new THREE.HemisphereLight(0x050505, 0x9f9f9f);
        hemiLight.position.set(0, 100, 0);
        this.scene.add(hemiLight);
    }
    onTextureLoaded(texture) {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();        
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        // this.scene.background = envMap;
        this.scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
    }
}