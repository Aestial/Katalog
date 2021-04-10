import * as THREE from 'three';

export default class Led {
    constructor(mesh, isOn) {
        this.mesh = mesh;
        this.isOn = isOn;
        this.layers = data.layers;
        this.materials = [
            new THREE.MeshStandardMaterial({
                color: 0x335533,
                roughness: 0,
                metalness: 0.5,
                transparent: true,
                opacity: 0.3,
            }),
            new THREE.MeshStandardMaterial({
                color: 0x22ff22,
                roughness: 0,
                metalness: 0.5,
                emissive: 0x22ff22,
                emissiveIntensity: 1.5,
            }),
            new THREE.MeshStandardMaterial({
                color: 0xf56f00,
                roughness: 0,
                metalness: 0.5,
                emissive: 0xf56f00,
                emissiveIntensity: 1.5,
            })            
        ];
        this.turn(this.isOn);
        this.animate();
    }
    turn (isOn) {
        this.isOn = isOn;
        if (isOn) this.setColor(1);
        else this.setColor(0);
    }
    animate() {        
        setTimeout(() => {
            requestAnimationFrame(this.animate.bind(this));
        }, 1000 / 2);
        // console.log("Updating LED");
        if(this.isOn && Math.random() < 0.125)
            this.setColor(2);
        else 
            this.setColor(1);
    }
    setColor(color) {            
        this.mesh.material = this.materials[color];
        if (color == 0) {
            this.mesh.layers.disable(this.layers.BLOOM_SCENE);
        } else {
            this.mesh.layers.enable(this.layers.BLOOM_SCENE);            
        }
    }
}