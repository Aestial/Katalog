import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Button from './Button';

export default class Logo {
    constructor(pointer, callback){
        this.pointer = pointer;
        this.callback = callback;
        this.layers = data.layers;
        this.loadTextures();
        this.createMaterials();
        this.createModel();
    }
    changeDisplayColor(color) {
        this.display.material = this.displayMaterials[color];
        if (color == 'off') {
            this.display.layers.disable(this.layers.BLOOM_SCENE);
        } else {
            this.display.layers.enable(this.layers.BLOOM_SCENE);
        }
    }
    createModel() {
        const loader = new FBXLoader();        
        loader.load(assets.model, this.onModelLoaded.bind(this));
    }
    createMaterials() {
        this.displayMaterials = {
            off: new THREE.MeshStandardMaterial({
                color: 0xffffa0,
                map: this.textures.displaymap,
                roughness: 0.4,
                metalness: 0.4,
            }),
            white: new THREE.MeshStandardMaterial({
                color: 0xafafaf,
                map: this.textures.displaymap,
                roughness: 0.4,
                metalness: 0.4,
                emissiveMap: this.textures.displaymap,
                emissive: 0xafafaf,
                emissiveIntensity: 0.12,
            }),
            amber: new THREE.MeshStandardMaterial({
                color: 0xff3f00,
                map: this.textures.displaymap,
                roughness: 0.4,
                metalness: 0.4,
                emissiveMap: this.textures.displaymap,
                emissive: 0xf53f00,
                emissiveIntensity: 0.09,
            }),
            red: new THREE.MeshStandardMaterial({
                color: 0xde0000,
                map: this.textures.displaymap,
                roughness: 0.4,
                metalness: 0.4,
                emissiveMap: this.textures.displaymap,
                emissive: 0xde0a00,
                emissiveIntensity: 0.78,
            }),               
        };
        this.materials = {
            body: new THREE.MeshStandardMaterial({
                color: 0x505B68,
                roughness: 0.4,
                metalness: 0.15,
            }),
            screenbg: new THREE.MeshStandardMaterial({
                color: 0x000000,
                roughness: 0.2,
                metalness: 0,
            }),
            label: new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.6,
                metalness: 0,
            }),
            labelbg: new THREE.MeshStandardMaterial({
                color: 0x008283,
                roughness: 1,
                metalness: 0,
            }),
            screencover: new THREE.MeshStandardMaterial({
                color: 0x3a3a3a,
                roughness: 0.1,
                metalness: 0,
                transparent: true,
                opacity: 0.35,
            }),
            
        };        
    }
    loadTextures() {
        this.textures = {
            displaymap: new THREE.TextureLoader().load(assets.displaymap),
        };
        this.textures.displaymap.magFilter = THREE.NearestFilter;
        this.textures.displaymap.minFilter = THREE.NearestFilter;
    }
    onModelLoaded(object) {
        object.traverse(this.processChild.bind(this));
        this.callback(object);
        this.object = object;
    }
    processChild(child) {
        // console.log(child);
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            let event;
            switch (child.name) {
                case "Body":
                    child.material = this.materials.body;
                    break;
                case "Display":
                    child.material = this.displayMaterials.off;
                    this.display = child;  
                    break;
                case "Screen":
                    child.material = this.materials.screenbg;
                    break;
                case "Label":
                    child.material = this.materials.label;
                    break;
                case "LabelBg":
                    child.material = this.materials.labelbg;
                    break;
                case "ScreenCover":
                    child.layers.enable(this.layers.BLOOM_SCENE);
                    child.material = this.materials.screencover;
                    break;
                case 'Button-L':
                    new Button(child, 0, this.pointer, () => {
                        this.changeDisplayColor('off');
                    });
                    break;
                case 'Button-U':
                    new Button(child, 0, this.pointer, () => {
                        this.changeDisplayColor('white');
                    });
                    break;
                case 'Button-R':
                    new Button(child, 0, this.pointer, () => {
                        this.changeDisplayColor('amber');
                    });
                    break;
                case 'Button-D':
                    new Button(child, 0, this.pointer, () => {
                        this.changeDisplayColor('red');
                    });
                    break;
                case "Button-Ok":
                    new Button(child, 1, this.pointer, () => {
                        // this.changeDisplayColor('red');
                    });
                    break;
                case "Button-Esc":
                    new Button(child, 0, this.pointer, () => {
                        // this.changeDisplayColor('red');
                    });
                    break;
                default:
                    break;                
            }
        }
    }
}