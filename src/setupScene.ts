import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function setupScene() {
  const canvasWrapper = document.querySelector('.canvas-container')!;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const camera = new THREE.PerspectiveCamera(
    60,
    canvasWrapper.clientWidth / canvasWrapper.clientHeight,
    0.1,
    1000
  );
  scene.add(camera);
  camera.position.set(0.01, 2.165, 4.73);
  // camera.updateMatrixWorld();

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(canvasWrapper.clientWidth, canvasWrapper.clientHeight);

  canvasWrapper.append(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1.5, 0);
  // controls.update();

  return {
    scene,
    renderer,
    camera,
    controls,
  };
}
