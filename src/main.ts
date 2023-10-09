import './style.css';

import * as THREE from 'three';
import generateUI from './ui';
import setupScene from './setupScene';
import { GreenLightEvent } from './pubsubEvents';

generateUI();
const { scene, renderer, camera, controls } = setupScene();
console.log(scene);

scene.background = new THREE.Color(0x000);

scene.add(
  new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.1, 10),
    new THREE.MeshStandardMaterial({ color: 0xff00ff })
  )
);

setTimeout(() => {
  const { pointLight: greenLight, lightSphere: greenbulb } = createLight({
    position: new THREE.Vector3(1, 1, 1),
    name: 'light',
    id: 1,
    color: new THREE.Color(0x00ff00),
  });
  scene.add(greenLight, greenbulb);

  PubSub.subscribe(GreenLightEvent, (_, msg: boolean) => {
    greenLight.intensity = msg ? 30 : 0;
  });
}, 3000);

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

function createLight({ position, name, id, color }: CreateLightProps) {
  const pointLight = new THREE.PointLight(color, 30, 5, 1);
  pointLight.name = name + id;
  pointLight.position.copy(position);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 8, 8),
    new THREE.MeshStandardMaterial({ color: pointLight.color })
  );

  sphere.position.copy(pointLight.position);
  PubSub.publish(GreenLightEvent, true);

  return { pointLight, lightSphere: sphere };
}
