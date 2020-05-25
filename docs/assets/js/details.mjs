/**
 * Details
 * @module details.mjs
 * @version 0.1.10
 * @summary 25-05-2020
 * @author Mads Stoumann
 * @description Helper-methods for animating `details`-tag
 */

 /**
 * @function animateDetails
 * @param {String} selector querySelector
 * @description Calculates height of <detail>-elements for smooth animations.
 */
export function animateDetails(selector, wrapper = document) {
	const details = wrapper.querySelectorAll(selector);
	const RO = new ResizeObserver(entries => {
		return entries.forEach(entry => {
			const detail = entry.target;
			const width = parseInt(detail.dataset.width, 10);
			if (width !== entry.contentRect.width) {
				/* Clear previous calculations */
				detail.removeAttribute('style');

				detail.open = false;
				let rect = detail.getBoundingClientRect();
				detail.dataset.width = rect.width;
				detail.style.setProperty(`--collapsed`,`${rect.height}px`);

				/* Set [open] to enable getting dimensions of hidden panel */
				detail.open = true;
				rect = detail.getBoundingClientRect();
				detail.style.setProperty(`--expanded`,`${rect.height}px`);
				detail.open = false;
			}
		})
	});

	details.forEach(detail => {
		RO.observe(detail);
	});
}
