/**
 * ColorPicker module.
 * @module /assets/js/colorpicker
 * @requires /assets/js/common
 * @version 0.0.1
 * @summary 25-11-2020
 * @description Color Picker
 * @example
 * <section data-js="colorpicker"
 */

import { brightness, rgb2arr, rgb2cmyk, rgb2hex, rgb2hsl } from './colorlib.mjs'
import { mergeArrayOfObjects, stringToType, uuid } from './common.mjs';
import Dialog from './dialog.mjs';

export default class ColorPicker {
	constructor(element, settings) {
		this.settings = Object.assign({
			eventAddColor: 'eventAddColor',
			eventDelColor: 'eventDelColor',
			eventSetColor: 'eventSetColor',
			gradient: {
				angle: 90, 
				stops: [],
				type: 'linear-gradient'
			},
			lblAddStop: 'Add current color',
			lblAddToSwatches: 'Add to swatches',
			lblAlpha: 'Alpha',
			lblAngle: 'Angle',
			lblBrightness: 'Brightness',
			lblColorDelete: '✕',
			lblColorDeleteQuery: 'Delete color-stop?',
			lblColorHint: 'Color/Hint',
			lblColorStop: 'Stop',
			lblDialogCancel: 'Cancel',
			lblDialogOK: 'Insert',
			lblGradient: 'Gradient',
			lblGradientReset: 'Reset',
			lblGradientType: 'Gradient type',
			lblHue: 'Hue',
			lblLightness: 'Lightness',
			lblOverwrite: 'Overwrite existing swatch?',
			lblReset: '↺',
			lblSaturation: 'Saturation',
			lblSolid: 'Solid',
			lblSwatchName: 'Swatch name',
			lblSwatches: 'Swatches',
			
			storageKey: 'color-picker',
			svgTransparent: `url('data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="5" height="5" fill="grey" /><rect x="5" y="5" width="5" height="5" fill="grey" /><rect x="5" y="0" width="5" height="5" fill="white" /><rect x="0" y="5" width="5" height="5" fill="white" /></svg>')`,
			
			valueFormat: 'hex',
			useLocalStorage: true
		}, stringToType(settings));

		this.initColorPicker(element);
	}

	/**
	* @function getBGC
	* @param {Node} element
	* @description Get computed background-color for selected element
	*/
	getBGC(element) {
		return window.getComputedStyle(element).getPropertyValue('background-color');
	}

	/**
	* @function handleInput
	* @param {Event} event
	* @description Handle main form input. Triggers when a user moves a range-slider or changes an input value.
	*/
	handleInput(event) {
		const element = event.target;
		let index = 0;
		/* If range-slider, set related CSS Custom prop */
		if (element.type === 'range') {
			this.elements.picker.style.setProperty(`--${element.dataset.elm}`,`${element.value}${element.dataset.suffix || ''}`);
			this.setColor(this.elements.selected, false);
		}
		else {
			let updateHEX = true;
			let updateHSL = true;
			let updateRGB = true;

			switch(element.dataset.elm) {
				case 'gradientAngle':
					this.settings.gradient.angle = element.value;
					this.renderGradient();
					return;
				case 'gradientStop':
					index = parseInt(element.dataset.index, 10);
					this.settings.gradient.stops[index].stop = element.value || '';
					this.renderGradient();
					return;
				case 'gradientStopColor':
					index = parseInt(element.dataset.index, 10);
					this.settings.gradient.stops[index].color = element.value || '';
					this.renderGradient();
					return;
				case 'gradientType':
					this.settings.gradient.type = element.value;
					this.renderGradient();
					return;
				case 'hex':
					this.elements.sample.style.background = element.value;
					updateHEX = false;
				break;
				case 'hslH': case 'hslS': case 'hslL': case 'hslA':
					this.elements.sample.style.background = `hsla(${this.elements.hslH.value},${this.elements.hslS.value}%,${this.elements.hslL.value}%,${this.elements.hslA.value})`;
					updateHSL = false;
					break;
				case 'rgbR': case 'rgbG': case 'rgbB': case 'rgbA':
					this.elements.sample.style.background = `rgba(${this.elements.rgbR.value},${this.elements.rgbG.value},${this.elements.rgbB.value},${this.elements.rgbA.value})`;
					updateRGB = false;
					break;
				case 'swatchName':
					this.elements.add.disabled = element.value === '';
					return;
				default: return;
			}
			this.setColor(this.elements.sample, true, updateHSL, updateRGB, updateHEX);
		}
	}

