/**
 * ShadowMaker module.
 * @module /assets/js/shadowmaker
 * @requires /assets/js/common
 * @version 0.0.4
 * @summary 15-04-2020
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
			lblAddPreset: 'Add preset',
			lblAddShadow: 'Add shadow',
			lblBlur: 'blur',
			lblBoxShadow: 'box-shadow',
			lblCode: 'Generated code',
			lblColor: 'color',
			lblDelete: '✕',
			lblDropShadow: 'drop-shadow',
			lblOffsetX: 'x',
			lblOffsetY: 'y',
			lblPresets: 'Presets',
			lblSpread: 'spread',
			lblTextShadow: 'text-shadow',
			presetDefault: {
				blur: 2,
				color: 'rgba(230, 230, 230, 1)',
				inset: false,
				spread: 0,
				valueBox: `0px 1px 2px 0 rgba(230, 230, 230, 1)`,
				valueText: `0px 1px 0 rgba(230, 230, 230, 1)`,
				x: 0,
				y: 1
			},
			presets: 
				[
					{
						name: 'yellow-red',
						deletable: false,
						type: 'text-shadow',
						values:
						[
							{
								"blur": 0,
								"color": "rgba(255, 205, 77, 1)",
								"inset": false,
								"spread": 0,
								"valueBox": "9px 9px 0px rgba(255, 205, 77, 1)",
								"valueText": "9px 9px 0px rgba(255, 205, 77, 1)",
								"x": 9,
								"y": 9
							},
							{
								"blur": 0,
								"color": "rgba(255, 0, 0, 0.75)",
								"inset": false,
								"spread": 0,
								"valueBox": "15px 15px 0px rgba(255, 0, 0, 0.75)",
								"valueText": "15px 15px 0px rgba(255, 0, 0, 0.75)",
								"x": 15,
								"y": 15
							}
						]
					},
					{
						name: 'sm',
						deletable: false,
						type: 'box-shadow',
						values:
						[
							{
								"blur": 2,
								"color": "rgba(0, 0, 0, 0.05)",
								"inset": false,
								"spread": 0,
								"valueBox": "0px 1px 2px 0 rgba(0, 0, 0, 0.05)",
								"valueText": "0px 1px 2px rgba(0, 0, 0, 0.05)",
								"x": 0,
								"y": 1
							}
						]
					},
					{
						name: '2xl',
						deletable: false,
						type: 'box-shadow',
						values:
						[
							{
								"blur": 50,
								"color": "rgba(0, 0, 0, 0.25)",
								"inset": false,
								"spread": -12,
								"valueBox": "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
								"valueText": "0px 25px 50px rgba(0, 0, 0, 0.25)",
								"x": 0,
								"y": 25
							}
						]
					}
				]
		}, stringToType(settings));

		this.app = element;
		this.init();
	}

	/**
	* @function addShadow
	* @description Adds a new, empty shadow to default preset
	*/
	addShadow() {
		this.preset.push({...this.settings.presetDefault});
		this.setState();
	}

	/**
	* @function delShadow
	* @param {Node} element
	* @description Delete a shadow-entry from preset
	*/
	delShadow(element) {
		const index = parseInt(element.dataset.index, 10);
		this.preset.splice(index, 1);
		this.setState();
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
				case 'addPreset':
					console.log('preset')
					break;
				case 'addShadow':
					this.addShadow();
					break;
				case 'delShadow':
					this.delShadow(element);
					break;
				default: break;
			}
		}
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

		const obj = this.preset[index];
		obj[key] = value;
		obj.valueBox = `${obj.inset ? 'inset ' : ''}${obj.x}px ${obj.y}px ${obj.blur}px ${obj.spread ? `${obj.spread}px ` : '' }${obj.color}`;
		obj.valueText = `${obj.x}px ${obj.y}px ${obj.blur}px ${obj.color}`;
		this.setPreview(this.preset);
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
		this.preset = [];
		this.addShadow();

		this.elements.app.addEventListener('click', this.handleClick.bind(this));
		this.elements.app.addEventListener('input', this.handleInput.bind(this));
		this.elements.presets.addEventListener('keydown', this.keyDown.bind(this));
		this.elements.presets.addEventListener('pointerdown', this.pointerDown.bind(this));
		this.elements.presets.innerHTML = this.settings.presets.map((preset, index) => { return this.templatePresetEntry(preset, index)}).join('');
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
				case ' ': this.setPreview(element); break;
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
			const index = parseInt(element.dataset.index, 10);
			
			const preset = this.settings.presets[index];
			if (preset) {
				this.elements.presetName.value = preset.name;
				this.preset = preset.values;
				this.setState()
			}
			if (!this.clickTimer) {
				// this.clickTimer = setTimeout(() => { this.deleteSwatch(element) }, this.clickTimerDuration);
			}
		}
	}

	/**
	* @function setPreview
	* @paramn {Array} arr
	* @description Updates preview of box-shadow, text-shadow and drop-shadow
	*/
	setPreview(arr) {
		const boxShadow = arr.map(preset => { return preset.valueBox }).join(', ');
		const dropShadow = arr.map(preset => { return `drop-shadow(${preset.valueText})` }).join(' ');
		const textShadow = arr.map(preset => { return preset.valueText }).join(', ');
		this.elements.previewBox.style.boxShadow = boxShadow;
		this.elements.previewDrop.style.filter = dropShadow;
		this.elements.previewText.style.textShadow = textShadow;
		this.elements.presetCode.innerHTML = `<span>box-shadow:</span> ${boxShadow};<br /><span>filter:</span> ${dropShadow};<br /><span>text-shadow:</span> ${textShadow};`
	}

	setState(arr = this.preset) {
		this.elements.shadows.innerHTML = arr.map((preset, index) => { return this.templateShadowEntry(preset, index)}).join('');
		/* TODO: RISK OF REMOVING colorPickers from MAIN APP !!! Remove old color-pickers */
		document.querySelectorAll('.c-clp__dialog').forEach(dialog => { dialog.parentNode.removeChild(dialog)})
		/* Add new ones */
		const colors = this.elements.shadows.querySelectorAll(`[data-js="colorpicker"]`);
		colors.forEach(color => {
			new ColorPicker(color, color.dataset);
			color.addEventListener('eventSetColor', (event) => { this.handleInput(event)})
		});
		this.setPreview(arr);
	}

	/**
	* @function template
	* @description Renders main template
	*/
	template() {
		return `
		<form class="app" data-elm="app">

			<input type="radio" id="sm-box${this.uuid}" name="smtype" class="u-hidden" value="box" data-elm="boxShadow" checked>
			<input type="radio" id="sm-text${this.uuid}" name="smtype" class="u-hidden" value="text" data-elm="textShadow">
			<input type="radio" id="sm-drop${this.uuid}" name="smtype" class="u-hidden" value="text" data-elm="dropShadow">

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
					<button type="button" class="app__button" data-elm="addShadow">${this.settings.lblAddShadow}</button>
					TODO: RESET
					<div class="app__fieldset">
						<label class="app__label"><input type="text" data-elm="presetName" data-lpignore="true" size="15">Preset name</label>
					</div>

					<button type="button" class="app__button" data-elm="addPreset" disabled>${this.settings.lblAddPreset}</button>
				</div>
			</div>

			<details class="app__details" open>
				<summary class="app__summary"><span>${this.settings.lblPresets}</span></summary>
				<div class="app__panel" data-elm="presets"></div>
			</details>
			<details class="app__details" open>
				<summary class="app__summary"><span>${this.settings.lblCode}</span></summary>
				<div class="app__code" data-elm="presetCode"></div>
			</details>
		</form>`
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

	/**
	* @function templateShadowEntry
	* @param {String} color
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
			<label class="app__label app__label--del"><button type="button" data-elm="delShadow" data-index="${index}" aria-label="">${this.settings.lblDelete}</button>del</label>
		</div>`
	}
}