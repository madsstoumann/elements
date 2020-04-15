/**
 * FilterMaker module.
 * @module /assets/js/filtermaker
 * @requires /assets/js/common
 * @version 0.0.4
 * @summary 15-04-2020
 * @description 
 * @example
 * <div data-js="filtermaker">
 * Thanks to yoksel for the great SVG filters, which I shamelessly copied:
 * https://yoksel.github.io/svg-filters/#/presets
 * https://yoksel.github.io/svg-gradient-map
 */

import RangeSlider from './range.mjs';
import { stringToType, uuid } from './common.mjs';

export default class FilterMaker {
	constructor(element, settings) {
		this.settings = Object.assign({
			clsDrag: 'app__img--drag',
			eventAddPreset: 'eventAddPreset',
			eventDelPreset: 'eventDelPreset',
			filterFile: '/docs/assets/svg/filters.svg',
			lblBlur: 'blur',
			lblBrightness: 'brightness',
			lblCode: 'Generated code',
			lblContrast: 'contrast',
			lblDragImage: 'Drag image',
			lblGrayscale: 'grayscale',
			lblHueRotate: 'hue-rotate',
			lblInvert: 'invert',
			lblOpacity: 'opacity',
			lblReset: 'Reset',
			lblSaturate: 'saturate',
			lblSepia: 'sepia',
			presets: [
				{
					name: 'watercolor',
					values:
					{
						brightness: 1.3,
						invert: 0.17,
						saturate: 2.6,
						sepia: 0.25,
						url: `url('/docs/assets/svg/filters.svg#squiggly-1')`
					}
				},
				{
					name: 'old photo',
					values:
					{
						blur: 0.2,
						brightness: 1.1,
						'hue-rotate': 5,
						opacity: 0.9,
						saturate: 1.3,
						sepia: 0.71,
						url: ''
					}
				}
			]
		}, stringToType(settings));

		this.app = element;
		this.initFilterMaker();
	}

	/**
	* @function handleInput
	* @param {Event} event
	* @description Handle main form input. Triggers when a user moves a range-slider or changes an input value.
	*/
	handleInput(event) {
		const element = event.target;
		const key = element.dataset.elm;
		this.elements.app.style.setProperty(`--${key}`,`${element.value}${element.dataset.suffix || ''}`);
		this.preset[key] = key === 'url' ? element.value : element.value - 0;
		this.setCode();
	}

