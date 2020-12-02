import * as THREE from 'three';
import { slidesman  as params } from './params';

export default class SlidesManager {
    constructor(camera) {
        this.camera = camera;
        this.positions = params.positions;
        $('#slidesCarousel').carousel({
            interval: false, //4500,
            keyboard: true,
            ride: true,
        });
        $('#slidesCarousel').on('slide.bs.carousel', (e) => {
            // do something…
            // console.log(e.to);
            const p = this.positions[e.to];
            const pv = new THREE.Vector3(p.x, p.y, p.z);
            this.camera.position.copy(pv);
            this.camera.lookAt(params.target.x, params.target.y, params.target.z);
        });
    }
}