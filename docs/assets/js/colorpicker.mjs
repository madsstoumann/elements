/**
 * ColorPicker module.
 * @module /assets/js/colorpicker
 * @requires /assets/js/common
 * @version 0.0.7
 * @summary 19-03-2020
 * @description Color Picker
 * @example
 * <section data-js="colorpicker">
 */

import { brightness, rgb2arr, rgb2hex, rgb2hsl } from './colorlib.mjs'
import { stringToType } from './common.mjs';

export default class ColorPicker {
	constructor(element, settings) {
		this.settings = Object.assign({
			clsColor: 'cp__color',
			clsColorGroup: 'cp__color-group',
			clsColorGroupHeadline: 'cp__color-group-headline',
			eventAddColor: 'eventAddColor',
			lblAddToSwatches: 'Add to swatches',
			lblAlpha: 'Alpha',
			lblBrightness: 'Brightness',
			lblHue: 'Hue',
			lblLightness: 'Lightness',
			lblSaturation: 'Saturation',
			lblSwatches: 'Swatches',
			groups: [
				{
					name: 'Generated Colors',
					open: true,
					subgroups: [
						{
							name: 'Primary/Complimentary',
							values: ['var(--cp-prm)', 'var(--cp-com)']
						},
						{
							name: 'Analogous',
							values: ['var(--cp-an1)', 'var(--cp-prm)', 'var(--cp-an2)']
						},
						{
							name: 'Triad',
							values: ['var(--cp-prm)', 'var(--cp-tr1)', 'var(--cp-tr2)']
						},
						{
							name: 'Split Complimentary',
							values: ['var(--cp-prm)', 'var(--cp-sc1)', 'var(--cp-sc2)']
						},
						{
							name: 'Rectangle',
							values: ['var(--cp-prm)', 'var(--cp-rc1)', 'var(--cp-com)', 'var(--cp-sc2)']
						},
						{
							name: 'Square',
							values: ['var(--cp-prm)', 'var(--cp-sq1)', 'var(--cp-com)', 'var(--cp-sq2)']
						},
						{
							name: 'Shades',
							values: ['var(--cp-sh1)', 'var(--cp-sh2)', 'var(--cp-sh3)', 'var(--cp-sh4)', 'var(--cp-sh5)', 'var(--cp-sh6)', 'var(--cp-sh7)', 'var(--cp-sh8)', 'var(--cp-sh9)']
						},
						{
							name: 'Tints',
							values: ['var(--cp-tn1)', 'var(--cp-tn2)', 'var(--cp-tn3)', 'var(--cp-tn4)', 'var(--cp-tn5)', 'var(--cp-tn6)', 'var(--cp-tn7)', 'var(--cp-tn8)', 'var(--cp-tn9)']
						}	
					]
				},
				{
					name: 'Color Libraries',
					subgroups: [
						{
							name: 'CSS Named Colors',
							values: ['black','dimgray','dimgrey','gray','grey','darkgray','darkgrey','silver','lightgray','lightgrey','gainsboro','whitesmoke','white','rosybrown','indianred','brown','firebrick','lightcoral','maroon','darkred','red','snow','salmon','mistyrose','tomato','darksalmon','orangered','coral','lightsalmon','sienna','chocolate','saddlebrown','seashell','sandybrown','peachpuff','peru','linen','darkorange','bisque','tan','burlywood','antiquewhite','navajowhite','blanchedalmond','papayawhip','moccasin','wheat','oldlace','orange','floralwhite','goldenrod','darkgoldenrod','cornsilk','gold','khaki','lemonchiffon','palegoldenrod','darkkhaki','beige','lightgoldenrodyellow','olive','yellow','lightyellow','ivory','olivedrab','yellowgreen','darkolivegreen','greenyellow','lawngreen','chartreuse','darkseagreen','forestgreen','limegreen','lightgreen','palegreen','darkgreen','green','lime','honeydew','seagreen','mediumseagreen','springgreen','mintcream','mediumspringgreen','mediumaquamarine','aquamarine','turquoise','lightseagreen','mediumturquoise','darkslategray','darkslategrey','paleturquoise','teal','darkcyan','aqua','cyan','lightcyan','azure','darkturquoise','cadetblue','powderblue','lightblue','deepskyblue','skyblue','lightskyblue','steelblue','aliceblue','slategray','slategrey','lightslategray','lightslategrey','dodgerblue','lightsteelblue','cornflowerblue','royalblue','midnightblue','lavender','navy','darkblue','mediumblue','blue','ghostwhite','darkslateblue','slateblue','mediumslateblue','mediumpurple','rebeccapurple','blueviolet','indigo','darkorchid','darkviolet','mediumorchid','thistle','plum','violet','purple','darkmagenta','fuchsia','magenta','orchid','mediumvioletred','deeppink','hotpink','palevioletred','lavenderblush','crimson','pink','lightpink']
						},
						{
							name: 'Websafe',
							values: ['#001F3F','#0074D9','#7FDBFF','#39CCCC','#3D9970','#2ECC40','#01FF70','#FFDC00','#FF851B','#FF4136','#F012BE','#B10DC9','#85144B','#FFFFFF','#DDDDDD','#AAAAAA','#111111']
						},
						{
							name: 'CSS System Colors',
							values: ['Canvas','CanvasText','LinkText','VisitedText','ActiveText','ButtonFace','ButtonText','Field','FieldText','Highlight','HighlightText']
						}
					]
				}
			],
			swatches: {
				name: 'Swatches',
				open: true,
				values: [
					{ 
						name: 'Primary',
						value: 'crimson'
					}
				]
			},
		}, stringToType(settings));

		this.app = element;
		this.initColorPicker();
	}

