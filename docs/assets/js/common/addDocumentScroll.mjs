/**
 * @function addDocumentScroll
 * @param {Function} callback
 * @description Adds a scroll-listener to documentElement, adding three custom CSS-props while scrolling: 
 * --scroll-y Current vertical scroll position in absolute unit (pixels)
 * --scroll-p Current vertical scroll position in percent (deducting innerHeight from scrollHeight)
 * --scroll-d Boolean indicating scroll direction: 1 (down), 0 (up)
 */
export function addDocumentScroll(callback) {
	let ticking = false;
	let scrollYcur = 0;
	let scrollY = 0;
	window.addEventListener('scroll', () => {
		scrollY = window.scrollY;
		/* Prevent negative scroll on iOS:  */
		if (scrollY < 0) { scrollY = 0; }

		if (!ticking) {
			window.requestAnimationFrame(() => {
				document.documentElement.style.setProperty('--scroll-d', scrollYcur < scrollY ? 1 : 0);
				document.documentElement.style.setProperty('--scroll-y', scrollY);
				document.documentElement.style.setProperty('--scroll-p', `${(scrollY / (document.documentElement.scrollHeight  - window.innerHeight)) * 100}%`);
				if (typeof callback === 'function') {
					callback();
				}
				scrollYcur = scrollY;
				ticking = false;
			});
			ticking = true;
		}
	})
}