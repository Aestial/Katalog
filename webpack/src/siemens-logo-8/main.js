import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
            
import Stats from 'three/examples/jsm/libs/stats.module.js';

import SceneManager from './sceneman';
import PointerManager from './pointman';
import LogoManager from './logoman';

const container = document.getElementById("three-container");
const width = window.innerWidth; 
const height = window.innerHeight;
const aspectRatio = width / height;

let camera, stats;
let bloomLayer, bloomComposer, finalComposer, renderer;
let sceneman;
let logoman;
let pointerman;

const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
const materials = {};

const params = {
    exposure: 0.85,
    bloomStrength: 1.25,
    bloomThreshold: 0,
    bloomRadius: 0.5,
};

init();

function init() {
    // Bloom layer
    bloomLayer = new THREE.Layers();
    bloomLayer.set( BLOOM_SCENE );
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
    container.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 0.666;
    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.set(-8, 12, 8);
    // Pointer Manager
    pointerman = new PointerManager(camera);
    // Scene Manager
    sceneman = new SceneManager(renderer);   
    // LOGO Manager
    logoman = new LogoManager(pointerman, function (object) {
        sceneman.add(object);
        animate();
    });
    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 4, 0);
    controls.maxDistance = 25;
    controls.minDistance = 10;
    controls.update();
    // Render Pass
    const renderPass = new RenderPass( sceneman.scene, camera );
    // Bloom Pass (Unreal)
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.outerHeight ), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    // Bloom Composer
    bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderPass);
    bloomComposer.addPass(bloomPass);
    // Final Pass
    const finalPass = new ShaderPass(
        new THREE.ShaderMaterial( {
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            defines: {}
        } ), "baseTexture"
    );
    finalPass.needsSwap = true;
    // Final Composer
    finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderPass);
    finalComposer.addPass(finalPass);
    // Events
    window.addEventListener('resize', onWindowResize, false);
    // Stats
    stats = new Stats();
    stats.domElement.style.cssText = 'position:relative; top:-56px; left:0px;';
    container.appendChild(stats.dom);
    // Initialize actions
    onWindowResize();
    window.logoman = logoman;
}
function onWindowResize() {
    let w = getParentDivWidth();
    let h = getParentDivHeight();
    h = w / aspectRatio;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    // Composers
    bloomComposer.setSize(w, h);
    finalComposer.setSize(w, h);
    render();
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
}
function render() {
    pointerman.update();
    renderer.clear();
    sceneman.scene.traverse(darkenNonBloomed);
    bloomComposer.render();
    sceneman.scene.traverse(restoreMaterial);
    finalComposer.render();
    // renderer.render(sceneman.scene, camera);
    stats.update();
}
function darkenNonBloomed( obj ) {
    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {
        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;
    }
}
function restoreMaterial( obj ) {
    if ( materials[ obj.uuid ] ) {
        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];
    }
}