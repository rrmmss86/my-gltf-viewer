import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';

const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Light
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
hemi.position.set(0, 1, 0);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(5, 10, 7);
scene.add(dir);

// Load model and animations
const loader = new GLTFLoader();
let mixer;
loader.load('model.glb', (gltf) => {
  scene.add(gltf.scene);
  if (gltf.animations && gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.play();
      action.paused = true; // Initially paused
    });
  }
}, undefined, (error) => {
  console.error('Error loading GLTF', error);
});

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
animate();

// Mouseover / mouseout control
renderer.domElement.addEventListener('mouseover', () => {
  if (mixer) {
    mixer._actions.forEach(action => action.paused = false);
  }
});
renderer.domElement.addEventListener('mouseout', () => {
  if (mixer) {
    mixer._actions.forEach(action => action.paused = true);
  }
});