	/**
	* @function initColorPicker
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	initColorPicker(elm) {
		this.isPopup = elm.tagName === 'INPUT';
		this.uuid = uuid();
		this.app = this.isPopup ? document.createElement('div') : elm;
		this.app.innerHTML = this.template(this.isPopup);
		elm.__colorpickerId = this.uuid;
		this.elements = {};
		this.clickTimer = null;
		this.clickTimerDuration = 800;

		this.app.querySelectorAll(`[data-elm]`).forEach(element => {
			this.elements[element.dataset.elm] = element;
		});

		/* Add eventListeners */
		this.elements.picker.addEventListener('input', this.handleInput.bind(this));
		this.elements.selected.addEventListener('click', (event) => {return this.copySwatch(event.target)});


		if (this.isPopup) {
			this.dialog = new Dialog({
				accept: this.settings.lblDialogOK,
				cancel: this.settings.lblDialogCancel,
				clsDialog: 'c-dialog c-clp__dialog',
				element: this.app,
				id: this.uuid
			});

			this.trigger = elm;
			this.trigger.addEventListener('click', (event) => {
				this.setDialog(event);
			});
			this.trigger.addEventListener('keydown', (event) => {
				if (event.key === ' ') { this.setDialog(event); }
			});

			this.setTrigger();
		}

