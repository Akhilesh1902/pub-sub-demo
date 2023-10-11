import './style.css';

import * as THREE from 'three';
import generateUI from './ui';
import setupScene from './setupScene';
import generateFurniture from './furniture';

generateUI();
const { scene, renderer, camera, controls } = setupScene();
scene.background = new THREE.Color(0x000);

scene.add(
  new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.1, 10),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  )
);

async function loadFurniture() {
  const { scene: modelScene } = await generateFurniture();
  scene.add(modelScene);
}
loadFurniture();

function tick() {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(tick);
}
tick();
// console.log(THREE);

type CreateLightProps = {
  position: THREE.Vector3;
  name: string;
  id: number;
  color: THREE.Color;
};
