import * as THREE from 'three';

export default class StringHelper {
    static toVector3(string){
        const arr = string.split(',');
        return new THREE.Vector3(arr[0],arr[1],arr[2]);
    }
}