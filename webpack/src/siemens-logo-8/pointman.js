import * as THREE from 'three';
import { layers } from './params';

export default class PointerManager {
    constructor(camera){
        this.camera = camera;        
        this.raycaster = new THREE.Raycaster();        
        this.pointer = new THREE.Vector2();
        this.targets = [];
        this.intersected = null;
        // Event binding
        const pointerMoveListener = this.onDocumentPointerMove.bind(this);
        document.addEventListener('pointermove', pointerMoveListener, false);
        const pointerDownListener = this.onDocumentPointerDown.bind(this);
        document.addEventListener('pointerdown', pointerDownListener, false);
    }
    add(mesh){
        this.targets.push(mesh);
    }
    update() {
        // Find intersections
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.targets);
        if (intersects.length > 0) {
            if (this.intersected != intersects[0].object) {
                
                if (this.intersected) {
                    this.intersected.material.emissive.setHex(this.intersected.currentHex);
                    this.intersected.layers.disable(layers.BLOOM_SCENE);
                }                    
                this.intersected = intersects[0].object;
                this.intersected.currentHex = this.intersected.material.emissive.getHex();
                this.intersected.material.emissive.setHex(0x7f7f7f);
                this.intersected.layers.enable(layers.BLOOM_SCENE);
            }            
        } else {
            if (this.intersected) {
                this.intersected.material.emissive.setHex(this.intersected.currentHex);
                this.intersected.layers.disable(layers.BLOOM_SCENE);
            }            
            this.intersected = null;
        }        
    }
    onDocumentPointerMove(event) {
        event.preventDefault();
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    onDocumentPointerDown(event) {
        event.preventDefault();
        if (this.intersected) {
            switch(this.intersected.name) {
                case 'Button-L':
                    window.logoman.changeDisplayColor('off');
                    break;
                case 'Button-U':
                    window.logoman.changeDisplayColor('white');
                    break;
                case 'Button-R':
                    window.logoman.changeDisplayColor('amber');
                    break;
                case 'Button-D':
                    window.logoman.changeDisplayColor('red');
                    break;
            }
            console.log(this.intersected.name + ' pressed!');
        }            
    }    
}