	/**
	* @function addSwatch
	* @description Adds a swatch to Custom Swatches
	*/
	addSwatch() {
		/* TODO: WIP */
		const color = {
			// eslint-disable-next-line no-alert
			name: window.prompt('Name'),
			value: this.elements.hex.value
		}
		this.settings.swatches.values.push(color);
		this.app.dispatchEvent(new CustomEvent(this.settings.eventAddColor, { detail: JSON.stringify(color) }));
		this.elements.swatches.innerHTML = this.templateColorSubGroup(this.settings.swatches.values);
	}

	/**
	* @function copySwatch
	* @param {Event} event
	* @description Copies a swatch-color-string to the clipboard
	*/
	copySwatch(element) {
		const rgb = this.getBGC(element);
		this.elements.clipboard.value = rgb2hex(rgb);
		this.elements.clipboard.select();
		document.execCommand('copy');
	}

	/**
	* @function editSwatch
	* @param {Node} element
	* @description Edits a color-swatch
	*/
	editSwatch(element) {
		// eslint-disable-next-line
		console.log(element);
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
				default: break;
			}
			this.setColor(this.elements.sample, true, updateHSL, updateRGB, updateHEX);
		}
	}

	/**
	* @function initColorPicker
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	initColorPicker() {
		this.app.innerHTML = this.template();
		this.elements = {};
		this.clickTimer = null;
		this.clickTimerDuration = 800;
		this.app.querySelectorAll(`[data-elm]`).forEach(element => {
			this.elements[element.dataset.elm] = element;
		});

		/* Add eventListeners */
		this.elements.add.addEventListener('click', () => { this.addSwatch() });
		this.elements.picker.addEventListener('input', this.handleInput.bind(this));
		this.elements.colors.addEventListener('keydown', this.keyDown.bind(this));
		this.elements.colors.addEventListener('pointerdown', this.pointerDown.bind(this));
		this.elements.colors.addEventListener('pointerup', this.pointerUp.bind(this));

		/* Set initial color */
		this.setColor(this.elements.selected);
	}

	/**
	* @function keyDown
	* @paramn {Event} event
	* @description Copies the color of the curent swatch, when user press "Spacebar"
	*/
	keyDown(event) {
		const element = event.target;
		if (element.tagName === 'BUTTON') {
			switch (event.key) {
				case ' ': this.setColor(element); break;
				case 'e': this.editSwatch(element); break;
				default: break;
			}
		}
	}

	/**
	* @function pointerDown
	* @paramn {Event} event
	* @description Copies the color of the curent swatch, starts a clickTimer-callback for "long-click"
	*/
	pointerDown(event) {
		const element = event.target;
		if (element.tagName === 'BUTTON') {
			// this.copySwatch(element);
			this.setColor(element);
			if (!this.clickTimer) {
				this.clickTimer = setTimeout(() => { this.editSwatch(element) }, this.clickTimerDuration);
			}
		}
	}

	/**
	* @function pointerUp
	* @description Cancels this.clickTimer, if not null
	*/
	pointerUp() {
		if (this.clickTimer) {
			clearTimeout(this.clickTimer);
			this.clickTimer = null;
		}
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
		const rgb = this.getBGC(element);
		const [r, g, b, alpha] = rgb2arr(rgb);
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

	/**
	* @function template
	* @description Renders main template for ColorPicker
	*/
	template() {
		return `
		<form class="cp__picker" data-elm="picker">
			<label>${this.settings.lblHue}
				<input type="range" class="c-rng cp__hue" min="0" max="360" value="0" data-elm="hue" />
			</label>

			<div class="cp__inner">
				<div class="cp__ranges">
					<label>${this.settings.lblSaturation}
						<input type="range"class="c-rng cp__saturation" min="0" max="100" value="100" data-elm="saturation" data-suffix="%" />
					</label>

					<label>${this.settings.lblLightness}
						<input type="range" class="c-rng cp__lightness" min="0" max="100" value="50" data-elm="lightness" data-suffix="%" />
					</label>
		
					<label>${this.settings.lblAlpha}
						<input type="range" class="c-rng cp__alpha" min="0" max="1" step="0.01" value="1" data-elm="alpha" />
					</label>
				</div>

				<div class="cp__inputs">
					<div class="cp__selected" data-elm="selected"></div>
					<div class="cp__fieldset">
						<label class="cp__label"><input type="number" min="0" max="255" size="3" data-elm="rgbR" />R</label>
						<label class="cp__label"><input type="number" min="0" max="255" size="3" data-elm="rgbG" />G</label>
						<label class="cp__label"><input type="number" min="0" max="255" size="3" data-elm="rgbB" />B</label>
						<label class="cp__label"><input type="number" min="0" max="1" step="0.01" size="3" data-elm="rgbA" />A</label>
					</div>
					<div class="cp__fieldset">
						<label class="cp__label"><input type="number" min="0" max="360" size="3" data-elm="hslH" />H</label>
						<label class="cp__label"><input type="number" min="0" max="100" size="3" data-elm="hslS" />S</label>
						<label class="cp__label"><input type="number" min="0" max="100" size="3" data-elm="hslL" />L</label>
						<label class="cp__label"><input type="number" min="0" max="1" step="0.01" size="3" data-elm="hslA" />A</label>
					</div>
					<div class="cp__fieldset">
						<label class="cp__label"><input type="text" data-elm="hex" size="9" data-lpignore="true" />HEX/A</label>
						<label class="cp__label"><input type="text" data-elm="luminance" size="3" readonly />${this.settings.lblBrightness}</label>
					</div>
					<button type="button" data-elm="add">${this.settings.lblAddToSwatches}</button>

					<textarea data-elm="clipboard" tabindex="-1"></textarea>
					<div data-elm="sample"></div>
				</div>
			</div>

			<div data-elm="colors">
				${this.templateColorGroup(this.settings.swatches, 'swatches')}
				${this.settings.groups.map(group => { return this.templateColorGroup(group); }).join('')}
			</div>
		</form>`
	}

	/**
	* @function templateColor
	* @description Renders a single color-swatch
	*/
	templateColor(color) {
		const name = typeof color === 'object' ? color.name : color;
		const value = typeof color === 'object' ? color.value : color;
		return `<button type="button" class="${this.settings.clsColor}" style="background:${value}" title="${name}"></button>`;
	}

	/**
	* @function templateColorGroup
	* @description Renders a ColorGroup
	*/
	templateColorGroup(group, panel) {
		return `
		<details ${group.open ? 'open': ''}>
			<summary class="cp__summary"><span>${group.name}</span></summary>
			<div class="cp__panel" ${panel ? `data-elm="${panel}"`: ''}>
			${group.subgroups ?
				group.subgroups.map(subgroup => {
			return `
				<fieldset class="${this.settings.clsColorGroup}">
					<legend class="${this.settings.clsColorGroupHeadline}">${subgroup.name}</legend>
					${this.templateColorSubGroup(subgroup.values)}
				</fieldset>
			`}).join('') : this.templateColorSubGroup(group.values)
			}
			</div>
		</details>`
	}

	/**
	* @function templateColorSubGroup
	* @description Renders a color sub-group
	*/
	templateColorSubGroup(group) {
		return `${group.map(color => {
			return this.templateColor(color);
		}).join('')}`
	}
}