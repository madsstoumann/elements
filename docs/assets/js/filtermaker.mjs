/**
 * FilterMaker module.
 * @module /assets/js/filtermaker
 * @requires /assets/js/common
 * @version 0.0.3
 * @summary 13-04-2020
 * @description 
 * @example
 * <div data-js="filtermaker">
 * Thanks to yoksel for the great SVG filters:
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
			lblContrast: 'contrast',
			lblDragImage: 'Drag image',
			lblGrayscale: 'grayscale',
			lblHueRotate: 'hue-rotate',
			lblInvert: 'invert',
			lblOpacity: 'opacity',
			lblReset: 'Reset',
			lblSaturate: 'saturate',
			lblSepia: 'sepia',
			preset: 
				{
					name: 'light-shadow',
					deletable: false,
					type: '',
					values:
					[
						{
							blur: 0
						}
					]
				}
			
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
		if (element.type === 'range') {
			this.elements.app.style.setProperty(`--${element.dataset.elm}`,`${element.value}${element.dataset.suffix || ''}`);
		}
		else {
			this.elements.app.style.setProperty(`--url`,`${element.value}`);
		}
	}

	/**
	* @function initFilterMaker
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	async initFilterMaker() {
		this.uuid = uuid();
		this.app.innerHTML = this.template();
		this.elements = {};
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
		/*

		
					*/
		/* DEMO TODO */
		// this.elements.blur.value = .8;
		// this.elements.blur.__range.updateRange(this.elements.blur);
	}

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
		<form class="c-flm" data-elm="app">

			<h3>${this.settings.lblDragImage}</h3>
			<figure class="app__img-wrapper">
				<img class="app__img" src="../assets/img/filter-demo.jpg" data-elm="preview" />
				<input type="file" data-elm="filedrop" />
			</figure>
			<div class="app__label-group" data-elm="filters"></div>
			<label class="app__label--range"><span>${this.settings.lblBlur}</span>
				<input type="range" class="c-rng" min="0" max="10" value="0" step="0.1" data-elm="blur" data-suffix="px" data-range-output=":true" />
			</label>
			<label class="app__label--range"><span>${this.settings.lblBrightness}</span>
				<input type="range" class="c-rng" min="0" max="3" value="1" step="0.1" data-elm="brightness" data-range-output=":true" />
			</label>
			<label class="app__label--range"><span>${this.settings.lblContrast}</span>
				<input type="range" class="c-rng" min="0" max="3" value="1" step="0.1" data-elm="contrast" data-range-output=":true" />
			</label>
			<label class="app__label--range"><span>${this.settings.lblGrayscale}</span>
				<input type="range" class="c-rng" min="0" max="1" value="0" step="0.01" data-elm="grayscale" data-range-output=":true" />
			</label>
			<label class="app__label--range"><span>${this.settings.lblHueRotate}</span>
				<input type="range" class="c-rng" min="0" max="360" value="0" data-elm="huerotate" data-suffix="deg" data-range-output=":true" />
			</label>
			<label class="app__label--range"><span>${this.settings.lblInvert}</span>
				<input type="range" class="c-rng" min="0" max="1" value="0" step="0.01" data-elm="invert" data-range-output=":true" />
			</label>
			<label class="app__label--range"><span>${this.settings.lblOpacity}</span>
				<input type="range" class="c-rng" min="0" max="1" value="1" step="0.01" data-elm="opacity" data-range-output=":true" />
			</label>
			<label class="app__label--range"><span>${this.settings.lblSaturate}</span>
				<input type="range" class="c-rng" min="0" max="3" value="1" step="0.1" data-elm="saturate" data-range-output=":true" />
			</label>
			<label class="app__label--range"><span>${this.settings.lblSepia}</span>
				<input type="range" class="c-rng" min="0" max="1" step="0.01" value="0" data-elm="sepia" data-range-output=":true" />
			</label>
			<button type="button" class="c-btn" data-elm="reset">${this.settings.lblReset}</button>
		</form>`
	}

	templateFilters(filters) {
		return filters.map((filter, index) => { return `
		<label class="app__label--radio">
			<input type="radio" class="u-hidden" name="svg" value="url('${this.settings.filterFile}#${filter.id}')"${index === 0 ? ' checked': ''} />
			<span>${filter.title || filter.id}</span>
		</label>`}).join('');
	}
}