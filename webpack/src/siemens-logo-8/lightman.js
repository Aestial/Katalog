import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default class LightingManager {
    constructor(scene, renderer){
        this.data = data.lightman;
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
        const dirLight = new THREE.DirectionalLight(this.data.dir.color, this.data.dir.intensity);
        dirLight.position.set(this.data.dir.pos.x, this.data.dir.pos.y, this.data.dir.pos.z);
        dirLight.castShadow = this.data.dir.shadow.enabled;
        dirLight.shadow.mapSize.width = this.data.dir.shadow.mapSize;
        dirLight.shadow.mapSize.height = this.data.dir.shadow.mapSize;
        dirLight.shadow.camera.top = this.data.dir.shadow.top;
        dirLight.shadow.camera.bottom = this.data.dir.shadow.bottom;
        dirLight.shadow.camera.left = this.data.dir.shadow.left;
        dirLight.shadow.camera.right = this.data.dir.shadow.right;
        this.scene.add(dirLight);
        // Shadow helper
        if (this.data.dir.shadow.helper)
            this.scene.add(new THREE.CameraHelper(dirLight.shadow.camera));           
    }
    addHemisphere() {
        const hemiLight = new THREE.HemisphereLight(this.data.hemi.sky, this.data.hemi.ground, this.data.hemi.intensity);
        hemiLight.position.set(this.data.hemi.pos.x, this.data.hemi.pos.y, this.data.hemi.pos.z);
        this.scene.add(hemiLight);
    }
    onTextureLoaded(texture) {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();        
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        this.scene.background = this.data.env.background ? envMap : null;
        this.scene.environment = this.data.env.light ?  envMap : null;
        texture.dispose();
        pmremGenerator.dispose();
    }
}