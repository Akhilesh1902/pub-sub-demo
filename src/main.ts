import './style.css';

import * as THREE from 'three';
import generateUI from './ui';
import setupScene from './setupScene';
import generateFurniture from './furniture';

generateUI();
const { scene, renderer, camera, controls } = setupScene();
scene.background = new THREE.Color(0x000);

const floor = new THREE.Mesh(
  new THREE.BoxGeometry(10, 0.1, 10),
  new THREE.MeshStandardMaterial({ color: 0xffffff })
);

floor.receiveShadow = true;

scene.add(floor);

async function loadFurniture() {
  const { scene: modelScene } = await generateFurniture();
  console.log('loading furniture');
  scene.add(modelScene);
  console.log(renderer.info);
}
loadFurniture();

function tick() {
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    controls.update();
    // console.log('here ');
  });
}
tick();
// console.log(THREE);

type CreateLightProps = {
  position: THREE.Vector3;
  name: string;
  id: number;
  color: THREE.Color;
};
