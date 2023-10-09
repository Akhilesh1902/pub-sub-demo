import elementFromHtmlString from './elementFronString';

import PubSub from 'pubsub-js';
import { GreenLightEvent } from './pubsubEvents';

export default function generateUI() {
  const UIContainer = document.querySelector('.UI-container');

  const checkbox = createCheckboc('greenLight')!;
  const checkbox2 = createCheckboc('greenLight2')!;

  UIContainer?.appendChild(checkbox);
  UIContainer?.appendChild(checkbox2);

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
      PubSub.publish(GreenLightEvent, e.target.checked);
    });
  });

  PubSub.subscribe(GreenLightEvent, (_, msg: boolean) => {
    // console.log(toggle, msg);
    [toggle, toggle2].forEach((tog) => {
      if (tog) tog.checked = msg;
    });
    // if (toggle) toggle.checked = msg;
  });
}