	/**
	* @function initFilterMaker
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	async initFilterMaker() {
		this.uuid = uuid();
		this.app.innerHTML = this.template();
		this.elements = {};
		this.presetDefault = 
		{
			blur: 0,
			brightness: 1,
			contrast: 1,
			grayscale: 0,
			'hue-rotate': 0,
			invert: 0,
			opacity: 1,
			saturate: 1,
			sepia: 0,
			url: ''
		};
		this.preset = {...this.presetDefault};
		this.clickTimer = null;
		this.clickTimerDuration = 800;
		this.app.querySelectorAll(`[data-elm]`).forEach(element => {
			if (element.type && element.type === 'range') {
				element.__range = new RangeSlider(element, element.dataset)
			}
			this.elements[element.dataset.elm] = element;
		});

		this.elements.app.addEventListener('input', this.handleInput.bind(this));
		this.elements.filedrop.addEventListener("change", this.setImage.bind(this));
		this.elements.presets.addEventListener('keydown', this.keyDown.bind(this));
		this.elements.presets.addEventListener('pointerdown', this.pointerDown.bind(this));
		this.elements.presets.innerHTML = this.settings.presets.map((preset, index) => { return this.templatePresetEntry(preset, index)}).join('');
		this.elements.preview.addEventListener("dragover", (event) => { event.preventDefault(); return false; });
		this.elements.preview.addEventListener("dragenter", () => { this.elements.preview.classList.add(this.settings.clsDrag); });
		document.addEventListener("drop", () => { this.elements.preview.classList.remove(this.settings.clsDrag) ;});

		const filterFile = await (await fetch(this.settings.filterFile)).text();
		if (filterFile) {
			const parser = new DOMParser;
			const doc = parser.parseFromString(filterFile, 'text/xml');
			const filters = doc.querySelectorAll('filter');
			this.settings.filters = [...filters].map(filter => { return { id: filter.id, title: filter.title }})
			this.elements.filters.innerHTML = this.templateFilters(this.settings.filters);
		}

		this.setCode();
	}

	/**
	* @function loadPreset
	* @paramn {Node} element
	* @description Loads preset / overwrites preset
	*/
	loadPreset(element) {
		const index = parseInt(element.dataset.index, 10);
		const preset = this.settings.presets[index];
		if (preset && preset.values) {
			this.preset = Object.assign({...this.presetDefault}, preset.values);
			for (let key in this.preset) {
				let input;
				if (key === 'url') {
					let svgID = 'none';
					if (this.preset.url) {
						const url = this.preset.url.match(/#(.*)'/);
						if (url.length && url[1]) {
							svgID = url[1]
						}
					} 
					input = this.elements.app.elements[`filter-${svgID}`];
					input.checked = true;
				}
				else {
					input = this.elements.app.elements[key];
				}
				if (input) {
					input.value = this.preset[key];
					this.elements.app.style.setProperty(`--${key}`,`${input.value}${input.dataset.suffix || ''}`);
					if (input.__range) {
						/* TODO : UPDATE rangeSlider */
						const min = parseInt(input.min, 10);
						const multiplier = 100 / ((parseInt(input.max, 10) || 100) - min);
						input.__range.updateRange(input, min, multiplier);
					}
				}
			}
			this.setCode();
			// this.elements.presetName.value = preset.name;
			// this.preset = preset.values;
		}
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
				case ' ': this.loadPreset(element); break;
				case 'Delete': this.deletePreset(element); break;
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
			this.loadPreset(element);
			if (!this.clickTimer) {
				// this.clickTimer = setTimeout(() => { this.deleteSwatch(element) }, this.clickTimerDuration);
			}
		}
	}

	/**
	* @function objDiff
	* @description Compare 2 simple objects, return object with differences
	*/
	objDiff(obj1, obj2) {
		const obj = {};
		Object.keys(obj1).forEach(key => { if(obj1[key] !== obj2[key]) { obj[key] = obj2[key] }});
		return obj;
	}

	/**
	* @function setCode
	* @description Updates code in `generated code`-box
	*/
	setCode() {
		/* TODO: remove SVCG filter if includes "none" */
		const obj = this.objDiff(this.presetDefault, this.preset);
		let str = '';
		let suffix = '';
		for (let key in obj) {
			if (key === 'blur') { 
				suffix = 'px'; }
			else if (key === 'hue-rotate') { 
				suffix = 'deg';
			}
			else {
				suffix = '';
			}
			str += `${key}(${obj[key]}${suffix}) `;
		}
		this.elements.presetCode.innerHTML = str ? `<span>filter:</span> ${str.slice(0,-1)};` : '/* Make some changes */';
	}

	/**
	* @function setImage
	* @description Sets preview-image to dragged image-src.
	*/
	setImage(event) {
		const reader = new FileReader();
		reader.onload = (e) => {
			this.elements.preview.setAttribute("src", e.target.result);
		};
		reader.readAsDataURL(event.target.files[0]);
	}

