import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {default as sh} from './StringHelper';

export default class Labels {
    constructor(container, camera, scene) {
        this.data = data.labelman;
        this.container = container;
        this.camera = camera;
        this.scene = scene;
        this.renderer = new CSS2DRenderer();
        this.dom = this.renderer.domElement;
        this.origin = new THREE.Vector3(this.data.origin.x, this.data.origin.y, this.data.origin.z);
        this.elements = [];
        this.configure();
        this.createAll();
        // Events
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();        
    }
    configure() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.dom.style.position = 'absolute';
        this.dom.style.top = '0px';
        this.container.appendChild(this.dom);
    }
    createAll() {
        const divs = Array.from(document.getElementsByClassName('label'));
        divs.forEach((div) => {            
            const index = parseInt(div.textContent);
            const ondown = (evt) => {
                console.log(index);
                window.slides.goto(index);
                evt.preventDefault();
            };
            div.onpointerdown = ondown;
            const position = sh.toVector3(annotations[index].position);
            const label = new CSS2DObject(div);
            label.position.copy(position);            
            this.scene.add(label);            
            this.elements.push({ label, div, ondown });            
        });
    }
    onWindowResize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        this.renderer.setSize(w, h);
    }
    update() {
        this.elements.forEach((elem) => {
            const { label, div, ondown } = elem;
            const meshDistance = this.camera.position.distanceTo(this.origin);
            const labelDistance = this.camera.position.distanceTo(label.position);
            const isOccluded = labelDistance > meshDistance;
            div.style.opacity = isOccluded ? this.data.opacity.hidden : this.data.opacity.visible;
            div.style.cursor = isOccluded ? 'default' : 'pointer';
            div.onpointerdown = isOccluded ? null : ondown;
        });
        this.renderer.render(this.scene, this.camera);
    }
}