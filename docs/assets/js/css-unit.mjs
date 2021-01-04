/**
 * CSS Unit module.
 * @module /assets/js/unit
 * @requires /assets/js/common
 * @version 0.0.2
 * @summary 17-12-2020
 * @description Edit CSS Units
 * @example
 * <div data-js="unit">
 */

import CssApp from './css-app.mjs';

export default class CssUnit extends CssApp {
	constructor(element, settings, presets) {
		super(element, Object.assign({
			lblAppHeader: 'CSS <code>unit</code> Editor',
		}, settings), presets);

		this.init();
	}

	/**
	* @function init
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	async init() {
		await super.init();
		console.log(this);
	}

	/**
	* @function template
	* @description Renders main template
	*/
	template() {
		return `
		<form class="app" data-elm="app">
		<strong class="app__header">
		${this.settings.appIcon ? `	<svg class="app__icon"><use href="${this.settings.appIcon}" /></svg>` : ''}
			${this.settings.lblAppHeader}
		</strong>
		<p class="app__text">${this.settings.lblAppIntro}</p>
			<div class="app__edit">

			<div class="app__preview">
					<div data-elm="preview"></div>
				</div>

				<div class="app__controls">
					<div class="app__fieldset">
						<label class="app__label"><input type="text" data-elm="presetName" data-lpignore="true" size="15">${this.settings.lblPresetName}</label>
					</div>
					<div class="app__fieldset">
						<label class="app__label"><textarea data-elm="presetDesc" data-lpignore="true"></textarea>${this.settings.lblPresetDesc}</label>
					</div>
					<div class="app__fieldset app__button-group">
						<button type="button" class="app__button app__button--reset" data-elm="resetPreset">${this.settings.lblReset}</button>
						<button type="button" class="app__button" data-elm="addPreset">${this.settings.lblAddPreset}</button>
					</div>
				</div>
			
			</div>

			<details class="app__details" open>
				<summary class="app__summary"><span>${this.settings.lblPresets}</span></summary>
				<div class="app__panel" data-elm="presets"></div>
			</details>
			<details class="app__details">
				<summary class="app__summary"><span>${this.settings.lblCSSCode}</span></summary>
				<div class="app__code" data-elm="cssCode"></div>
			</details>
			<details class="app__details">
				<summary class="app__summary"><span>${this.settings.lblPresetCode}</span></summary>
				<div class="app__code"><pre data-elm="presetCode"></pre></div>
			</details>
		</form>`
	}
}