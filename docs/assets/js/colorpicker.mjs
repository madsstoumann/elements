/**
 * ColorPicker
 * @module /assets/js/colorpicker
 * @requires /assets/js/colorlib
 * @version 0.0.7
 * @summary 15-12-2020
 * @description Color Picker
 * @example
 * <input type="color|text" data-colorpicker="rgba" />
 */

import { brightness, cmyk2rgb, rgb2arr, rgb2cmyk, rgb2hex, rgb2hsl } from './colorlib.mjs'
export default class ColorPicker {
	constructor(element, settings) {
		this.settings = Object.assign({
			colorpicker: 'rgba',
			defaultColor: '#FF0000',
			eventSetColor: 'eventSetColor',
			lblAlpha: 'Alpha',
			lblBrightness: 'Brightness',
			lblCancel: 'Cancel',
			lblHue: 'Hue',
			lblLightness: 'Lightness',
			lblOK: 'OK',
			lblSaturation: 'Saturation'
		}, settings);
		this.init(element);
	}

	/**
	 * @function clickOutside
	 * @param {Event} event
	 * @description Detects click outside input or list
	 */
	clickOutside(event) {
		const element = event.target;
		if (!this.app.contains(element)) {
			if (element !== this.trigger) {
				this.toggle(false);
			}
		}
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

		if (element.type === 'range') {
			this.elements.app.style.setProperty(`--${element.dataset.elm}`,`${element.value}${element.dataset.suffix || ''}`);
			this.setColor(this.elements.selected, false);
		}
		else {
			let color;
			let updateCMYK = true;
			let updateHEX = true;
			let updateHSL = true;
			let updateRGB = true;

			switch(element.dataset.elm) {
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
				case 'cmyC': case 'cmyM' : case 'cmyY' : case 'cmyK':
					color = cmyk2rgb(this.elements.cmyC.value, this.elements.cmyM.value, this.elements.cmyY.value, this.elements.cmyK.value);
					this.elements.sample.style.background = `rgba(${color.r},${color.g},${color.b},1)`;
					updateCMYK = false;
					break;
				default: return;
			}
			this.setColor(this.elements.sample, true, updateHSL, updateRGB, updateHEX, updateCMYK);
		}
	}

	/**
	* @function init
	* @param {Node} element
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	init(element) {
		this.display = 'full';
		this.output = 'hex';
		this.trigger = element;
		this.trigger.setAttribute('readonly', 'readonly');

		if (this.settings.colorpicker.includes('cmyk')) { this.output = 'cmyk'; }
		if (this.settings.colorpicker.includes('hsl')) { this.output = 'hsl'; }
		if (this.settings.colorpicker.includes('rgb')) { this.output = 'rgb'; }
		if (this.settings.colorpicker.includes('micro')) { this.display = 'micro'; }
		if (this.settings.colorpicker.includes('mini')) { this.display = 'mini'; }

		this.app = document.createElement('div');
		this.app.dataset.cp = false;
		this.app.innerHTML = this.template();
		this.bindOutsideClick = this.clickOutside.bind(this);
		this.elements = {};
		this.app.querySelectorAll(`[data-elm]`).forEach(elm => {
			this.elements[elm.dataset.elm] = elm;
		});

		/* Add eventListeners */
		this.elements.app.addEventListener('keydown', (event) => {
			if (event.key === 'Enter') {this.setTrigger()}
			if (event.key === 'Escape') {this.toggle(false)}
		});
		this.elements.app.addEventListener('input', this.handleInput.bind(this));
		this.elements.cancel.addEventListener('click', () => {return this.toggle(false)})
		this.elements.ok.addEventListener('click', () => {return this.setTrigger()})
		this.trigger.addEventListener('pointerdown', () => {return this.toggle()});
		this.trigger.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowDown') {this.toggle();}
			if (event.key === 'Escape') {this.toggle(false);}
		});

		this.trigger.parentNode.insertBefore(this.app, this.trigger.nextSibling);
		this.setColorFromTrigger();
		this.setTrigger();
	}

