import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';

import { effectman  as params, layers } from './params';

export default class EffectManager {
    constructor(camera, renderer, scene) {
        this.renderer = renderer;
        this.scene = scene;
        // Materials
        this.materials = {};
        this.darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
        // Bloom layer
        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(layers.BLOOM_SCENE);
        // Render Pass
        const renderPass = new RenderPass( scene, camera );
        // Bloom Pass (Unreal)
        const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.outerHeight ), 1.5, 0.4, 0.85);
        bloomPass.threshold = params.bloomThreshold;
        bloomPass.strength = params.bloomStrength;
        bloomPass.radius = params.bloomRadius;
        // Bloom Composer
        this.bloomComposer = new EffectComposer(renderer);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(renderPass);
        this.bloomComposer.addPass(bloomPass);
        // SSAO Pass
        const ssaoPass = new SSAOPass(scene, camera, renderer.width, renderer.height);
        ssaoPass.kernelRadius = 2;
        ssaoPass.minDistance = 0;
        ssaoPass.maxDistance = 0.1;
        ssaoPass.kernelSize = 32;
        // Final Pass
        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: document.getElementById( 'vertexshader' ).textContent,
                fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
                defines: {}
            } ), "baseTexture"
        );
        finalPass.needsSwap = true;
        // Final Composer
        this.finalComposer = new EffectComposer(renderer);
        this.finalComposer.addPass(renderPass);
        this.finalComposer.addPass(ssaoPass);
        this.finalComposer.addPass(finalPass);
         // Events
         window.addEventListener('resize', this.onWindowResize.bind(this), false);
         this.onWindowResize();
    }
    render() {
        this.scene.traverse(this.darkenNonBloomed.bind(this));
        this.bloomComposer.render();
        this.scene.traverse(this.restoreMaterial.bind(this));
        this.finalComposer.render();
    }
    setSize(width, height) {
        this.bloomComposer.setSize(width*params.scale, height*params.scale);
        this.finalComposer.setSize(width*params.scale, height*params.scale);
    }
    darkenNonBloomed(obj) {
        if ( obj.isMesh && this.bloomLayer.test( obj.layers ) === false ) {
            this.materials[ obj.uuid ] = obj.material;
            obj.material = this.darkMaterial;
        }
    }
    restoreMaterial(obj) {
        if ( this.materials[ obj.uuid ] ) {
            obj.material = this.materials[ obj.uuid ];
            delete this.materials[ obj.uuid ];
        }
    }
    onWindowResize() {
        let w = window.innerWidth;
        let h = window.outerHeight;
        // Composers
        this.setSize(w, h);
        // render();
    }
}