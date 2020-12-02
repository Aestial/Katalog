import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { layers } from './params';

export default class LogoManager {
    constructor(pointerman, callback, labelman){
        this.pointerman = pointerman;
        this.callback = callback;
        this.labelman = labelman;
        this.loadTextures();
        this.createMaterials();
        this.createModel();
    }
    changeDisplayColor(color) {
        this.display.material = this.displayMaterials[color];
        if (color == 'off') {
            this.display.layers.disable(layers.BLOOM_SCENE);
        } else {
            this.display.layers.enable(layers.BLOOM_SCENE);
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
                emissiveIntensity: 0.05,
            }),
            amber: new THREE.MeshStandardMaterial({
                color: 0xff3f00,
                map: this.textures.displaymap,
                roughness: 0.4,
                metalness: 0.4,
                emissiveMap: this.textures.displaymap,
                emissive: 0xff3f00,
                emissiveIntensity: 0.05,
            }),
            red: new THREE.MeshStandardMaterial({
                color: 0xde0000,
                map: this.textures.displaymap,
                roughness: 0.4,
                metalness: 0.4,
                emissiveMap: this.textures.displaymap,
                emissive: 0xde0a00,
                emissiveIntensity: 0.025,
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
            button: new THREE.MeshStandardMaterial({
                color: 0x9CB7B4,
                roughness: 1,
                metalness: 0,
            }),
            okbutton: new THREE.MeshStandardMaterial({
                color: 0x00A247,
                roughness: 1,
                metalness: 0,
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
        // console.log(child.name);
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            let event;
            switch (child.name) {
                case "Body":
                    child.material = this.materials.body;
                    break;
                case "Display":
                    child.layers.enable(layers.BLOOM_SCENE);
                    // this.labelman.create(child, "Display", "Display information");
                    child.material = this.displayMaterials.red;
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
                    child.layers.enable(layers.BLOOM_SCENE);
                    child.material = this.materials.screencover;
                    break;
                case 'Button-L':
                    child.material = this.materials.button.clone();
                    event = function () {
                        window.logoman.changeDisplayColor('off');
                    }.bind(this);
                    this.pointerman.addEvent(child, event);
                    break;
                case 'Button-U':
                    child.material = this.materials.button.clone();
                    event = function () {
                        window.logoman.changeDisplayColor('white');
                    }.bind(this);
                    this.pointerman.addEvent(child, event);
                    break;
                case 'Button-R':
                    child.material = this.materials.button.clone();
                    event = function () {
                        window.logoman.changeDisplayColor('amber');
                    }.bind(this);
                    this.pointerman.addEvent(child, event);
                    break;
                case 'Button-D':
                    child.material = this.materials.button.clone();
                    event = function () {
                        window.logoman.changeDisplayColor('red');
                    }.bind(this);
                    this.pointerman.addEvent(child, event);
                    break;
                case "Button-Ok":
                    child.material = this.materials.okbutton;
                    event = function () {
                        //                        
                    }.bind(this);
                    this.pointerman.addEvent(child, event);
                    // this.labelman.create(child, "Botones", "Botokobmovnboi vni'ran vbionaf");
                    break;
                case "Button-Esc":
                    child.material = this.materials.button.clone();
                    event = function () {
                        //
                    }.bind(this);
                    this.pointerman.addEvent(child, event);
                    // this.labelman.create(child, "Botones", "Botokobmovnboi vni'ran vbionaf");
                    break;
                default:
                    break;                
            }
        }
        console.log(child);
    }
    displayInfo(name, content) {
        $('#rightModal').modal('show');
        $('#rightModalLabel').text(name);
        $('#rightModal .modal-body').text(content);
    }
}