import * as THREE from 'three';
import { slidesman  as params } from './params';

export default class SlidesManager {
    constructor(camera) {
        this.camera = camera;
        this.firstTime = true;
        this.offset = 0;
        // this.positions = params.positions;
        $('#slidesCarousel').carousel({
            interval: false, //4500,
            keyboard: true,
            ride: true,
        });
        $('#slidesCarousel').on('slide.bs.carousel', (e) => {
            const to = e.to + this.offset;
            // console.log(to);
            const arr = annotations[to].camPosition.split(',');
            this.camera.position.set(arr[0], arr[1], arr[2]);
            this.camera.lookAt(params.target.x, params.target.y, params.target.z);

            // TODO: Maybe this breaks in somepoint
            if (this.firstTime){
                document.getElementById('welcome').remove();
                this.firstTime = false;
                this.offset = 1;
            }           
        });
    }
}