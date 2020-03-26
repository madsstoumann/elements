/**
 * ColorPicker module.
 * @module /assets/js/colorpicker
 * @requires /assets/js/common
 * @version 0.1.4
 * @summary 26-03-2020
 * @description Color Picker
 * @example
 * <section data-js="colorpicker">
 * TODO: Reset gradient / remove name on color-switch, long-click to delete.
 */

import { brightness, rgb2arr, rgb2hex, rgb2hsl } from './colorlib.mjs'
import { stringToType } from './common.mjs';

export default class ColorPicker {
	constructor(element, settings) {
		this.settings = Object.assign({
			eventAddColor: 'eventAddColor',
			eventDelColor: 'eventDelColor',
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
			lblGradient: 'Gradient',
			lblGradientType: 'Gradient type',
			lblHue: 'Hue',
			lblLightness: 'Lightness',
			lblOverwrite: 'Overwrite existing swatch?',
			lblSaturation: 'Saturation',
			lblSolid: 'Solid',
			lblSwatchName: 'Swatch name',
			lblSwatches: 'Swatches',
			libraries: [
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
			storageKey: 'color-picker',
			swatches: {
				name: 'Swatches',
				open: true,
				values: []
			},
			useLocalStorage: true
		}, stringToType(settings));

		this.app = element;
		this.initColorPicker();
	}

		/**
	* @function addStop
	* @description Adds a color-stop to a gradient
	*/
	addStop() {
		const rgb = this.getBGC(this.elements.selected);
		this.settings.gradient.stops.push({
			color: rgb,
			stop: ''
		});
		this.elements.colorStops.innerHTML = this.templateColorStops();
		this.renderGradient();
	}

	/**
	* @function addSwatch
	* @description Adds a swatch to Custom Swatches
	*/
	addSwatch() {
		if (this.elements.swatchName.value) {
			const key = this.elements.swatchName.value.replace(' ', "-").toLowerCase();
			const isGradient = this.elements.colorGradient.checked && this.settings.gradient.stops.length > 0;
			const swatchIndex = this.findSwatch(key);
			const value = isGradient ? this.setGradient() : this.elements.hex.value;

			this.elements.swatchName.value = key;
			const color = {
				name: key,
				object: isGradient ? this.settings.gradient : '',
				value: value
			}

			if (swatchIndex > -1) {
				// eslint-disable-next-line no-alert
				if (!window.confirm(this.settings.lblOverwrite)) {
					return;
				}
				this.settings.swatches.values.splice(swatchIndex, 1, color);
			}
			else {
				this.settings.swatches.values.push(color);
			}
			this.app.dispatchEvent(new CustomEvent(this.settings.eventAddColor, { detail: JSON.stringify(color) }));
			this.renderSwatches();

			if (this.settings.useLocalStorage) {
				window.localStorage.setItem(this.settings.storageKey, JSON.stringify(this.settings.swatches.values));
			}
		}
	}

	/**
	* @function copySwatch
	* @description Copies a swatch-color-string to the clipboard
	*/
	copySwatch(element) {
		if (element === this.elements.selected) { 
			const rgb = this.getBGC(this.elements.selected);
			this.elements.clipboard.value = rgb2hex(rgb);
		}
		else {
			this.elements.clipboard.value = this.setGradient();
		}
		this.elements.clipboard.select();
		document.execCommand('copy');
	}

	/**
	* @function deleteStop
	* @param {Node} element
	* @description Delete a color-stop from gradient
	*/
	deleteStop(element) {
		const index = parseInt(element.dataset.index, 10);
		this.settings.gradient.stops.splice(index, 1);
		this.elements.colorStops.innerHTML = this.templateColorStops();
		this.renderGradient();
	}

	/**
	* @function deleteSwatch
	* @param {Node} element
	* @description Delete a color-swatch
	*/
	deleteSwatch(element) {
		const swatchIndex = this.findSwatch(element.dataset.swatchKey);
		if (swatchIndex > -1) {
			const color = this.settings.swatches.values[swatchIndex];
			this.settings.swatches.values.splice(swatchIndex, 1);
			this.app.dispatchEvent(new CustomEvent(this.settings.eventDelColor, { detail: JSON.stringify(color) }));
			this.renderSwatches();

			if (this.settings.useLocalStorage) {
				window.localStorage.setItem(this.settings.storageKey, JSON.stringify(this.settings.swatches.values));
			}
		}
	}

	/**
	* @function findSwatch
	* @param {String} key
	* @description Look up a swatch in swatches-collection, return index in array
	*/
	findSwatch(key) {
		return this.settings.swatches.values.findIndex(obj => { return obj.name === key });
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
	* @function handleClick
	* @param {Event} event
	* @description Handle main form clicks.
	*/
	handleClick(event) {
		const element = event.target;
		if (element.tagName === 'BUTTON' && element.dataset.elm) {
			switch(element.dataset.elm) {
				case 'add':
					this.addSwatch();
					break;
				case 'addStop':
					this.addStop();
					break;
				case 'gradientStopDelete': {
					this.deleteStop(element);
					break;
				}
				default: break;
			}
		}
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
	initColorPicker() {
		this.app.innerHTML = this.template();
		this.elements = {};
		this.clickTimer = null;
		this.clickTimerDuration = 800;
		this.app.querySelectorAll(`[data-elm]`).forEach(element => {
			this.elements[element.dataset.elm] = element;
		});

		/* Add eventListeners */
		this.elements.picker.addEventListener('click', this.handleClick.bind(this));
		this.elements.picker.addEventListener('input', this.handleInput.bind(this));
		this.elements.colors.addEventListener('keydown', this.keyDown.bind(this));
		this.elements.colors.addEventListener('pointerdown', this.pointerDown.bind(this));
		this.elements.colors.addEventListener('pointerup', this.pointerUp.bind(this));
		this.elements.gradient.addEventListener('click', (event) => {return this.copySwatch(event.target)});
		this.elements.selected.addEventListener('click', (event) => {return this.copySwatch(event.target)});

		if (this.settings.useLocalStorage) {
			const swatches = window.localStorage.getItem(this.settings.storageKey);
			if (swatches) {
				this.settings.swatches.values = JSON.parse(swatches || []);
			}
			this.renderSwatches();
		}

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
				case 'Delete': this.deleteSwatch(element); break;
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
			this.setColor(element);
			if (!this.clickTimer) {
				// this.clickTimer = setTimeout(() => { this.deleteSwatch(element) }, this.clickTimerDuration);
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
	* @function renderGradient
	* @description Renders/updates gradient preview
	*/
	renderGradient() {
		this.elements.gradient.style.backgroundImage = this.setGradient();
	}

	/**
	* @function renderSwatches
	* @description Renders/updates custom swatches
	*/
	renderSwatches() {
		this.elements.swatches.innerHTML = this.templateColorSubGroup(this.settings.swatches.values);
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

		if (key) {
			const swatchIndex = this.findSwatch(key);
			if (swatchIndex > -1) {
				swatchName = this.settings.swatches.values[swatchIndex].name;
			}
		}
		this.elements.swatchName.value = swatchName;
	}

	
	/**
	* @function setGradient
	* @description Renders gradient from object
	*/
	setGradient() {
		return `${this.settings.gradient.type}(${this.settings.gradient.type.includes('linear') ? `${this.settings.gradient.angle}deg,`: ''}${this.settings.gradient.stops.map(color => { return `${color.color}${color.stop ? ` ${color.stop}`: ''}` }).join(',')})`;
	}

	/**
	* @function template
	* @description Renders main template for ColorPicker
	*/
	template() {
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
					<input type="radio" id="cp-solid" name="cp-solid-gradient" class="u-hidden" value="solid" data-elm="colorSolid" checked>
					<input type="radio" id="cp-gradient" name="cp-solid-gradient" class="u-hidden" value="gradient" data-elm="colorGradient">

					<div class="c-clp__fieldset">
						<label class="c-clp__label-group" for="cp-solid">${this.settings.lblSolid}</label>
						<label class="c-clp__label-group" for="cp-gradient">${this.settings.lblGradient}</label>
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
						<label class="c-clp__label"><input type="number" min="0" max="360" size="3" value="90" data-elm="gradientAngle" />${this.settings.lblAngle}</label>
					</div>

					<div data-state="gradient" data-elm="colorStops"></div>

					<div class="c-clp__fieldset" data-state="gradient">
						<button type="button" data-elm="addStop">${this.settings.lblAddStop}</button>
					</div>

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
						<label class="c-clp__label"><input type="text" data-elm="hex" size="9" data-lpignore="true" />HEX/A</label>
						<label class="c-clp__label"><input type="text" data-elm="luminance" size="3" readonly />${this.settings.lblBrightness}</label>
					</div>
					<div class="c-clp__fieldset">
						<label class="c-clp__label"><input type="text" data-elm="swatchName" data-lpignore="true" size="15" />${this.settings.lblSwatchName}</label>
					</div>
					<button type="button" data-elm="add" disabled>${this.settings.lblAddToSwatches}</button>

					<label><textarea class="u-hidden" data-elm="clipboard" tabindex="-1" aria-hidden="true"></textarea></label>
					<div class="u-hidden" data-elm="sample"></div>
				</div>
			</div>

			<div data-elm="colors">
				${this.templateColorGroup(this.settings.swatches, 'swatches')}
				${this.settings.libraries.map(group => { return this.templateColorGroup(group); }).join('')}
			</div>
		</form>`
	}

	/**
	* @function templateColor
	* @description Renders a single color-swatch
	*/
	templateColor(color) {
		const isSwatch = typeof color === 'object';
		const name = isSwatch ? color.name : color;
		const object = isSwatch && color.object ? JSON.stringify(color.object) : '';
		const value = isSwatch ? color.value : color;
		return `<button type="button" class="c-clp__color" style="background:${value}" title="${name}" ${isSwatch ? `data-swatch-key="${name}" data-swatch-obj='${object}'` : ''}></button>`;
	}

	/**
	* @function templateColorStop
	* @param {String} color
	* @param {String} stop
	* @param {Number} index
	* @description Renders a single color-stop in a gradient
	*/	
	templateColorStop(color, stop = '', index = 0) {
		return `
		<div class="c-clp__fieldset">
			<div class="c-clp__label c-clp__label--5" style="background:${color}"></div>
			<label class="c-clp__label c-clp__label--55"><input type="text" size="8" value="${color}" data-elm="gradientStopColor" data-index="${index}" />${this.settings.lblColorHint}</label>
			<label class="c-clp__label c-clp__label--15"><input type="text" size="3" value="${stop}" data-elm="gradientStop" data-index="${index}" />${this.settings.lblColorStop}</label>
			<label class="c-clp__label c-clp__label--10"><button type="button" data-elm="gradientStopDelete" data-index="${index}" aria-label="${this.settings.lblColorDeleteQuery}">${this.settings.lblColorDelete}</button></label>
		</div>`
	}

	templateColorStops() {
		return this.settings.gradient.stops.map((color, index) => { return this.templateColorStop(color.color, color.stop || '', index)}).join('');
	}

	/**
	* @function templateColorGroup
	* @description Renders a ColorGroup
	*/
	templateColorGroup(group, panel) {
		return `
		<details ${group.open ? 'open': ''}>
			<summary class="c-clp__summary"><span>${group.name}</span></summary>
			<div class="c-clp__panel" ${panel ? `data-elm="${panel}"`: ''}>
			${group.subgroups ?
				group.subgroups.map(subgroup => {
			return `
				<fieldset class="c-clp__color-group">
					<legend class="c-clp__color-group-headline">${subgroup.name}</legend>
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