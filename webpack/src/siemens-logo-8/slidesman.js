import {default as sh} from './StringHelper';

export default class SlidesManager {
    constructor(controlman) {
        this.controlman = controlman;
        this.index = 0;
        this.carousel = $('#slidesCarousel');
        this.help = {};
        this.current = {};
        this.carousel.carousel({
            interval: false, //4500,
            keyboard: true,
            ride: true,
        });
        this.carousel.on('slide.bs.carousel', (e) => {
            // console.log(e.to);
            this.updateControls(e.to);
            this.updateInfo(e.to);
            this.updateModal(this.current.title, this.current.content);
            // IF NOT MOVILE:
                // this.showModal();

        });
        this.saveHelp();
    }
    prev() {
        this.carousel.carousel('prev');
    }
    next() {
        this.carousel.carousel('next');
    }
    goto(index) {
        this.carousel.carousel(index);
        if (index == 0) {
            $('#rightModal').modal('hide');
        }
    }
    showHelp() {
        this.updateModal(this.help.title,this.help.content);
        $('#rightModal').modal('show');
    }
    showModal() {
        $('#rightModal').modal({backdrop: false});
        $('#rightModal').modal('show');
    }
    saveHelp() {
        this.help.title = $('#rightModalLabel').html();
        this.help.content = $('#rightModal .modal-body').html();
    }
    updateControls(to) {
        const target = sh.toVector3(annotations[to].position);
        const position = sh.toVector3(annotations[to].cam_position);  
        const azimuth = sh.toMinMaxAngle(annotations[to].azimuth_limits);
        const polar = sh.toMinMaxAngle(annotations[to].polar_limits);
        const distance = sh.toMinMax(annotations[to].distance_limits);
        this.controlman.setAzimuthLimits(azimuth.min, azimuth.max);        
        this.controlman.setPolarLimits(polar.min, polar.max);        
        this.controlman.setDistanceLimits(distance.min, distance.max);
        this.controlman.setTarget(target, to==0);
        this.controlman.setPosition(position);
    }
    updateInfo(to) {
        this.current.title = annotations[to].title;
        this.current.content = annotations[to].description;
        this.updateButton(to > 0);
    }
    updateModal(title, content) {
        $('#rightModalLabel').html(title);
        $('#rightModal .modal-body').html(content);
    }
    updateButton(show) {
        if (show) {
            $('#showMore').removeClass("d-none");
            $('#showMore').addClass("d-block");
        }
        else {
            $('#showMore').removeClass("d-block");
            $('#showMore').addClass("d-none");
        }
    }
}