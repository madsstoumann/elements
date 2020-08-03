/**
 * Layout module.
 * @module /assets/js/controlPanel
 * @requires /assets/js/common
 * @version 1.0.0
 * @summary 02-08-2020
 * @description Control Panel
 * @example
 * <div data-control-panel="alignment audio background brightness colormode contrast fontsize spacing tabstops typography width">
 */

import { stringToType, uuid } from './common.mjs';

export class ControlPanel {
	constructor(element, settings, callback) {
		this.settings = Object.assign({
			
		}, stringToType(settings));
		this.init();
	}
	init() {
		/*
			Update Custom Prop OR CSS Class
			Load State
			Set State
			UUID per ControlPanel
		
		*/

		this.options = {
			alignment: '',
			audio: '',
			background: ''
		}
	}

	test(selector) {
		// controlPanel(selector/target, config)
		const cp = {
			alignment: {
				key: 'c-lay__cp-align',
				name: 'Alignment',
				value: [
					{
						icon: `<svg viewBox="0 0 100 100"><path d="M40,30 L60,30Z M30,40 L70,40Z M20,50 L80,50Z M30,60 L70,60Z M40,70 L60,70Z" /></svg>`,
						name: 'Center Text',
						value: 'c-lay__cp-align--center'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><path d="M20,30 L80,30Z M20,40 L80,40Z M20,50 L80,50Z M20,60 L80,60Z M20,70 L80,70Z" /></svg>`,
						name: 'Justify Text',
						value: 'c-lay__cp-align--justify'
					},
					{
						checked: true,
						icon: `<svg viewBox="0 0 100 100"><path d="M20,30 L80,30Z M20,40 L60,40Z M20,50 L80,50Z M20,60 L70,60Z M20,70 L60,70Z" /></svg>`,
						name: 'Left-align Text',
						value: 'c-lay__cp-align--left'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><path d="M20,30 L80,30Z M40,40 L80,40Z M30,50 L80,50Z M20,60 L80,60Z M40,70 L80,70Z" /></svg>`,
						name: 'Right-align Text',
						value: 'c-lay__cp-align--right'
					}
				]
			},
			audio: {},
			background: {
				key: 'c-lay__cp-bgc',
				name: 'Background Color',
				value: [
					{
						checked: true,
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#ffffff" /></svg>`,
						name: 'Light',
						value: 'c-lay__cp-bgc--light'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#000000" /></svg>`,
						name: 'Dark',
						value: 'c-lay__cp-bgc--dark'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#f8f0db" /></svg>`,
						name: 'Sepia',
						value: 'c-lay__cp-bgc--sepia'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#cae6cf" /></svg>`,
						name: 'Green',
						value: 'c-lay__cp-bgc--green'
					}
				]
			},
			spacing: {
				key: 'c-lay__cp-space',
				name: 'Spacing',
				value: [
					{
						icon: `<svg viewBox="0 0 100 100"><path d="M20,40 L80,40Z M20,50 L80,50Z M20,60 L80,60Z" /></svg>`,
						name: 'Small',
						value: 'c-lay__cp-space--s'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><path d="M20,35 L80,35Z M20,50 L80,50Z M20,65 L80,65Z" /></svg>`,
						name: 'Medium',
						value: 'c-lay__cp-space--m'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><path d="M20,30 L80,30Z M20,50 L80,50Z M20,70 L80,70Z" /></svg>`,
						name: 'Large',
						value: 'c-lay__cp-space--l'
					}
				]
			},
			size: {
				key: 'c-lay__cp-fz',
				name: 'Size',
				value: [
					{
						checked: true,
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#ffffff" /></svg>`,
						name: 'Small',
						value: 'c-lay__cp-fz--s'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#000000" /></svg>`,
						name: 'Medium',
						value: 'c-lay__cp-fz--m'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#f8f0db" /></svg>`,
						name: 'Large',
						value: 'c-lay__cp-fz--l'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#cae6cf" /></svg>`,
						name: 'X-Large',
						value: 'c-lay__cp-fz--xl'
					}
				]
			},
			typography: {
				key: 'c-lay__cp-f',
				name: 'Typography',
				value: [
					{
						checked: true,
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#ffffff" /></svg>`,
						name: 'Sans Serif',
						value: 'c-lay__cp-f--sanserif'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#000000" /></svg>`,
						name: 'Serif',
						value: 'c-lay__cp-f--serif'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#f8f0db" /></svg>`,
						name: 'Monspace',
						value: 'c-lay__cp-f--monospace'
					},
					{
						icon: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#cae6cf" /></svg>`,
						name: 'Rounded',
						value: 'c-lay__cp-f--rounded'
					}
				]
			}
		}
		selector.forEach(panel => {
			const options = panel.dataset.controlPanel;
			const outer = panel.querySelector('[data-outer]');
			let html = '';

			const hasAlignment = options.includes('alignment');
			const hasAudio = options.includes('audio');
			const hasBackground = options.includes('background');
			const hasMargin = options.includes('margin');
			const hasSpacing = options.includes('spacing');
			const hasTypography = options.includes('typography');

			const renderGroup = (obj, key) => {
				const id = uuid();
				return `
				<fieldset>
					<legend>${obj[key]['name']}</legend>
					${obj[key]['value'].map(item => `
						<label aria-label="${item.name}">
							<input type="radio" name="${id}" data-key="${obj[key]['key']}" value="${item.value}" ${item.checked ? ' checked': ''} />
							${item.icon}
						</label>
					`).join('')}
				</fieldset>`;
			}

			const renderWrapper = (html) => { return `
				<details class="c-lay__cp">
					<summary>Settings</summary>
					<form data-control-panel>${html}</form>
			</details>
				`
			}

		if (hasBackground) { html += renderGroup(cp, 'background'); }
		if (hasSpacing) { html += renderGroup(cp, 'spacing'); }
		if (hasAlignment) { html += renderGroup(cp, 'alignment'); }
		if (hasAudio) { html += renderGroup(cp, 'audio'); }
		if (hasTypography) { html += renderGroup(cp, 'typography'); }
		if (hasTypography) { html += renderGroup(cp, 'size'); }
		
		outer.insertAdjacentHTML('afterbegin', renderWrapper(html));
		const form = outer.querySelector('[data-control-panel]');
		form.addEventListener('change', (event) => appChange(event.target));

		function appChange(element) {	
			const keys = [...panel.classList].filter(item => !item.includes(element.dataset.key));
			keys.push(element.value);
			panel.className = keys.join(' ');
		}

		});
	}
}