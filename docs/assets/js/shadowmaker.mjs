/**
 * ShadowMaker module.
 * @module /assets/js/shadowmaker
 * @requires /assets/js/common
 * @version 0.0.1
 * @summary 07-04-2020
 * @description box-shadow, filter: drop-shadow and text-shadow editor
 * @example
 * <div data-js="shadowmaker">
 */

import ColorPicker from './colorpicker.mjs';
import { stringToType, uuid } from './common.mjs';

export default class ShadowMaker {
	constructor(element, settings) {
		this.settings = Object.assign({
			eventAddShadow: 'eventAddShadow',
			eventDelShadow: 'eventDelShadow',
			lblBlur: 'blur',
			lblBoxShadow: 'box-shadow',
			lblColor: 'color',
			lblDelete: '✕',
			lblDropShadow: 'drop-shadow',
			lblOffsetX: 'x',
			lblOffsetY: 'y',
			lblSpread: 'spread',
			lblTextShadow: 'text-shadow',

			shadow: 
				{
					name: 'light-shadow',
					deletable: false,
					type: 'text-shadow',
					values:
					[
						{
							blur: 0,
							color: 'rgba(220, 194, 255, 0.85)',
							inset: false,
							spread: 0,
							value: `-12px -12px 0 rgba(220, 194, 255, 0.85)`,
							x: 3,
							y: 3
						},
						{
							blur: 0,
							color: 'rgba(220, 194, 55, 1)',
							inset: false,
							spread: 0,
							value: `18px 18px 0 rgba(220, 194, 55, 1)`,
							x: 6,
							y: 6
						}
					]
				}
			
		}, stringToType(settings));

		this.app = element;
		this.initShadowMaker();
		console.log(this);
	}

		/**
	* @function handleInput
	* @param {Event} event
	* @description Handle main form input. Triggers when a user moves a range-slider or changes an input value.
	*/
	handleInput(event) {
		const element = event.target;
		// let index = 0;
		/* If range-slider, set related CSS Custom prop */
		if (element.type === 'range') {
			this.elements.app.style.setProperty(`--${element.dataset.elm}`,`${element.value}${element.dataset.suffix || ''}`);
			// this.setPreview(this.elements.selected, false);
		}
	}

	/**
	* @function initShadowMaker
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	initShadowMaker() {
		this.uuid = uuid();
		this.app.innerHTML = this.template();
		this.elements = {};
		this.clickTimer = null;
		this.clickTimerDuration = 800;
		this.app.querySelectorAll(`[data-elm]`).forEach(element => {
			this.elements[element.dataset.elm] = element;
		});


		// this.colorPicker = new ColorPicker(this.elements.color, this.elements.color.dataset);
		// this.elements.color.addEventListener('eventSetColor', (event) => { 
		// 	this.elements.app.style.setProperty(`--bxsh-c`,`${event.detail.rgba}`);

		// });

		// this.elements.app.style.setProperty(`--bxsh-c`,`${this.elements.color.value}`);
		/* Add eventListeners */
		// this.elements.app.addEventListener('click', this.handleClick.bind(this));
		this.elements.app.addEventListener('input', this.handleInput.bind(this));

		/* TODO TODO */
		this.elements.shadows.innerHTML = this.templateShadowEntries();
		const colors = this.app.querySelectorAll(`[data-js="colorpicker"]`);
		colors.forEach(color => {
			new ColorPicker(color, color.dataset);
		})

		this.elements.text.style.cssText = this.settings.shadow.type + ':' + this.settings.shadow.values.map(shadow => { return shadow.value; }).join(',') + ';';
		

	}

	setPreview() {
		/* Set CSS Custom Props */

	}

	/**
	* @function template
	* @description Renders main template for ColorPicker
	*/
	template() {
		return `
		<form class="c-shw" data-elm="app">

			<input type="radio" id="sm-box${this.uuid}" name="sm-type" class="u-hidden" value="box" data-elm="boxShadow" checked>
			<input type="radio" id="sm-text${this.uuid}" name="sm-type" class="u-hidden" value="text" data-elm="textShadow">
			<input type="radio" id="sm-drop${this.uuid}" name="sm-type" class="u-hidden" value="text" data-elm="dropShadow">
			
			<div class="app__fieldset">
				<label class="app__label-group" for="sm-box${this.uuid}" data-for="boxShadow">${this.settings.lblBoxShadow}</label>
				<label class="app__label-group" for="sm-text${this.uuid}" data-for="textShadow">${this.settings.lblTextShadow}</label>
				<label class="app__label-group" for="sm-drop${this.uuid}" data-for="dropShadow">${this.settings.lblDropShadow}</label>
			</div>

			<div data-elm="preview">
				<div data-elm="inner"></div>
				
			</div>
			<div data-elm="text">HELLO SHADOW</div>
			<br /><br />

			<div data-elm="shadows"></div>
			
			<!--
			<label>${this.settings.lblOffsetX}
				<input type="range" class="c-rng" min="-100" max="100" value="3" data-elm="offsetX" data-suffix="px" />
			</label>
			<label>${this.settings.lblOffsetY}
				<input type="range" class="c-rng" min="-100" max="100" value="3" data-elm="offsetY" data-suffix="px" />
			</label>
			<label>${this.settings.lblBlur}
				<input type="range" class="c-rng" min="-100" max="100" value="3" data-elm="blur" data-suffix="px" />
			</label>
			<label>${this.settings.lblSpread}
				<input type="range" class="c-rng" min="-100" max="100" value="3" data-elm="spread" data-suffix="px" />
			</label>
			-->
		</form>`
	}

		/**
	* @function templateShadowEntry
	* @param {String} color
	* @param {String} stop
	* @param {Number} index
	* @description Renders a single shadow-entry in a list of shadows
	*/	
	templateShadowEntry(shadow, index = 0) {
		return `
		<div class="app__fieldset">
			<label class="app__label app__label--checkbox"><input type="checkbox" class="u-hidden" data-elm="inset" data-index="${index}"${shadow.inset ? ' checked' : ''} /><span></span>inset</label>
			<label class="app__label"><input type="number" size="3" value="${shadow.x}" data-elm="x" data-index="${index}" />${this.settings.lblOffsetX}</label>
			<label class="app__label"><input type="number" size="3" value="${shadow.y}" data-elm="y" data-index="${index}" />${this.settings.lblOffsetY}</label>
			<label class="app__label"><input type="number" size="3" value="${shadow.blur}" data-elm="blur" data-index="${index}" />${this.settings.lblBlur}</label>
			<label class="app__label"><input type="number" size="3" value="${shadow.spread}" data-elm="spread" data-index="${index}" />${this.settings.lblSpread}</label>
			<label class="app__label app__label--auto"><input type="text" data-elm="color" data-index="${index}" data-js="colorpicker" data-value-format="rgb" value="${shadow.color}" readonly />${this.settings.lblColor}</label>
			<label class="app__label"><button type="button" data-elm="delete" data-index="${index}" aria-label="">${this.settings.lblDelete}</button>del</label>
		</div>`
	}

	/**
	* @function templateShadowEntries
	* @description Renders a group of ShadowEntry's
	*/
	templateShadowEntries() {
		return this.settings.shadow.values.map((shadow, index) => { return this.templateShadowEntry(shadow, index)}).join('');
	}
}