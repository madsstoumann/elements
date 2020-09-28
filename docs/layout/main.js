import { isTouch } from '../assets/js/const/isTouch.mjs';
import ControlPanel from '../assets/js/controlpanel.mjs';
import Layout from '../assets/js/layout.mjs';
import Slider from '../assets/js/slider.mjs';

import { fetchContent } from '../assets/js/common/fetchContent.mjs'
import { lazyLoad } from '../assets/js/common/lazyLoad.mjs';

/* Init Layout */
new Layout();

/* Init Sliders */
const sliders = document.querySelectorAll(`[data-section-type="slider"], [data-toggle-layout="slider"`);
sliders.forEach(slider => {
	const preview = slider.dataset.preview;
	if (!(isTouch && (preview === 'both' || preview === 'next'))) {
		new Slider(slider, slider.dataset);
	}
});

/* Init Control Panels */
const panels = document.querySelectorAll(`[data-control-panel]:not([data-control-panel=""])`);
panels.forEach(panel => {
	new ControlPanel(panel, panel.dataset);
});

/* Misc */
fetchContent(document.querySelectorAll(`[data-fetch-from]`));
lazyLoad();