import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import PointerManager from './pointerman';

const container = document.getElementById("three-container");
const width = window.innerWidth; 
const height = window.innerHeight;
const aspectRatio = width / height;

let camera, scene, renderer, stats;
let pointerman;

init();

function init() {
    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(60, 180, 80);
    // Pointer Manager
    pointerman = new PointerManager(camera);
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040506);
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
    // const axesHelper = new THREE.AxesHelper(100);
    // scene.add(axesHelper);
    
    // Hemisṕhere Light
    const hemiLight = new THREE.HemisphereLight(0x050505, 0x9f9f9f);
    hemiLight.position.set(0, 100, 0);
    scene.add(hemiLight);
    // Directional Light
    const dirLight = new THREE.DirectionalLight(0x7f7f7f, 0.75);
    dirLight.position.set(-100, 100, -100);
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
    // const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000 ), new THREE.MeshPhongMaterial( { color: 0x606060, depthWrite: false } ) );
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add( mesh );

    // Grid
    // const grid = new THREE.GridHelper(10000, 500, 0x7f7f7f, 0x7f7f7f);
    // grid.material.opacity = 0.5;
    // grid.material.transparent = true;
    // scene.add(grid);

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x505B68,
        roughness: 0.9,
        metalness: 0.15,
    });
    const displayMat = new THREE.MeshStandardMaterial({
        color: 0xffffa0,
        roughness: 0.4,
        metalness: 0.6,
    });
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.2,
        metalness: 0,
    });
    const labelMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.6,
        metalness: 0,
    });
    const labelBgMat = new THREE.MeshStandardMaterial({
        color: 0x008283,
        roughness: 1,
        metalness: 0,
    });
    const screenCoverMat = new THREE.MeshStandardMaterial({
        color: 0x2f2f2f,
        roughness: 0.065,
        metalness: 0,
        transparent: true,
        opacity: 0.5,
    });
    const buttonMat = new THREE.MeshStandardMaterial({
        color: 0x9CB7B4,
        roughness: 1,
        metalness: 0,
        envMapIntensity: 0.75,
    });
    const okButtonMat = new THREE.MeshStandardMaterial({
        color: 0x00A247,
        roughness: 1,
        metalness: 0,
        envMapIntensity: 0.75,
    });
    // Model
    const loader = new FBXLoader();
    loader.load(assets.model, function (object) {
        // Apply material and shadows
        object.traverse(function (child) {
            // console.log(child);
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // console.log(child.name);
            }            
            switch (child.name) {
                case "Body":
                    child.material = bodyMat;
                    break;
                case "Button-Ok":
                    child.material = okButtonMat;
                    pointerman.add(child);
                    break;
                case "Display":
                    child.material = displayMat;
                    break;
                case "Screen":
                    child.material = screenMat;
                    break;
                case "Label":
                    child.material = labelMat;
                    break;
                case "LabelBg":
                    child.material = labelBgMat;
                    break;
                case "ScreenCover":
                    child.material = screenCoverMat;
                    break;
                default:
                    child.material = buttonMat.clone();
                    pointerman.add(child);
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
    container.appendChild(renderer.domElement);
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 0.85;    
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
    return width;
}

function getParentDivHeight() {
    let height = window.outerHeight;
    return height;
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    pointerman.update();
    renderer.render(scene, camera);
}