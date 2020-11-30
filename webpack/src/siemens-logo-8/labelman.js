import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

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
    create(mesh, name, content) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        // labelDiv.textContent = name;
        labelDiv.textContent = ++this.index;
        const onClick = function () {
            this.displayInfo(name, content);
        }.bind(this);
        labelDiv.onclick = onClick;
        const label = new CSS2DObject(labelDiv);
        label.position.copy(mesh.position);
        mesh.add(label);
        this.elements.push({ label, labelDiv, onClick });
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
            const { label, labelDiv, onClick} = elem;
            const meshDistance = this.camera.position.distanceTo(this.origin);
            const labelDistance = this.camera.position.distanceTo(label.position);
            const isBehindObject = labelDistance > meshDistance;
            labelDiv.style.opacity = isBehindObject ? params.opacity.hidden : params.opacity.visible;
            labelDiv.style.cursor = isBehindObject ? 'default' : 'pointer';
            labelDiv.onclick = isBehindObject ? null : onClick;
        });
        this.renderer.render(this.scene, this.camera);
    }
}