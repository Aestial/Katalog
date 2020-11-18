import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader.js';
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import PointerManager from './pointerman';

const width = window.innerWidth; // default: 672
const height = window.innerHeight; // default: 672
const aspectRatio = width / height;

const container = document.getElementById("three-container");

let camera, scene, renderer, stats;
let pointerman;

const clock = new THREE.Clock();
// let mixer;

init();

function init() {
    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(60, 180, 80);
    // Pointer Manager
    pointerman = new PointerManager(camera);
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101010);
    scene.fog = new THREE.Fog(0x606060, 200, 10000);
    // Environment
    new RGBELoader().setDataType(THREE.UnsignedByteType).load(assets.envmap, function (texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        // scene.background = envMap;
        scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
    });
    // Axes Helper
    const axesHelper = new THREE.AxesHelper(100);
    // scene.add(axesHelper);
    // Hemisṕhere Light
    const hemiLight = new THREE.HemisphereLight(0xbababa, 0x656565);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);
    // Directional Light
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-50, 200, -100);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.top = 70;
    dirLight.shadow.camera.bottom = -70;
    dirLight.shadow.camera.left = -70;
    dirLight.shadow.camera.right = 70;
    scene.add(dirLight);
    // Directional shadow helper
    // scene.add(new THREE.CameraHelper(dirLight.shadow.camera));
    // Ground
    // const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add( mesh );
    // Grid
    const grid = new THREE.GridHelper(10000, 500, 0x7f7f7f, 0x7f7f7f);
    grid.material.opacity = 0.5;
    grid.material.transparent = true;
    // scene.add(grid);
    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x3a4a5f,
        roughness: 1,
        metalness: 0,
        envMapIntensity: 1.5,
    });
    const escButtonMat = new THREE.MeshStandardMaterial({
        color: 0xaa4a5f,
        roughness: 1,
        metalness: 0,
        envMapIntensity: 1.2,
    });
    const okButtonMat = new THREE.MeshStandardMaterial({
        color: 0x3aaa5f,
        roughness: 1,
        metalness: 0,
        envMapIntensity: 1.2,
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
            // console.log(child);
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // console.log(child.name);
            }            
            switch (child.name) {
                case "OkButton":
                    child.material = okButtonMat;
                    pointerman.add(child);
                    break;
                case "EscButton":
                    child.material = escButtonMat;
                    pointerman.add(child);
                    break;
                case "Body":
                    child.material = bodyMat;
                    break;                
            }
        });
        scene.add(object);
        animate();
    });
   
    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);
    // PMREM Generator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
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
    // console.log("Width " + width);
    return width;
}

function getParentDivHeight() {
    let height = window.outerHeight;
    // console.log("Height " + height);
    return height;
}

function animate() {
    requestAnimationFrame(animate);
    // const delta = clock.getDelta();
    // if ( mixer ) mixer.update( delta );
    render();
    stats.update();
}

function render() {
    pointerman.update();
    renderer.render(scene, camera);
}