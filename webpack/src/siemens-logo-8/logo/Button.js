import * as THREE from 'three';
// import {  }

export default class Button {
    constructor(mesh, matIndex, pointer, onPointerDown, onPointerUp) {
        this.mesh = mesh;
        this.matIndex = matIndex;
        this.pointer = pointer;
        this.onPointerDown = onPointerDown;
        this.onPointerUp = onPointerUp;
        
        this.materials = [
            new THREE.MeshStandardMaterial({
                color: 0x9CB7B4,
                roughness: 1,
                metalness: 0,
            }),
            new THREE.MeshStandardMaterial({
                color: 0x00A247,
                roughness: 1,
                metalness: 0,
            })
        ];        
        this.mesh.material = this.materials[this.matIndex].clone();

        this.onPointerDownEvent = () => {
            // console.log("Button pointer down");
            if (onPointerDown) onPointerDown();
            //Animate
            this.mesh.position.y = this.mesh.position.y - 0.1;
        };
        this.onPointerUpEvent = () => {
            // console.log("Button pointer up");
            if(onPointerUp) onPointerUp();
            //Animate
            this.mesh.position.y = this.mesh.position.y + 0.1;
        }   
        this.pointer.addOnPointerDownListener(this.mesh, this.onPointerDownEvent);
        this.pointer.addOnPointerUpistener(this.mesh, this.onPointerUpEvent);
    }
        
    
}