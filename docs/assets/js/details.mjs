/**
 * Details
 * @module details.mjs
 * @version 0.1.00
 * @summary 05-02-2020
 * @author Mads Stoumann
 * @description Helper-methods for `details`-tag
 */

 /**
 * @function animateDeatils
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
				const detailRect = detail.getBoundingClientRect();
				const panel = detail.firstElementChild.nextElementSibling;

				/* Store current width/height in data-attributes, set fixed height, remove overflow */
				detail.dataset.height = detailRect.height;
				detail.dataset.width = detailRect.width;
				detail.style.height = `${detailRect.height}px`;
				detail.style.overflow = 'hidden';

				/* Set [open] to enable getting dimensions of hidden panel */
				detail.open = true;
				const panelRect = panel.getBoundingClientRect();
				detail.dataset.panelHeight = panelRect.height;
				detail.open = false;
			}
		})
	});

	details.forEach(detail => {
		RO.observe(detail);
		detail.addEventListener("toggle", () => {
			const height = detail.open ? parseInt(detail.dataset.height, 10) + parseInt(detail.dataset.panelHeight, 10) : detail.dataset.height;
			detail.style.height = `${height}px`;
		});
	});
}
