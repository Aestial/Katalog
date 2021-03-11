import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
export default class ControlManager {
    constructor(camera, domElement){
        this.data = data.controlman;
        this.camera = camera;
        this.controls = new OrbitControls(camera, domElement);
        this.rotationSpeed = new THREE.Vector2();
        this.lastAngles = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.controls.keys = {
            UP: 87, // W
            LEFT: 65, // A
            BOTTOM: 83, // S
            RIGHT: 68, // D
            // LEFT: 37, //left arrow
            // UP: 38, // up arrow
            // RIGHT: 39, // right arrow
            // BOTTOM: 40 // down arrow
        };        
        // THREE Control events
        const startInteractionListener = this.onInteractionStarted.bind(this);
        const changeListener = this.onChanged.bind(this);
        const endInteractionListener = this.onInteractionEnded.bind(this);        
        this.controls.addEventListener( 'start', startInteractionListener, true );        
        this.controls.addEventListener( 'change', changeListener, true );
        this.controls.addEventListener( 'end', endInteractionListener, true );
        // Document pointer events
        const pointerMoveListener = this.onDocumentPointerMove.bind(this);   
        const pointerDownListener = this.onDocumentPointerDown.bind(this);
        const pointerUpListener = this.onDocumentPointerUp.bind(this);
        document.addEventListener('pointermove', pointerMoveListener, false);
        document.addEventListener('pointerdown', pointerDownListener, false);
        document.addEventListener('pointerup', pointerUpListener, false);
        this.set();
        this.update();        
    }
    set(){
        this.controls.target.set(this.data.target.x, this.data.target.y, this.data.target.z);
        this.controls.maxDistance = this.data.maxDistance;
        this.controls.minDistance = this.data.minDistance;        
        this.controls.autoRotate = true;
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        // this.controls.rotateSpeed = 0.25;
    }
    setAzimuthLimits(min, max) {
        this.controls.minAzimuthAngle = min/180 * Math.PI;
        this.controls.maxAzimuthAngle = max/180 * Math.PI;
        this.update();
    }
    setPolarLimits(min, max) {
        this.controls.minPolarAngle = min/180 * Math.PI;
        this.controls.maxPolarAngle = max/180 * Math.PI;
        this.update();
    }
    setDistanceLimits(min, max) {
        this.controls.minDistance = min;
        this.controls.maxDistance = max;
        this.update();
    }
    setPosition(position) {        
        this.camera.position.copy(position);
        this.update();
    }
    setTarget(target, autoRotate=false) {
        this.controls.target.copy(target);
        this.controls.autoRotate = autoRotate;
        this.controls.enableDamping = autoRotate;
        this.update();        
    }    
    update() {
        this.controls.update();
    }
    reset() {
        var currentPosition = this.camera.position.clone();
        window.slides.goto(0);
        this.setPosition(currentPosition); // TODO: SMOOTH
    }
    onInteractionStarted() {
        console.log("Orbit controls interaction started!");
        this.lastAngles.x = this.getAzimuthalAngleAbsDeg();
        this.lastAngles.y = this.getPolarAngleAbsDeg();
    }
    onInteractionEnded() {
        console.log("Orbit controls interaction ended!");
    }
    onChanged() {
        // console.log("Orbit controls changed!");
        // this.azimuthSpeed = this.getAzimuthSpeed();
        this.rotationSpeed.x = this.getAzimuthSpeed();
        this.rotationSpeed.y = this.getPolarSpeed();
        console.log("Azimuth rotation speed:" + this.rotationSpeed.x);
        console.log("Polar rotation speed:" + this.rotationSpeed.y);
    }
    onDocumentPointerMove(event) {
        event.preventDefault();        
        // console.log("Orbit controls pointer moving!");
        if ( this.isPointerDown )        {
            this.pointerSpeed = this.getPointerSpeed(event);
            console.log("POINTER speed:" + this.pointerSpeed);
            if ( (this.rotationSpeed.x < this.data.forcing.rotSpeed || this.rotationSpeed.y < this.data.forcing.rotSpeed)
                 && this.pointerSpeed > this.data.forcing.pointerSpeed ) {
                console.log("FORCING!!!!");
                this.forceCount++;
                if (this.forceCount > this.data.forcing.countHold ) {
                    console.log("RESET!!!!!!!!!!");
                    this.reset();
                }
            }
        }        
    }
    onDocumentPointerDown(event) {
        event.preventDefault();
        // console.log("Orbit controls pointer down!");        
        this.isPointerDown = true;
        this.lastPointer = this.getPointerCoordinates(event);
        this.forceCount = 0;
    }
    onDocumentPointerUp(event) {
        event.preventDefault();
        // console.log("Orbit controls pointer up!");
        this.isPointerDown = false;
        delete this.lastPointer;
        if (this.forceCount > this.data.forcing.countUp ) {
            console.log("RESET!!!!!!");
            this.reset();
        }
    }
    getAzimuthSpeed() {
        var deltaTime = this.clock.getDelta();
        var azimAngle = this.getAzimuthalAngleAbsDeg();
        // console.log("Orbit controls current azimuthal angle:" + azimAngle);
        var deltaAzimAngle = this.lastAngles.x - azimAngle;
        // console.log("Orbit controls delta azimuthal angle:" + this.deltaAzimAngle);
        var speed = Math.abs( deltaAzimAngle / deltaTime );
        // console.log("Orbit controls azimuthal rotation speed:" + this.deltaAzimAngle);
        this.lastAngles.x = azimAngle;
        return speed / 100;
    } 
    getPolarSpeed() {
        var deltaTime = this.clock.getDelta();
        var polarAngle = this.getPolarAngleAbsDeg();
        // console.log("Orbit controls current azimuthal angle:" + polarAngle);
        var deltaPolarAngle = this.lastAngles.y - polarAngle;
        // console.log("Orbit controls delta azimuthal angle:" + this.deltaPolarAngle);
        var speed = Math.abs( deltaPolarAngle / deltaTime );
        // console.log("Orbit controls azimuthal rotation speed:" + this.deltaPolarAngle);
        this.lastAngles.y = polarAngle;
        return speed / 100;
    }    
    getPointerSpeed(event) {
        var deltaTime = this.clock.getDelta();
        var pointerCoords = this.getPointerCoordinates(event);
        var deltaPointer = pointerCoords.distanceTo(this.lastPointer);
        var speed = deltaPointer / deltaTime;
        this.lastPointer = pointerCoords;
        return speed;
    }
    getAzimuthalAngleAbsDeg() {
        return this.controls.getAzimuthalAngle() + Math.PI;
    }
    getPolarAngleAbsDeg() {
        return this.controls.getPolarAngle();
    }
    getPointerCoordinates(event) {
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        return new THREE.Vector2(x, y);
    }
}