/**
	* @function setColor
	* @param {Node} element
	* @param {Boolean} updateProps If `true`: update CSS Custom Props and range-sliders.value
	* @param {Boolean} updateHSL If `true`: update HSLA inputs
	* @param {Boolean} updateRGB If `true`: update RGBA inputs
	* @param {Boolean} updateHEX If `true`: update HEX input
	* @param {Boolean} updateCMYK If `true`: update CMYK input
	* @description Sets current color from swatch/range or default CSS Custom Props.
	*/
	setColor(element = this.elements.selected, updateProps = true, updateHSL = true, updateRGB = true, updateHEX = true, updateCMYK = true) { 
		const rgb = this.getBGC(element);
		const [r, g, b, alpha] = rgb2arr(rgb);
		const [c, m, y, k] = rgb2cmyk(r, g, b);
		const [h, s, l] = updateProps ? rgb2hsl(r, g, b) : [this.elements.hue.value, this.elements.saturation.value, this.elements.lightness.value];
		const a = parseFloat(alpha, 10) || 1;
		let value;

		if (updateProps) {
		/* Set CSS Custom Props */
			this.elements.app.style.setProperty(`--hue`,`${h}`);
			this.elements.app.style.setProperty(`--saturation`,`${s}%`);
			this.elements.app.style.setProperty(`--lightness`,`${l}%`);
			this.elements.app.style.setProperty(`--alpha`,`${a}`);

			/* Set range-sliders */
			this.elements.hue.value = h;
			this.elements.saturation.value = s;
			this.elements.lightness.value = l;
			this.elements.alpha.value = a;
		}

		/* Set CMYK inputs */
		if (updateCMYK) {
			this.elements.cmyC.value = parseInt(c, 10);
			this.elements.cmyM.value = parseInt(m, 10);
			this.elements.cmyY.value = parseInt(y, 10);
			this.elements.cmyK.value = parseInt(k, 10);
		}

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
		this.rgba = `rgba(${this.elements.rgbR.value},${this.elements.rgbG.value},${this.elements.rgbB.value},${this.elements.rgbA.value})`;

		switch(this.output) {
			case 'cmyk': value = `device-cmyk(${this.elements.cmyC.value}%,${this.elements.cmyM.value}%,${this.elements.cmyY.value}%,${this.elements.cmyK.value}%)`; break;
			case 'hsl': value = `hsl(${this.elements.hslH.value},${this.elements.hslS.value}%,${this.elements.hslL.value}%,${this.elements.hslA.value})`; break;
			case 'rgb': value = this.rgba; break;
			default: value = this.elements.hex.value; break;
		}
		this.value = value;
	}

	/**
	* @function setColorFromTrigger
	* @description Sets color from trigger value / default color
	*/
	setColorFromTrigger() {
		this.elements.sample.style.backgroundColor = this.trigger.value || this.settings.defaultColor;
		this.setColor(this.elements.sample);
	}

	/**
	* @function setTrigger
	* @description Sets trigger value to selected color
	*/
	setTrigger(){
		this.trigger.value = this.value;
		this.trigger.style.setProperty(`--cp-bgc`,`${this.rgba}`);
		this.trigger.style.setProperty(`--cp-c`,`${this.elements.luminance.value < 128 ? '#FFF' : '#000'}`);
		this.trigger.dispatchEvent(new CustomEvent(this.settings.eventSetColor, { detail: this.value }));
		this.toggle(false);
	}

	/**
	* @function template
	* @description Renders main template for ColorPicker
	*/
	template() {
		return `
		<form data-elm="app" data-cp-display="${this.display}">
			<label aria-label="${this.settings.lblHue}">
				<input type="range" class="c-rng" min="0" max="360" value="0" data-elm="hue" />
			</label>
			<div data-cp-inner>
				<div>
					${this.display === 'full' ? `<div data-elm="selected"></div>` : ''}
					<label>
						<input type="range"class="c-rng" min="0" max="100" value="100" data-elm="saturation" data-suffix="%" aria-label="${this.settings.lblSaturation}" />
					</label>
					<label>
						<input type="range" class="c-rng" min="0" max="100" value="50" data-elm="lightness" data-suffix="%" aria-label="${this.settings.lblLightness}" />
					</label>
					<label ${this.display === 'micro' ? ` hidden` : ''}>
						<input type="range" class="c-rng" min="0" max="1" step="0.01" value="1" data-elm="alpha" aria-label="${this.settings.lblAlpha}" ${this.display === 'alpha' ? ` disabled` : ''} />
					</label>
				</div>
				<div>
					<div ${this.display === 'full' ? `` : ` hidden`}>
						<fieldset ${this.display === 'full' ? `` : ` disabled`}>
							<label><input type="number" min="0" max="255" size="3" data-elm="rgbR" />R</label>
							<label><input type="number" min="0" max="255" size="3" data-elm="rgbG" />G</label>
							<label><input type="number" min="0" max="255" size="3" data-elm="rgbB" />B</label>
							<label><input type="number" min="0" max="1" step="0.01" size="3" data-elm="rgbA" />A</label>
						</fieldset>
						<fieldset ${this.display === 'full' ? `` : ` disabled`}>
							<label><input type="number" min="0" max="360" size="3" data-elm="hslH" />H</label>
							<label><input type="number" min="0" max="100" size="3" data-elm="hslS" />S</label>
							<label><input type="number" min="0" max="100" size="3" data-elm="hslL" />L</label>
							<label><input type="number" min="0" max="1" step="0.01" size="3" data-elm="hslA" />A</label>
						</fieldset>
						<fieldset ${this.display === 'full' ? `` : ` disabled`}>
							<label><input type="number" min="0" max="100" size="3" data-elm="cmyC" />C</label>
							<label><input type="number" min="0" max="100" size="3" data-elm="cmyM" />M</label>
							<label><input type="number" min="0" max="100" size="3" data-elm="cmyY" />Y</label>
							<label><input type="number" min="0" max="100" size="3" data-elm="cmyK" />K</label>
						</fieldset>
						<fieldset ${this.display === 'full' ? `` : ` disabled`}>
							<label><input type="text" data-elm="hex" size="9" />HEX/A</label>
							<label><input type="text" data-elm="luminance" size="3" readonly />${this.settings.lblBrightness}</label>
						</fieldset>
						<div class="u-hidden" data-elm="sample"></div>
					</div>
					${this.display === 'full' ? `` : `<div data-elm="selected"></div>`}
					<nav>
						<button type="button" data-elm="cancel">${this.settings.lblCancel}</button>
						<button type="button" data-elm="ok">${this.settings.lblOK}</button>
					</nav>
				</div>
			</div>
		</form>`
	}

	/**
	* @function toggle
	* @param {Boolean} open
	* @description Shows/hides the ColorPicker
	*/
	toggle(open = true) {
		if (open) {
			document.addEventListener('click', this.bindOutsideClick);
			const rect = this.trigger.getBoundingClientRect();
			this.app.style.left = `${rect.left}px`;
			this.app.style.top = `${rect.bottom}px`;
			this.setColorFromTrigger();
			this.app.dataset.cp = true;
			this.elements.hue.focus();
		}
		else {
			document.removeEventListener('click', this.bindOutsideClick);
			this.app.dataset.cp = false;
			this.trigger.focus();
		}
	}
}