import elementFromHtmlString from './elementFronString';

import PubSub from 'pubsub-js';
import {
  ActiveControl,
  ColorControl,
  DayNightToggle,
  GreenLightEvent,
  IntensityControl,
} from './pubsubEvents';

const UIContainer = document.querySelector('.UI-container');
export default function generateUI() {
  const checkbox = createCheckboc('greenLight')!;
  const checkbox2 = createCheckboc('greenLight2')!;

  function createCheckboc(name: string) {
    return elementFromHtmlString(`
<label for="${name}">
<input id="${name}" name="${name}"  type="checkbox" /> ${name}
</label>
`);
  }
  const toggle = checkbox.querySelector('input');
  const toggle2 = checkbox2.querySelector('input');

  [toggle, toggle2].forEach((tog) => {
    tog?.addEventListener('change', (e) => {
      //   console.log('clicked :', e.target.name);
      const target = e.target as HTMLInputElement;
      PubSub.publish(GreenLightEvent, target.checked);
    });
  });

  // pub-sub implimentation
  PubSub.subscribe(GreenLightEvent, (_, msg: boolean) => {
    // console.log(toggle, msg);
    [toggle, toggle2].forEach((tog) => {
      if (tog) tog.checked = msg;
    });
    // if (toggle) toggle.checked = msg;
  });
}

export function generateFurnitureUI() {}

function generateDayLightUI() {
  let isday = false;

  const btn = elementFromHtmlString(`
  <button class="bg-slate-600 p-2 rounded text-slate-100 capitalize text-center">${
    isday ? 'day' : 'night'
  }</button>
`) as HTMLButtonElement;

  UIContainer?.append(btn);

  btn.addEventListener('click', () => {
    isday = !isday;
    PubSub.publish(DayNightToggle, isday);
  });

  function toggleBtn(isday: boolean) {
    // console.log(isday);
    btn.innerText = isday ? 'day' : 'night';
  }

  PubSub.subscribe(DayNightToggle, (_, data) => {
    toggleBtn(data);
  });
}
generateDayLightUI();

type LightUIDataProps = {
  intensity: number;
  name: string;
  color: string;
  active: boolean;
};

const lightControlsDiv = document.createElement('div');

UIContainer?.appendChild(lightControlsDiv);

export function generateLightUI(data: LightUIDataProps) {
  // console.log(data);
  const lightControls = elementFromHtmlString(`
    <div class="flex gap-2 flex-col p-3 select-none">
      
    </div>
  `) as HTMLDivElement;

  const activeControl = elementFromHtmlString(`
  <label >
  <input type="checkbox" data-inputType="activeControl" class="w-4 h-4 "  name="${data.name}"/>
  ${data.name}
  </label>
  `) as HTMLInputElement;

  console.log(data.name, activeControl);
  const intensityControl = elementFromHtmlString(`
  <label>
  <input type="range" data-inputType="intensityControl" min="0" max="7" value="${data.intensity}" step="0.01" />
  intensity
  </label>
  `) as HTMLInputElement;

  const colorControl = elementFromHtmlString(`
  <label>
  <input type="color" value="#${data.color}" data-inputType="colorControl" />
  color
  </label>
  `) as HTMLInputElement;

  const controlWrapper = elementFromHtmlString(`
  <div class="flex items-center gap-3"></div>
  `) as HTMLDivElement;

  PubSub.subscribe(IntensityControl, (_, data) => {
    intensityControl.querySelector('input')!.value = data.intensity;
  });
  PubSub.subscribe(ActiveControl, (_, bool) => {
    activeControl.querySelector('input')!.value = bool;
  });
  PubSub.subscribe(DayNightToggle, (_, bool) => {
    activeControl.querySelector('input')!.checked = !bool;
  });

  const controlMap = [activeControl, intensityControl, colorControl].map(
    (i) => {
      i.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        // console.log(target, target.checked);
        const inputType = target?.dataset.inputtype;
        // console.log(inputType);
        switch (true) {
          case inputType === 'activeControl':
            PubSub.publish(ActiveControl, {
              active: target.checked,
            });
            break;
          case inputType === 'intensityControl':
            PubSub.publish(IntensityControl, {
              intensity: parseFloat(target.value),
            });
            break;
          case inputType === 'colorControl':
            PubSub.publish(ColorControl, target.value);
            break;
        }
      });
      return controlWrapper.appendChild(i);
    }
  );

  controlMap.forEach((i) => lightControls.appendChild(i));
  lightControlsDiv.appendChild(lightControls);
  console.log(data);
}
