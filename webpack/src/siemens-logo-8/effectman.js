import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';

import { effectman  as params, layers } from './params';

export default class EffectManager {
    constructor(camera, renderer, scene) {
        this.camera = camera;
        this.renderer = renderer;
        this.scene = scene;
        // Materials
        this.materials = {};
        this.darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
        // Bloom layer
        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(layers.BLOOM_SCENE);
        // Render Pass
        this.renderPass = new RenderPass( this.scene, this.camera );
        // Bloom Pass (Unreal)
        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.outerHeight ), 1.5, 0.4, 0.85);
        this.bloomPass.threshold = params.bloom.threshold;
        this.bloomPass.strength = params.bloom.strength;
        this.bloomPass.radius = params.bloom.radius;
        // Bloom Composer
        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(this.renderPass);
        this.bloomComposer.addPass(this.bloomPass);
        // SSAO Pass
        this.ssaoPass = new SSAOPass(this.scene, this.camera, this.renderer.width, this.renderer.height);
        this.ssaoPass.kernelRadius = params.ssao.kernelRadius;
        this.ssaoPass.kernelSize = params.ssao.kernelSize;
        this.ssaoPass.minDistance = params.ssao.minDistance;
        this.ssaoPass.maxDistance = params.ssao.maxDistance;
        // Final Pass
        this.finalPass = new ShaderPass(
            new THREE.ShaderMaterial( {
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
                fragmentShader: `
                uniform sampler2D baseTexture;
                uniform sampler2D bloomTexture;

                varying vec2 vUv;

                void main() {
                    gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
                }`,
                defines: {},
            } ), "baseTexture"
        );
        this.finalPass.needsSwap = true;
        // Final Composer
        this.finalComposer = new EffectComposer(this.renderer);
        this.finalComposer.addPass(this.renderPass);
        this.finalComposer.addPass(this.ssaoPass);
        this.finalComposer.addPass(this.finalPass);
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
        let h = window.innerHeight;
        // Composers
        this.setSize(w, h);
        // render();
    }
}