/**
 * ShadowMaker module.
 * @module /assets/js/shadowmaker
 * @requires /assets/js/common
 * @version 0.0.3
 * @summary 14-04-2020
 * @description box-shadow, filter: drop-shadow and text-shadow editor
 * https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow
 * https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow
 * https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow
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
		this.init();
	}

		/**
	* @function handleInput
	* @param {Event} event
	* @description Handle main form input.
	*/
	handleInput(event) {
		const element = event.target;
		const index = element.dataset.index - 0 || 0;
		const key = element.dataset.elm;
		let value = element.value;

		if (element.type === 'checkbox') {
			value = element.checked ? true : false;
		}
		else if (element.type === 'number') {
			value = value - 0;
		}
		else if (element.type === 'radio') {
			return;
		}
		if (event.type === 'eventSetColor') {
			value = event.detail.rgba;
		}

		const obj = this.settings.shadow.values[index];
		obj[key] = value;
		obj.value = `${obj.inset ? 'inset ' : ''}${obj.x}px ${obj.y}px ${obj.blur}px ${obj.spread ? `${obj.spread}px ` : '' }${obj.color}`
		/* TODO: updateValue, updateShadow */		
		console.log(obj)
	}

	/**
	* @function init
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	init() {
		this.uuid = uuid();
		this.app.innerHTML = this.template();
		this.elements = {};
		this.app.querySelectorAll(`[data-elm]`).forEach(element => {
			this.elements[element.dataset.elm] = element;
		});

		this.elements.app.addEventListener('input', this.handleInput.bind(this));

		/* TODO TODO */
		this.elements.shadows.innerHTML = this.templateShadowEntries();
		const colors = this.app.querySelectorAll(`[data-js="colorpicker"]`);
		colors.forEach(color => {
			new ColorPicker(color, color.dataset);
			color.addEventListener('eventSetColor', (event) => { this.handleInput(event)})
		})

		this.elements.previewText.style.cssText = this.settings.shadow.type + ':' + this.settings.shadow.values.map(shadow => { return shadow.value; }).join(',') + ';';
		

	}

	setPreview() {
		/* Set CSS Custom Props */

	}

	/**
	* @function template
	* @description Renders main template
	*/
	template() {
		return `
		<form class="app" data-elm="app">

			<input type="radio" id="sm-box${this.uuid}" name="sm-type" class="u-hidden" value="box" data-elm="boxShadow" checked>
			<input type="radio" id="sm-text${this.uuid}" name="sm-type" class="u-hidden" value="text" data-elm="textShadow">
			<input type="radio" id="sm-drop${this.uuid}" name="sm-type" class="u-hidden" value="text" data-elm="dropShadow">
			


			<div class="app__edit">
				<div class="app__preview">
					<div data-elm="previewBox"></div>
					<div data-elm="previewDrop">
						<div data-elm="previewDropInner"></div>
					</div>
					<div data-elm="previewText" contenteditable>HELLO SHADOW</div>
				</div>

				<div class="app__controls">
					<div class="app__fieldset">
						<label class="app__label-group" for="sm-box${this.uuid}" data-for="boxShadow">${this.settings.lblBoxShadow}</label>
						<label class="app__label-group" for="sm-text${this.uuid}" data-for="textShadow">${this.settings.lblTextShadow}</label>
						<label class="app__label-group" for="sm-drop${this.uuid}" data-for="dropShadow">${this.settings.lblDropShadow}</label>
					</div>
					<div data-elm="shadows"></div>
					<div class="app__fieldset">
						<label class="app__label"><input type="text" data-elm="presetName" data-lpignore="true" size="15">Preset name</label>
					</div>

					<button type="button" class="app__button" data-elm="addPreset" disabled="">Add preset</button>
				</div>
			</div>
			<details class="app__details" open>
				<summary class="app__summary"><span>Presets</span></summary>
				<div class="app__panel" data-elm="presets">
					<button type="button" class="app__preset" data-preset-key="" data-preset-obj="">Clody painting</button>
					<button type="button" class="app__preset" data-preset-key="" data-preset-obj="">Old grainy photo</button>
				</div>
			</details>
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
			<label class="app__label app__label--del"><button type="button" data-elm="delete" data-index="${index}" aria-label="">${this.settings.lblDelete}</button>del</label>
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