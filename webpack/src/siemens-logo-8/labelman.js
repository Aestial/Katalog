import * as THREE from 'three';

export default class LabelManager {
    constructor(camera, scene, pointerman) {
        this.camera = camera;
        this.scene = scene;
        this.pointerman = pointerman;
        // this.container = document.querySelector('#labels');
        // this.elements = [];
        // this.tempWorldPos = new THREE.Vector3();
        this.index = 0;
    }
    create(mesh, name, content) {
        // const label = document.createElement('div');
        // label.textContent = ++this.index;
        // label.onclick = function () {
        //     this.displayInfo(name, content);
        // }.bind(this);
        // this.container.appendChild(label);
        const index = ++this.index;
        // const label = new MeshText2D(index, { 
        //     align: textAlign.bottom, 
        //     font: '100px Helvetica', 
        //     fillStyle: 'cyan',
        //     background: 'white',
        //     antialias: true,
        // });
        label.name = 'label-' + (index);
        label.scale.set(0.01, 0.01, 0.01);
        // label.layers.disable(layers.BLOOM_SCENE);
        console.log(label);
        label.position.copy(mesh.position);
        const event = () => {
            this.displayInfo(name, content);
        };
        this.scene.add(label);
        this.pointerman.addEvent(label, event);
        // this.elements.push({mesh, label});
    }
    displayInfo(name, content) {
        $('#rightModal').modal('show');
        $('#rightModalLabel').text(name);
        $('#rightModal .modal-body').text(content);
    }
    update() {
        this.elements.forEach( elem => {
            const {mesh, label} = elem;
            // console.log(mesh, label.textContent);
            // Get the position of the center of the mesh
            mesh.updateWorldMatrix(true, false);
            mesh.getWorldPosition(this.tempWorldPos);
            // Get the normalized screen coordinate of that position
            // x and y will be in the -1 to +1 range with x = -1 being
            // on the left and y = -1 being on the bottom
            this.tempWorldPos.project(this.camera);
            // Convert the normalized position to CSS coordinates
            const x = (this.tempWorldPos.x *  0.5 + 0.5) * window.innerWidth;
            const y = (this.tempWorldPos.y * -0.5 + 0.5) * window.innerHeight;
            label.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
    }
}