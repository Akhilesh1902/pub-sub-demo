import * as THREE from 'three';
import modelLoader from './modelLoader';
import { ActiveControl, ColorControl, IntensityControl } from './pubsubEvents';
import { globalState } from './setupScene';
import { generateLightUI } from './ui';

const lightState = {
  active: false,
  intensity: 2,
  color: '#ffd7aa',
};

export default async function generateFurniture() {
  const modelData = await modelLoader({
    Name: 'model',
    modelUrl:
      'https://d3t7cnf9sa42u5.cloudfront.net/compressed_models/Tables/Table_Automatic_01_v01.glb',
  });

  const tableLamp = modelData.scene.getObjectByName('Desktop_Lamp_Light002');

  // console.log(modelData, tableLamp);
  lightState.intensity = tableLamp.intensity;
  lightState.color = tableLamp.color.getHexString();
  tableLamp.intensity = 0;

  function genTableLampUI() {
    generateLightUI({
      ...lightState,
      name: 'tableLamp',
    });

    // pub-sub implimentation
    PubSub.subscribe(ActiveControl, (_, data) => {
      const isday = globalState.isday;
      if (isday) {
        tableLamp.intensity = 0;
        return;
      }
      tableLamp.intensity = data.active ? lightState.intensity : 0;
      lightState.active = data.active;
    });
    PubSub.subscribe(IntensityControl, (_, data) => {
      const isday = globalState.isday;
      if (isday) {
        tableLamp.intensity = 0;
        lightState.intensity = data.intensity;
        return;
      } else if (!lightState.active) {
        tableLamp.intensity = 0;
        lightState.intensity = data.intensity;
        return;
      }
      tableLamp.intensity = data.intensity;
      lightState.intensity = data.intensity;
    });
    PubSub.subscribe(ColorControl, (_, data) => {
      const isday = globalState.isday;
      if (isday) return;
      tableLamp.color = new THREE.Color(data);
      lightState.color = tableLamp.color.getHexString();
    });
  }
  genTableLampUI();
  return {
    scene: modelData.scene,
  };
}

export { lightState };
