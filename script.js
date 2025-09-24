import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 3);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const loader = new GLTFLoader();
loader.load('LeePerrySmith.glb', (gltf) => {
  gltf.scene.scale.set(1.5, 1.5, 1.5);
  scene.add(gltf.scene);
}, undefined, (error) => console.error(error));

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
