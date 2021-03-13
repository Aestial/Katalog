import * as THREE from 'three';

export default class ObjectPointer {
    constructor(camera){
        this.layers = data.layers;
        this.camera = camera;        
        this.raycaster = new THREE.Raycaster();        
        this.pointer = new THREE.Vector2();
        this.targets = [];
        this.onPointerDownListeners = {};
        this.onPointerUpListeners = {};
        this.intersected = null;
        this.pressed = null;
        // Event binding
        const pointerMoveListener = this.onDocumentPointerMove.bind(this);
        document.addEventListener('pointermove', pointerMoveListener, false);
        const pointerDownListener = this.onDocumentPointerDown.bind(this);
        document.addEventListener('pointerdown', pointerDownListener, false);
        const pointerUpListener = this.onDocumentPointerUp.bind(this);
        document.addEventListener('pointerup', pointerUpListener, false);
    }
    add(mesh){
        this.targets.push(mesh);
    }
    addOnPointerDownListener(target, event) {
        this.targets.push(target);
        this.onPointerDownListeners[target.name] = event; 
    }
    addOnPointerUpistener(target, event) {
        this.targets.push(target);
        this.onPointerUpListeners[target.name] = event; 
    }
    update() {
        // Find intersections
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.targets);
        if (intersects.length > 0) {
            if (this.intersected != intersects[0].object) {
                
                if (this.intersected) {
                    // this.intersected.material.emissive.setHex(this.intersected.currentHex);
                    // this.intersected.layers.disable(this.layers.BLOOM_SCENE);
                }                    
                this.intersected = intersects[0].object;
                // this.intersected.currentHex = this.intersected.material.emissive.getHex();
                // this.intersected.material.emissive.setHex(0x7f7f7f);
                // this.intersected.material.emissiveIntensity = 0.5;
                // this.intersected.layers.enable(this.layers.BLOOM_SCENE);
            }            
        } else {
            if (this.intersected) {
                // this.intersected.material.emissive.setHex(this.intersected.currentHex);
                // this.intersected.layers.disable(this.layers.BLOOM_SCENE);
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
            this.onPointerDownListeners[this.intersected.name]();
            console.log(this.intersected.name + ' pressed!');
            this.pressed = this.intersected;
        }            
    }
    onDocumentPointerUp(event) {
        event.preventDefault();
        if (this.pressed) {
            this.onPointerUpListeners[this.pressed.name]();
            console.log(this.pressed.name + ' unpressed!');
            this.pressed = null;
        }
    }
}