/**
 * Layout module.
 * @module /assets/js/controlPanel
 * @requires /assets/js/common
 * @version 1.0.2
 * @summary 09-08-2020
 * @description Control Panel
 * @example
 * <div data-control-panel="alignment audio background brightness colormode contrast fontsize spacing tabstops typography width">
 */
import { h, stringToType, uuid } from './common.mjs';
export default class ControlPanel {
	constructor(element, settings) {
		this.settings = Object.assign({
			clsForm: 'c-cpl',
			clsTrigger: 'c-cpl__trigger',
			clsTriggerLabel: 'c-cpl__summary',
			lblTrigger: 'Settings',
			lblExpanded: 'Close Settings',
			urlData: '../assets/data/control-panel.json'
		}, stringToType(settings));
		this.wrapper = element;
		this.init();
	}

	async init() {
		/* Fetch data from API */
		this.data = await (await fetch(this.settings.urlData)).json();
		this.options = this.settings.controlPanel.split(' ');

		if (this.data && this.options.length && (typeof this.settings.controlPanelTrigger === 'string')) {
			let [trigger, insertMethod] = this.settings.controlPanelTrigger.split('::');
			const wrapper = this.wrapper.querySelector(trigger);
			if (!wrapper) { return false; }

			let html = '';
			this.options.forEach(option => {
				html+= this.renderGroup(this.data, option);
			});

			this.form = h('form', { class: this.settings.clsForm, id: uuid() });
			this.form.innerHTML = html;
			this.form.addEventListener('change', this.onChange.bind(this));

			this.trigger = h('details', { class: this.settings.clsTrigger, 'data-cp-trigger': '' }, [h('summary', { 'data-cp-trigger-label': '' }, [this.settings.lblTrigger])]);
			this.trigger.appendChild(this.form);
			wrapper.insertAdjacentElement(insertMethod || 'beforeend', this.trigger);
		}
	}

	/**
	 * @function onChange
	 * @description Main event-handler, updates state
	 * @param {Event} event
	 */
	onChange(event) {	
		const element = event.target;
		const target = element.dataset.target ? document.querySelector(element.dataset.target) || this.wrapper : this.wrapper;
		if (element.dataset.type === 'property') {
			this.setCSSProperty(target, element.dataset.key, element.value, element.dataset.suffix);
		}
		else {
			this.setCSSClass(target, element);
		}
		//this.settings.fnCallback
		// set state
	}

	/**
	 * @function renderGroup
	 * @description Renders a radio-button group
	 * @param {Object} obj
	 * @param {String} key
	 */
	renderGroup(obj, key) {
		const id = uuid();
		return `
		<details data-cp-item>
			<summary data-cp-item-label><span>${obj[key].name}</span></summary>
			<div data-cp-item-panel>
			${obj[key].value.map(item => { return `
				<label aria-label="${item.name}">
					<input type="${item.type ? item.type : 'radio'}" name="${id}" value="${item.value}"
						data-key="${obj[key].key}"
						data-suffix="${item.suffix || ''}"
						data-target="${item.target || obj[key].target || ''}"
						data-type="${obj[key].type || 'property'}"
						${item.max ? `max="${item.max}"` : ''}
						${item.min ? `min="${item.min}"` : ''}
						${item.step ? `step="${item.step}"` : ''}
						${item.checked ? ' checked': ''}
					/>
					${item.icon ? item.icon : ''}
					${!item.icon && item.name ? `<span class="${item.class || ''}">${item.name}</span>` : ''}
				</label>
			`}).join('')}
			</div>
		</details>`;
	}

	/**
	 * @function setCSSProperty
	 * @description Helper-function for setting a custom CSS property on a given element
	 * @param {Node} element
	 * @param {String} property
	 * @param {String | Number} value
	 * @param {String} [suffix]
	 */
	setCSSProperty(element = document.documentElement, property, value, suffix = '') {
		element.style.setProperty(`--${property}`, `${value}${suffix}`);
	}

	/**
	 * @function setCSSClass
	 * @description Helper-function for setting a CSS-class, and removing classes matching a prefix-key.
	 * @param {Node} target
	 * @param {Node} element
	 */
	setCSSClass(target, element) {
		const keys = [...target.classList].filter(item => {return !item.includes(element.dataset.key)});
		keys.push(element.value);
		target.className = keys.join(' ');
	}
}