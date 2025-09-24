import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';

let scene, camera, renderer, model, mixer, clock;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  clock = new THREE.Clock();

  const loader = new GLTFLoader();
  loader.load('model.glb', function (gltf) {
    model = gltf.scene;
    scene.add(model);

    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  });

  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  if (model) {
    const intersects = raycaster.intersectObject(model, true);
    document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}