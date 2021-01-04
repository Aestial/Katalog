import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM, VRMUtils, VRMSchema } from '@pixiv/three-vrm';
import ControlManager from './controlman';
import RenderManager from './renderman';
import StatsManager from './statsman';

const container = document.getElementById("three-container");
// Render Manager
let renderman = new RenderManager(container);
// Control Manager
let controlman = new ControlManager(renderman.camera, renderman.dom);
// STATS
let statsman = new StatsManager(container);
// // camera
// const camera = new THREE.PerspectiveCamera( 30.0, window.innerWidth / window.innerHeight, 0.1, 20.0 );
// scene
const scene = new THREE.Scene();
// light
const light = new THREE.DirectionalLight( 0xffeeff );
light.position.set( 1.0, 1.0, 1.0 ).normalize();
scene.add( light );

// lookat target
const lookAtTarget = new THREE.Object3D();
renderman.camera.add( lookAtTarget );

// gltf and vrm
let character, sin;
const loader = new GLTFLoader();
loader.load(
    // VRM url
    assets.model,
    // Loaded callback
    (gltf) => {

        VRMUtils.removeUnnecessaryJoints( gltf.scene );

        VRM.from(gltf).then( (vrm) => {
            scene.add(vrm.scene);
            character = vrm;
            vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Hips).rotation.y = Math.PI;
            vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.LeftUpperArm).rotation.z = Math.PI*0.42;
            vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.RightUpperArm).rotation.z = -Math.PI*0.42;
            vrm.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.Fun, 0.6);
            vrm.lookAt.target = lookAtTarget;
            console.log(vrm);
        });
    },
    // Loading progressing
    (progress) => console.log( 'Loading model...', 100.0 * ( progress.loaded/progress.total ), '%'),
    // Loading errors
    (error) => console.error(error)
);

// animate
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame( animate );
    const deltaTime = clock.getDelta();
    if ( character ) {
        // update character
        // tweak blendshape
        sin = Math.sin( Math.PI * clock.elapsedTime );
        character.update( deltaTime );
    }
    renderman.render(scene);
    controlman.update();
    statsman.update();
}
animate();

// mouse listener
window.addEventListener( 'mousemove', ( event ) => {
    const pos = new THREE.Vector2();
    pos.x = (event.clientX - 0.5 * window.innerWidth) / window.innerHeight;
    pos.y = (event.clientY - 0.5 * window.innerHeight) / window.innerHeight;
    lookAtTarget.position.x =  10.0 * pos.x;
    lookAtTarget.position.y = -10.0 * pos.y;
    lookAtTarget.position.z = 2.0;    
    const joy = 1.0 - pos.length() * 4;
    console.log("Joy: " + joy);
    const fun = pos.y * 0.5;
    console.log("Fun: " + fun);
    character.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.Joy, joy);
    character.blendShapeProxy.setValue(VRMSchema.BlendShapePresetName.Fun, fun);
} );