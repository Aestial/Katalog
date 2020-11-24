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
        bloomPass.threshold = params.bloom.threshold;
        bloomPass.strength = params.bloom.strength;
        bloomPass.radius = params.bloom.radius;
        // Bloom Composer
        this.bloomComposer = new EffectComposer(renderer);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(renderPass);
        this.bloomComposer.addPass(bloomPass);
        // SSAO Pass
        const ssaoPass = new SSAOPass(scene, camera, renderer.width, renderer.height);
        ssaoPass.kernelRadius = params.ssao.kernelRadius;
        ssaoPass.kernelSize = params.ssao.kernelSize;
        ssaoPass.minDistance = params.ssao.minDistance;
        ssaoPass.maxDistance = params.ssao.maxDistance;
        // Final Pass
        const finalPass = new ShaderPass(
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
        let h = window.innerHeight;
        // Composers
        this.setSize(w, h);
        // render();
    }
}