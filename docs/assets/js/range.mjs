/**
 * RangeSlider module.
 * @module /assets/js/range
 * @requires /assets/js/common
 * @version 0.1.00
 * @summary 20-03-2020
 * @description Range Sluder
 * @example
 * <input type="range" data-js="range">
 */

import { stringToType, uuid } from './common.mjs';

export default class RangeSlider {
	constructor(element, settings) {
		this.settings = Object.assign({
			clsOutput: 'c-rng__output',
			rangeOutput: false,
			rangeType: '',
			varPercent: '--rng-percent',
			varPercentUpper: '--rng-percent-upper',
			varThumb: '--rng-thumb-w',
			varUnit: '--rng-unit'
		}, stringToType(settings));

		this.initRange(element);
	}

	/**
	* @function initRange
	* @param {Node} range
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	initRange(range) {
		const id = range.id || uuid();
		const min = parseInt(range.min, 10);
		const multiplier = 100 / ((parseInt(range.max, 10) || 100) - min);

		range.__lower = this.settings.rangeType === 'upper' ? range.parentNode.querySelector(`[data-range-type="lower"]`) : null;
		range.__output = this.settings.rangeOutput ? document.createElement('output') : null;

		if (range.__output) {
			range.__output.for = id;
			range.__output.className = this.settings.clsOutput;
			range.__output.style.setProperty(this.settings.varThumb, getComputedStyle(range).getPropertyValue(this.settings.varThumb));
			range.id = id;
			range.parentNode.insertBefore(range.__output, range);
		}

		range.addEventListener('input', () => { this.updateRange(range, min, multiplier) });
		range.dispatchEvent(new Event('input'));
	}

	/**
	* @function updateRange
	* @param {Node} range
	* @param {Number} [minRange]
	* @param {Number} [multiplier]
	* @description Updates CSS Custom Props when range-input is modified
	*/
	updateRange(range,  minRange = 0, multiplier = 1) {
		const value = (range.valueAsNumber - minRange) * multiplier;
		range.style.setProperty(this.settings.varPercent, `${value}%`);
		if (range.__lower) {
			range.__lower.style.setProperty(this.settings.varPercentUpper, `${value}%`);
		}
		if (range.__output) {
			range.__output.style.setProperty(this.settings.varUnit, `${value}`);
			range.__output.innerText = range.value;
		}
	}
}