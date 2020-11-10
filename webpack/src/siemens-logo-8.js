import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

const width = window.innerWidth; // default: 672
const height = window.innerHeight; // default: 672
const aspectRatio = width / height;

const container = document.getElementById("three-container");

let camera, scene, renderer, stats;

const clock = new THREE.Clock();
// let mixer;

init();
animate();

function init() {
    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(60, 180, 80);
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    // Axes Helper
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);
    // Hemisṕhere Light
    const hemiLight = new THREE.HemisphereLight(0xbbbbbb, 0xaaaaaa);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    // Directional Light
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(50, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.top = 70;
    dirLight.shadow.camera.bottom = -70;
    dirLight.shadow.camera.left = -70;
    dirLight.shadow.camera.right = 70;
    scene.add(dirLight);
    // Directional shadow helper
    scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
    // Ground
    // const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add( mesh );
    // Grid
    // const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    // grid.material.opacity = 0.05;
    // grid.material.transparent = true;
    // scene.add( grid );
    // Material
    const material = new THREE.MeshStandardMaterial({
        color: 0x67798c,
        roughness: 1,
        metalness: 0,        
    });
    // Model
    const loader = new FBXLoader();
    loader.load(assets.model, function (object) {
        // Animation
        // mixer = new THREE.AnimationMixer( object );
        // const action = mixer.clipAction( object.animations[ 0 ] );
        // action.play();
        // Apply material and shadows
        object.traverse(function (child) {
            console.log(child);
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material = material;
            }
        });
        scene.add(object);
    });
    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 25, 0);
    controls.maxDistance = 400;
    controls.minDistance = 100;
    controls.update();
    // Events
    window.addEventListener('resize', onWindowResize, false);
    // Stats
    stats = new Stats();
    stats.domElement.style.cssText = 'position:relative; top:-56px; left:0px;';
    container.appendChild(stats.dom);
    // Initialize actions
    onWindowResize();
}

function onWindowResize() {
    let w = getParentDivWidth();
    let h = getParentDivHeight();
    h = w / aspectRatio;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

function getParentDivWidth() {
    let width = window.innerWidth;
    console.log("Width " + width);
    return width;
}

function getParentDivHeight() {
    let height = window.outerHeight;
    console.log("Height " + height);
    return height;
}

function animate() {
    requestAnimationFrame(animate);
    // const delta = clock.getDelta();
    // if ( mixer ) mixer.update( delta );
    renderer.render(scene, camera);
    stats.update();
}