	/**
	* @function template
	* @description Renders main template for ColorPicker
	*/
	template() {
		return `
		<form class="app" data-elm="app">
			<div class="app__edit">
				<div class="app__preview">
					<!--<h3>${this.settings.lblDragImage}</h3>-->
					<figure class="app__img-wrapper">
					<!-- TODO FIX -->
						<img src="../assets/img/filter-demo.jpg" class="app__img" data-elm="preview" />
						<input type="file" class="app__file-drop" data-elm="filedrop" />
					</figure>
					<details open data-elm="filters-wrapper">
						<summary class="app__summary"><span>SVG Filters</span></summary>
						<div class="app__panel" data-elm="filters">
					</details>
				</div>

				<div class="app__controls">
					<label class="app__label--range"><span>${this.settings.lblBlur}</span>
						<input type="range" class="c-rng" min="0" max="10" value="0" step="0.1" name="blur" data-elm="blur" data-suffix="px" data-range-output=":true" />
					</label>
					<label class="app__label--range"><span>${this.settings.lblBrightness}</span>
						<input type="range" class="c-rng" min="0" max="3" value="1" step="0.1" name="brightness" data-elm="brightness" data-range-output=":true" />
					</label>
					<label class="app__label--range"><span>${this.settings.lblContrast}</span>
						<input type="range" class="c-rng" min="0" max="3" value="1" step="0.1" name="contrast" data-elm="contrast" data-range-output=":true" />
					</label>
					<label class="app__label--range"><span>${this.settings.lblGrayscale}</span>
						<input type="range" class="c-rng" min="0" max="1" value="0" step="0.01" name="grayscale" data-elm="grayscale" data-range-output=":true" />
					</label>
					<label class="app__label--range"><span>${this.settings.lblHueRotate}</span>
						<input type="range" class="c-rng" min="0" max="360" value="0" name="hue-rotate" data-elm="hue-rotate" data-suffix="deg" data-range-output=":true" />
					</label>
					<label class="app__label--range"><span>${this.settings.lblInvert}</span>
						<input type="range" class="c-rng" min="0" max="1" value="0" step="0.01" name="invert" data-elm="invert" data-range-output=":true" />
					</label>
					<label class="app__label--range"><span>${this.settings.lblOpacity}</span>
						<input type="range" class="c-rng" min="0" max="1" value="1" step="0.01" name="opacity" data-elm="opacity" data-range-output=":true" />
					</label>
					<label class="app__label--range"><span>${this.settings.lblSaturate}</span>
						<input type="range" class="c-rng" min="0" max="3" value="1" step="0.1" name="saturate" data-elm="saturate" data-range-output=":true" />
					</label>
					<label class="app__label--range"><span>${this.settings.lblSepia}</span>
						<input type="range" class="c-rng" min="0" max="1" step="0.01" value="0" name="sepia" data-elm="sepia" data-range-output=":true" />
					</label>
					<div class="app__fieldset">
						<label class="app__label"><input type="text" data-elm="presetName" data-lpignore="true" size="15">Preset name</label>
					</div>

					<button type="button" class="app__button" data-elm="addPreset" disabled="">Add preset</button>
					
					<!--<button type="button" class="app__button" data-elm="reset">${this.settings.lblReset}</button>-->
				</div>
			</div>
			<details class="app__details" open>
				<summary class="app__summary"><span>Presets</span></summary>
				<div class="app__panel" data-elm="presets"></div>
			</details>
			<details class="app__details" open>
			<summary class="app__summary"><span>${this.settings.lblCode}</span></summary>
			<div class="app__code" data-elm="presetCode"></div>
		</details>
		</form>`
	}

	/**
	* @function templateFilters
	* @param {Array} filters
	* @description Renders filters
	*/	
	templateFilters(filters) {
		return `
			<label class="app__label--radio">
				<input type="radio" class="u-hidden" id="filter-none" name="url" data-elm="url" value="" checked />
				<span>none</span>
			</label>
		${filters.map(filter => { return `
			<label class="app__label--radio">
				<input type="radio" class="u-hidden" id="filter-${filter.id}" name="url" data-elm="url" value="url('${this.settings.filterFile}#${filter.id}')" />
				<span>${filter.title || filter.id}</span>
			</label>`}).join('')}`;
	}

	/**
	* @function templatePresetEntry
	* @param {Object} preset
	* @param {Number} index
	* @description Renders a single preset
	*/	
	templatePresetEntry(preset, index = 0) {
		return `<button type="button" class="app__preset" data-index="${index}">${preset.name}</button>`
	}
}