		/* Set initial color */
		// this.setColor(this.elements.selected);
	}

	/**
	* @function setColor
	* @param {Node} element
	* @param {Boolean} updateProps If `true`: update CSS Custom Props and range-sliders.value
	* @param {Boolean} updateHSL If `true`: update HSLA inputs
	* @param {Boolean} updateRGB If `true`: update RGBA inputs
	* @param {Boolean} updateHEX If `true`: update HEX input
	* @description Sets current color from swatch/range or default CSS Custom Props.
	*/
	setColor(element, updateProps = true, updateHSL = true, updateRGB = true, updateHEX = true) {
		const gradientObj = element.dataset.swatchObj;
		const key = element.dataset.swatchKey;
		let swatchName = '';

		if (gradientObj) {
			this.elements.colorGradient.checked = true;
			this.settings.gradient = JSON.parse(gradientObj);
			this.elements.colorStops.innerHTML = this.templateColorStops();
			this.elements.gradientAngle.value = this.settings.gradient.angle;
			this.elements.gradientType.value = this.settings.gradient.type;
			this.renderGradient();
		}
		else {
			if (element !== this.elements.selected) {
				this.elements.colorSolid.checked = true;
			}
			const rgb = this.getBGC(element);
			const [r, g, b, alpha] = rgb2arr(rgb);
			const [c, m, y, k] = rgb2cmyk(r, g, b);
			const [h, s, l] = updateProps ? rgb2hsl(r, g, b) : [this.elements.hue.value, this.elements.saturation.value, this.elements.lightness.value];
			const a = parseFloat(alpha, 10) || 1;

			if (updateProps) {
			/* Set CSS Custom Props */
				this.elements.picker.style.setProperty(`--hue`,`${h}`);
				this.elements.picker.style.setProperty(`--saturation`,`${s}%`);
				this.elements.picker.style.setProperty(`--lightness`,`${l}%`);
				this.elements.picker.style.setProperty(`--alpha`,`${a}`);

				/* Set range-sliders */
				this.elements.hue.value = h;
				this.elements.saturation.value = s;
				this.elements.lightness.value = l;
				this.elements.alpha.value = a;
			}

			/* Set CMYK inputs */
			/* TODO */
			// if (updateCMYK) {
				this.elements.cmyC.value = parseInt(c, 10);
				this.elements.cmyM.value = parseInt(m, 10);
				this.elements.cmyY.value = parseInt(y, 10);
				this.elements.cmyK.value = parseInt(k, 10);
			// }

			/* Set HSL inputs */
			if (updateHSL) {
				this.elements.hslH.value = parseInt(h, 10);
				this.elements.hslS.value = parseInt(s, 10);
				this.elements.hslL.value = parseInt(l, 10);
				this.elements.hslA.value = a;
			}

			/* Set RGB inputs */
			if (updateRGB) {
				this.elements.rgbR.value = parseInt(r, 10);
				this.elements.rgbG.value = parseInt(g, 10);
				this.elements.rgbB.value = parseInt(b, 10);
				this.elements.rgbA.value = a;
			}

			if (updateHEX) {
				this.elements.hex.value = rgb2hex(rgb);
			}

			this.elements.luminance.value = brightness(r, g, b) || 0;
		}

		if (key) {
			const swatchIndex = this.findSwatch(key);
			if (swatchIndex > -1) {
				swatchName = this.settings.swatches.values[swatchIndex].name;
			}
		}
		this.elements.swatchName.value = swatchName;
	}

	/**
	* @function setDialog
	* @description Open dialog, handle promise
	*/
	setDialog(event) {
		event.preventDefault();
		this.dialog.show().then((value) => {
			if (value) {
				this.setTrigger(this.elements.hex.value, true);
			}
			this.trigger.focus();
		});
	}



	/**
	* @function setTrigger
	* @paramn {String} color
	* @param {Boolean} sendEvent
	* @description Sets a trigger-input to selected color
	*/
	setTrigger(color = this.trigger.value || '#000000', sendEvent = false) {
		this.elements.sample.style.background = color;
		this.setColor(this.elements.sample, true);
		const obj = {
			alpha: this.elements.alpha.value - 0,
			color: this.elements.luminance.value > 127 || this.elements.alpha.value - 0 < 0.6 ? '#000' : '#FFF',
			hex: color,
			hsla: `hsla(${this.elements.hslH.value}, ${this.elements.hslS.value}, ${this.elements.hslL.value}, ${this.elements.hslA.value})`,
			luminance: this.elements.luminance.value - 0,
			rgba: `rgba(${this.elements.rgbR.value}, ${this.elements.rgbG.value}, ${this.elements.rgbB.value}, ${this.elements.rgbA.value})`
		};
		if (this.trigger.type !== 'color') {
			this.trigger.style.background = `${this.settings.svgTransparent} 0 0/1rem 1rem`;
			this.trigger.style.boxShadow = `inset 0 0 0 1000px ${color}`;
			this.trigger.style.color = obj.color;
			switch (this.settings.valueFormat) {
				case 'hsl':
					this.trigger.value = obj.hsla;
					break;
				case 'rgb':
					this.trigger.value = obj.rgba;
					break;
				default: break;
			}
		}
		else {
			this.trigger.value = color;
		}
		if (sendEvent) {
			this.trigger.dispatchEvent(new CustomEvent(this.settings.eventSetColor, { detail: obj }));
		}
	}

	/**
	* @function template
	* @param {Boolean} isPopup Stand-alone or popup/picker-mode
	* @description Renders main template for ColorPicker
	*/
	template(isPopup) {
		return `
		<form class="c-clp" data-elm="picker">
			<label>${this.settings.lblHue}
				<input type="range" class="c-rng" min="0" max="360" value="0" data-elm="hue" />
			</label>

			<div class="c-clp__inner">
				<div class="c-clp__ranges">
					<div data-elm="selected"></div>
					<label>${this.settings.lblSaturation}
						<input type="range"class="c-rng" min="0" max="100" value="100" data-elm="saturation" data-suffix="%" />
					</label>
					<label>${this.settings.lblLightness}
						<input type="range" class="c-rng" min="0" max="100" value="50" data-elm="lightness" data-suffix="%" />
					</label>
					<label>${this.settings.lblAlpha}
						<input type="range" class="c-rng" min="0" max="1" step="0.01" value="1" data-elm="alpha" />
					</label>
				</div>

				<div class="c-clp__inputs">
					<input type="radio" id="cp-solid${this.uuid}" name="cp-solid-gradient" class="u-hidden" value="solid" data-elm="colorSolid" checked ${this.isPopup ? `tabindex="-1"` : ''}>
					<input type="radio" id="cp-gradient${this.uuid}" name="cp-solid-gradient" class="u-hidden" value="gradient" data-elm="colorGradient" ${this.isPopup ? `tabindex="-1"` : ''}>
					${!isPopup ? `
					<div class="c-clp__fieldset">
						<label class="c-clp__label-group" for="cp-solid${this.uuid}" data-for="colorSolid">${this.settings.lblSolid}</label>
						<label class="c-clp__label-group" for="cp-gradient${this.uuid}" data-for="colorGradient">${this.settings.lblGradient}</label>
					</div>

					<div class="c-clp__fieldset" data-state="gradient">
						<div data-elm="gradient"></div>
						<label class="c-clp__label">	
							<select data-elm="gradientType">
								<option value="linear-gradient">linear</option>
								<option value="repeating-linear-gradient">repeating-linear</option>
								<option value="radial-gradient">radial</option>
								<option value="repeating-radial-gradient">repeating-radial</option>
								<option value="conic-gradient">conic</option>
							</select>
							${this.settings.lblGradientType}
						</label>
						<label class="c-clp__label c-clp__label--15"><input type="number" min="0" max="360" size="3" value="90" data-elm="gradientAngle" />${this.settings.lblAngle}</label>
						<label class="c-clp__label c-clp__label--10"><button type="button" data-elm="gradientReset" aria-label="${this.settings.lblGradientReset}">${this.settings.lblReset}</button>${this.settings.lblGradientReset}</label>
					</div>

					<div data-state="gradient" data-elm="colorStops"></div>

					<div class="c-clp__fieldset" data-state="gradient">
						<button type="button" data-elm="addStop">${this.settings.lblAddStop}</button>
					</div>` : ''}

					<div class="c-clp__fieldset" data-state="solid">
						<label class="c-clp__label"><input type="number" min="0" max="255" size="3" data-elm="rgbR" />R</label>
						<label class="c-clp__label"><input type="number" min="0" max="255" size="3" data-elm="rgbG" />G</label>
						<label class="c-clp__label"><input type="number" min="0" max="255" size="3" data-elm="rgbB" />B</label>
						<label class="c-clp__label"><input type="number" min="0" max="1" step="0.01" size="3" data-elm="rgbA" />A</label>
					</div>
					<div class="c-clp__fieldset" data-state="solid">
						<label class="c-clp__label"><input type="number" min="0" max="360" size="3" data-elm="hslH" />H</label>
						<label class="c-clp__label"><input type="number" min="0" max="100" size="3" data-elm="hslS" />S</label>
						<label class="c-clp__label"><input type="number" min="0" max="100" size="3" data-elm="hslL" />L</label>
						<label class="c-clp__label"><input type="number" min="0" max="1" step="0.01" size="3" data-elm="hslA" />A</label>
					</div>
					<div class="c-clp__fieldset" data-state="solid">
						<label class="c-clp__label"><input type="number" min="0" max="100" size="3" data-elm="cmyC" />C</label>
						<label class="c-clp__label"><input type="number" min="0" max="100" size="3" data-elm="cmyM" />M</label>
						<label class="c-clp__label"><input type="number" min="0" max="100" size="3" data-elm="cmyY" />Y</label>
						<label class="c-clp__label"><input type="number" min="0" max="100" size="3" data-elm="cmyK" />K</label>
					</div>
					<div class="c-clp__fieldset" data-state="solid">
						<label class="c-clp__label"><input type="text" data-elm="hex" size="9" data-lpignore="true" />HEX/A</label>
						<label class="c-clp__label"><input type="text" data-elm="luminance" size="3" readonly />${this.settings.lblBrightness}</label>
					</div>
					<div class="c-clp__fieldset"${this.isPopup ? ' hidden' : ''}>
						<label class="c-clp__label"><input type="text" data-elm="swatchName" data-lpignore="true" size="15" ${this.isPopup ? `tabindex="-1"` : ''} />${this.settings.lblSwatchName}</label>
					</div>
					

					<label><textarea class="u-hidden" data-elm="clipboard" tabindex="-1" aria-hidden="true"></textarea></label>
					<div class="u-hidden" data-elm="sample"></div>
				</div>
			</div>
	
		</form>`
	}


}