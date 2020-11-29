import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export default class LabelManager {
    constructor(container, camera, scene) {
        this.container = container;
        this.camera = camera;
        this.scene = scene;
        this.renderer = new CSS2DRenderer();
        this.dom = this.renderer.domElement;
        this.index = 0;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.dom.style.position = 'absolute';
        this.dom.style.top = '0px';
        this.container.appendChild(this.dom);
        // Events
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();        
    }
    create(mesh, name, content) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        // labelDiv.textContent = name;
        labelDiv.textContent = ++this.index;
        labelDiv.onclick = function () {
            this.displayInfo(name, content);
        }.bind(this);
        const label = new CSS2DObject(labelDiv);
        label.position.copy(mesh.position);
        mesh.add(label);
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
        this.renderer.render(this.scene, this.camera);
    }
}