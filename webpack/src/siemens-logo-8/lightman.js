import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { lightman as params } from './params';

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
        const dirLight = new THREE.DirectionalLight(params.dir.color, params.dir.intensity);
        dirLight.position.set(params.dir.pos.x, params.dir.pos.y, params.dir.pos.z);
        dirLight.castShadow = params.dir.shadow.enabled;
        dirLight.shadow.mapSize.width = params.dir.shadow.mapSize;
        dirLight.shadow.mapSize.height = params.dir.shadow.mapSize;
        dirLight.shadow.camera.top = params.dir.shadow.top;
        dirLight.shadow.camera.bottom = params.dir.shadow.bottom;
        dirLight.shadow.camera.left = params.dir.shadow.left;
        dirLight.shadow.camera.right = params.dir.shadow.right;
        this.scene.add(dirLight);
        // Shadow helper
        if (params.dir.shadow.helper)
            this.scene.add(new THREE.CameraHelper(dirLight.shadow.camera));           
    }
    addHemisphere() {
        const hemiLight = new THREE.HemisphereLight(params.hemi.sky, params.hemi.ground, params.hemi.intensity);
        hemiLight.position.set(params.hemi.pos.x, params.hemi.pos.y, params.hemi.pos.z);
        this.scene.add(hemiLight);
    }
    onTextureLoaded(texture) {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();        
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        this.scene.background = params.env.background ? envMap : null;
        this.scene.environment = params.env.light ?  envMap : null;
        texture.dispose();
        pmremGenerator.dispose();
    }
}