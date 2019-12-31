/**
 * Common
 * @module common.mjs
 * @version 0.8.00
 * @summary 30-10-2019
 * @author Mads Stoumann
 * @description Generic, small helper-functions
 */

/**
 * @function arraySelector
 * @param {Array|NodeList|String} selector Array, NodeList or QuerySelector
 * @description returns an array from a Nodelist or QuerySelector
 * @reurns Array
 */
export function arraySelector(selector) {
	let array = selector;
	if (!Array.isArray(array)) {
		array =
			typeof selector === 'object'
				? selector.nodeName
					? [selector]
					: [...selector]
				: Array.from(document.querySelectorAll(selector));
	}
	return array;
}

/**
 * @function clickOutside
 * @param {Function} fn
 * @param {Node} element
 * @description Adds "outside element click handler"
 */
export function clickOutside(fn, element) {
	document.addEventListener('click', event => {
		fn(element.contains(event.target));
	});
}

export function debounced(delay, fn) {
	let timerId;
	return function(...args) {
		if (timerId) {
			clearTimeout(timerId);
		}
		timerId = setTimeout(() => {
			fn(...args);
			timerId = null;
		}, delay);
	};
}

/**
 * @function deSelect
 * @description Clears a selection
 */
export function deSelect() {
	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	} else if (document.selection) {
		document.selection.empty();
	}
}

/**
 * @function focusable
 * @param {Node} element
 * @description Returns an array of focusable elements from a parent-element
 * @returns Array
 */
export function focusable(element) {
	return Array.from(
		element.querySelectorAll(
			'button, [href], select, textarea, input:not([type="hidden"]), [tabindex]:not([tabindex="-1"])'
		)
	);
}

/**
 * @function h
 * @param {String} type
 * @param {Array | Object} attributes
 * @param {Array} [children]
 * @description DOM-factory
 * @returns Node
 */
export function h(type, attributes, children = []) {
	const element = document.createElement(type);
	for (let key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
	if (children.length) {
		children.forEach(child => {
			if (typeof child === 'string') {
				element.appendChild(document.createTextNode(child));
			} else {
				element.appendChild(child);
			}
		});
	}
	return element;
}

/**
 * @function lazyLoad
 * @description Handle lazy loading of images and frames
 */
export function lazyLoad(selector = '[loading="lazy"]') {
	const medialist = Array.from(document.querySelectorAll(selector));
	const setMedia = media => {
		media.src = media.dataset.src;
		if (media.dataset.srcset) {
			media.srcset = media.dataset.srcset;
		}
	};
	if ('loading' in HTMLImageElement.prototype) {
		medialist.forEach(media => {return setMedia(media)});
	} else if ('IntersectionObserver' in window) {
		const loadLazy = target => {
			const io = new IntersectionObserver((entries, observer) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						setMedia(entry.target);
						observer.disconnect();
					}
				});
			});
			io.observe(target);
		};
		medialist.forEach(loadLazy);
	}
}

/**
 * @function loadScript
 * @param {String} src
 * @param {Boolean} [async]
 * @description Adds script-block
 */
export function loadScript(src, async = true) {
	const script = document.createElement('script');
	script.async = async;
	script.src = src;
	document.body.appendChild(script);
}

/**
 * @function mark
 * @param {string} item String with result
 * @param {string} term Selected search-term
 * @description Highlights instances of [term] within [item]
 * @return {String}
 */
export function mark(item, term) {
	const regExpEscape = str => {return str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')};
	return term.trim() === ''
		? item
		: item.replace(RegExp(regExpEscape(term.trim()), 'gi'), '<mark>$&</mark>');
}

export function replaceTagInString(str, oldTag, newTag) {
	const start = new RegExp(`<${oldTag}`, "gi");
	const end = new RegExp(`</${oldTag}`, "gi");
	return str.replace(start, `<${newTag}`).replace(end, `</${newTag}`);
}

/**
 * @function selectAll
 * @param {Node} element
 * @description Creates a selection-range
 */
export function selectAll(element) {
	const range = document.createRange();
	range.selectNodeContents(element);
	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
}

	/**
	 * @function stringToType
	 * @param {Object} obj
	 * @description Convert data-attribute value to type-specific value
	 */
	export function stringToType(obj) {
		const object = Object.assign({}, obj);
		Object.keys(object).forEach(key => {
			if (object[key].charAt(0) === ':') {
				object[key] = JSON.parse(object[key].slice(1));
			}
		});
		return object;
	}

/**
 * @function uuid
 * @description DOM-factory
 * @returns String
 */
export function uuid() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		{return (
			c ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)}
	);
}
