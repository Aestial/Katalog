import * as THREE from 'three';

export default class StringHelper {
    static toVector3(string){
        const arr = string.split(',');
        const x = parseFloat(arr[0]);
        const y = parseFloat(arr[1]);
        const z = parseFloat(arr[2]);
        return new THREE.Vector3(x, y, z);
    }
    static toMinMax(string){
        const arr = string.split(',');
        const min = parseFloat(arr[0]);
        const max = parseFloat(arr[1]);
        return {min:min, max:max};
    }
    static toMinMaxAngle(string){
        const minmax = this.toMinMax(string);
        if (minmax.min <= -360)
            minmax.min = -Infinity;
        if (minmax.max >= 360)
            minmax.max = Infinity;
        return minmax;
    }
}