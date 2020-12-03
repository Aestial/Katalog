import {default as sh} from './stringhelper';

export default class SlidesManager {
    constructor(controlman) {
        this.controlman = controlman;
        this.firstTime = true;
        this.carousel = $('#slidesCarousel');
        // this.positions = params.positions;
        this.carousel.carousel({
            interval: false, //4500,
            keyboard: true,
            ride: true,
        });
        this.carousel.on('slide.bs.carousel', (e) => {
            console.log(e.to);
            this.updateControls(e.to);            
        });
    }
    prev() {
        this.carousel.carousel('prev');
    }
    next() {
        this.carousel.carousel('next');
    }
    goto(index) {
        this.carousel.carousel(index);
    }
    displayInfo(name, content) {
        $('#rightModalLabel').text(name);
        $('#rightModal .modal-body').text(content);
        $('#rightModal').modal('show');
    }
    updateControls(to) {
        const position = sh.toVector3(annotations[to].cam_position);
        const target = sh.toVector3(annotations[to].position);          
        this.controlman.setTarget(target);
        this.controlman.setPosition(position);
    }
}