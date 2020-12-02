import * as THREE from 'three';

export default class StringHelper {
    static toVector3(string){
        const arr = string.split(',');
        const x = parseFloat(arr[0]);
        const y = parseFloat(arr[1]);
        const z = parseFloat(arr[2]);
        return new THREE.Vector3(x, y, z);
    }
}