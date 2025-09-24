import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';

const container = document.getElementById('canvas-container');

// Scene & camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lights
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
hemi.position.set(0, 1, 0);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 7);
scene.add(dir);

// Load GLB model
const loader = new GLTFLoader();
let mixer;

loader.load('./LeePerrySmith.glb', (gltf) => {
    gltf.scene.scale.set(1.5, 1.5, 1.5);  // Adjust scale
    gltf.scene.position.set(0, 0, 0);    // Adjust position
    scene.add(gltf.scene);

    // Animations
    if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
            action.paused = true; // start paused
        });
    }
}, undefined, (error) => {
    console.error('Error loading GLB:', error);
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Mouseover to play/pause animations
renderer.domElement.addEventListener('mouseover', () => {
    if (mixer) mixer._actions.forEach(action => action.paused = false);
});
renderer.domElement.addEventListener('mouseout', () => {
    if (mixer) mixer._actions.forEach(action => action.paused = true);
});
