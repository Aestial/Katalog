import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {default as sh} from './stringhelper';

import { labelman  as params } from './params';

export default class LabelManager {
    constructor(container, camera, scene) {
        this.container = container;
        this.camera = camera;
        this.scene = scene;
        this.renderer = new CSS2DRenderer();
        this.dom = this.renderer.domElement;
        this.index = 0;
        this.origin = new THREE.Vector3(params.origin.x, params.origin.y, params.origin.z);
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
    // TODO: DELETE THIS
    create(mesh, name, content) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        // labelDiv.textContent = name;
        labelDiv.textContent = ++this.index;
        const onInteract = function (evt) {
            this.displayInfo(name, content);
            evt.preventDefault();
        }.bind(this);
        labelDiv.onpointerdown = onInteract;
        const label = new CSS2DObject(labelDiv);
        label.position.copy(mesh.position);
        mesh.add(label);
        this.elements.push({ label, labelDiv, onInteract });
    }
    createAll() {
        const divs = Array.from(document.getElementsByClassName('label'));
        let index = 1; 
        divs.forEach((div) => {
            const label = new CSS2DObject(div);
            console.log(annotations[index]);
            const position = sh.toVector3(annotations[index].position);
            label.position.copy(position);            
            this.elements.push({ label, div });
            this.scene.add(label);            
            index++;
        });

    }
    displayInfo(name, content) {
        $('#rightModal').modal('show');
        $('#rightModalLabel').text(name);
        $('#rightModal .modal-body').text(content);
    }
    onWindowResize() {
        let w = window.innerWidth;
        let h = window.innerHeight;
        this.renderer.setSize(w, h);
    }
    update() {
        this.elements.forEach((elem) => {
            const { label, div } = elem;
            const meshDistance = this.camera.position.distanceTo(this.origin);
            const labelDistance = this.camera.position.distanceTo(label.position);
            const isBehindObject = labelDistance > meshDistance;
            div.style.opacity = isBehindObject ? params.opacity.hidden : params.opacity.visible;
            div.style.cursor = isBehindObject ? 'default' : 'pointer';
            // div.onpointerdown = isBehindObject ? null : onInteract;
        });
        this.renderer.render(this.scene, this.camera);
    }
}