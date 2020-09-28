/**
 * Layout module.
 * @module /assets/js/layout
 * @requires /assets/js/common
 * @version 1.1.18
 * @summary 27-09-2020
 * @description Helper-functions for Layout Block
 * @example
 * <section data-section-type>
 */

import { h } from './common/h.mjs';
import { stringToType } from './common/stringToType.mjs';
import ControlPanel from './controlpanel.mjs';
import KeyHandler from './keyhandler.mjs';
import Slider from './slider.mjs';
export class Layout {
	constructor(settings) {
		this.settings = Object.assign({
			clsInnerPage: 'c-lay__inner--page',
			clsItemPage: 'c-lay__item--page'
		}, stringToType(settings));
		this.init();
	}

	/**
	 * @function ebook
	 * @param {NodeList} selector
	 * @description Swipe an article like an ebook, recalculates "pages" based on columns.
	*/
	ebook(selector) {
		selector.forEach(ebook => {
			ebook.dataset.ebook = "item";
			const inner = ebook.parentNode;
			inner.dataset.ebook = "inner";
			inner.tabIndex = "0";
			const wrapper = h('div', { 'data-ebook': 'wrapper' });
			inner.appendChild(wrapper);

			const resizeObserver = new ResizeObserver(() => {
				this.ebookRecalc(ebook, wrapper);
			});
			resizeObserver.observe(ebook);
		})
	}

	ebookRecalc(ebook, wrapper) {
		const pages = Math.ceil(ebook.scrollWidth / ebook.offsetWidth);
		wrapper.innerHTML = '';
		for (let index = 0; index < pages; index++) {
			const page = h('div', { 'data-ebook': 'page' }, [`${index+1} / ${pages}`]);
			wrapper.appendChild(page);
		}
	}

	ebookUpdate(parent, element) {
		const ebook = parent.querySelector(`[data-ebook="item"]`);
		const wrapper = parent.querySelector(`[data-ebook="wrapper"]`);

		switch(element.dataset.key) {
			case 'cp-align':
			case 'cp-ff':
			case 'cp-fz':
			case 'cp-lh':
			case 'cp-w': 
				this.ebookRecalc(ebook, wrapper);
			break;
			default: break;
		}
	}

	/**
	 * @function expandCollapse
	 * @param {NodeList} selector
	 * @description Expands/collapses a section
	*/
	expandCollapse(selector) {
		function toggleFunc(toggle, section, outer, label) {
			const expanded = section.dataset.expanded === 'true';
			const height = outer.scrollHeight;
			const rect = section.getBoundingClientRect();
			const scrollPosition = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
			window.setTimeout( () => {
				window.scrollTo({ top: parseInt(rect.top + scrollPosition, 10), behavior: 'smooth'});
			}, 250);

			if (expanded) {
				outer.removeAttribute('style');
				section.dataset.expanded = 'false';
				section.setAttribute('aria-expanded', 'false');
			}
			else {
				outer.style.height = `${height}px`;
				section.dataset.expanded = 'true';
				section.setAttribute('aria-expanded', 'true');
			}

			toggle.dataset.expanded = expanded ? 'false' : 'true';
			label.innerText = expanded ? toggle.dataset.toggleCollapsed : toggle.dataset.toggleExpanded;
		}

		selector.forEach(toggle => {
			const label = toggle.querySelector('[data-toggle-label');
			const section = toggle.closest('[data-section-type]');
			const outer = section.querySelector('[data-outer]');
			toggle.addEventListener('click', () => {
				toggleFunc(toggle, section, outer, label);
			})
		});
	}

	/**
	 * @function fetchContent
	 * @param {NodeList} selector
	 * @description Grabs async content from `data-fetch-from`-attributes, inserts innerHTML from matching `data-fetch-content`-attributes
	*/
	fetchContent(selector) {
		selector.forEach(item => {
			fetch(item.dataset.fetchFrom).then(response => {
				return response.text();
			}).then(html => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				const content = doc.querySelector('[data-fetch-content]');
				if (content) {
					item.innerHTML = content.innerHTML;
				}
			}).catch(function (err) {
				console.warn('Could not fetch content: ', err);
			});
		})
	}

	/**
	 * @function init
	 * @description Init Layout Block
	*/
	init() {
		this.lazyLoad();
		this.backToTop = document.querySelector(`[data-back-to-top]`);
		this.ebook(document.querySelectorAll(`[data-item-type="ebook"] .c-lay__item`));
		this.expandCollapse(document.querySelectorAll(`[data-toggle-expanded]`));
		this.isTouch = ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
		this.itemPopup(document.querySelectorAll(`[data-item-type*='page'] .c-lay__item`));
		this.observeIntersections(document.querySelectorAll('[data-animation],[data-animation-items],[data-set-props]'), '[data-inner]');
		this.toggleLayout(document.querySelectorAll(`[data-layout-label]`));
		this.fetchContent(document.querySelectorAll(`[data-fetch-from]`))

		let ticking = false;
		let scrollY = 0;
		window.addEventListener('scroll', () => {
			scrollY = window.scrollY;
			if (!ticking) {
				window.requestAnimationFrame(() => {
					document.documentElement.style.setProperty('--scroll-y', scrollY);
					if (this.backToTop) {
						this.backToTop.style.opacity = window.scrollY > window.screen.height * 4 ? 1 : 0;
					}
					ticking = false;
				});
				ticking = true;
			}
		})

		/* Init Sliders */
		const sliders = document.querySelectorAll(`[data-section-type="slider"], [data-toggle-layout="slider"`);
		sliders.forEach(slider => {
			const preview = slider.dataset.preview;
			if (!(this.isTouch && (preview === 'both' || preview === 'next'))) {
				new Slider(slider, slider.dataset);
			}
		});

		/* Init Control Panels */
		const panels = document.querySelectorAll(`[data-control-panel]:not([data-control-panel=""])`);
		panels.forEach(panel => {
			/* TODO! FIX: DO NOT RUN ebookUpdate on all CP's */
			new ControlPanel(panel, panel.dataset, this.ebookUpdate.bind(this));
		});

		this.loadPopupPage();
		window.addEventListener('popstate', () => {
			this.loadPopupPage();
		})
	}

	/**
	 * @function itemHandleKeys
	 * @param {Object} obj
	 * @description Key-handler for item-popup	
	*/
	itemHandleKeys(obj) {
		const data = obj.element.firstElementChild.dataset;
		const hasPopup = obj.element.dataset.pageOpen

		if (obj.event.code === 'Space') {
			if (!hasPopup) {
				obj.event.preventDefault();
				this.setModal(true);
				this.setPage('pageid', data.pageId, data.title);
				obj.element.dataset.pageOpen = 'true';
				obj.element.__scroll = obj.element.parentNode.scrollLeft;
				obj.element.firstElementChild.scrollTo({ top: 0, behavior: 'auto' });
			}
		}
		if (obj.key === 'Escape') {
			this.setModal(false);
			this.setPage('pageid');
			obj.element.focus();
			obj.element.removeAttribute('data-page-open');
			obj.element.parentNode.scrollTo({ left: obj.element.__scroll, behavior: 'auto' });
		}
		if (obj.key === 'Tab') {
			if (hasPopup) {
				obj.event.preventDefault()
				if (obj.rows.length) {
					let row = obj.row;
					obj.rows[row].focus();
					row++;
					if (row >= obj.rows.length) { row = 0; }
					obj.element.keyHandler.row = row;
				}
			}
		}
	}

	/**
	 * @function itemPopup
	 * @param {NodeList} selector
	 * @description Adds listener to popup-items (open items in full screen)
	*/
	itemPopup(selector) {
		selector.forEach(item => {
			item.keyHandler = new KeyHandler(item, { callBack: this.itemHandleKeys, callBackScope: this, preventDefaultKeys: '' });
			item.firstElementChild.setAttribute('aria-modal', true);
			item.firstElementChild.setAttribute('role', 'dialog');
			item.setAttribute('tabindex', 0);
			item.addEventListener('click', (event) => {
				if (item.dataset.pageOpen) {
					if (event.target === item) {
						this.setModal(false);
						item.removeAttribute('data-page-open');
						item.parentNode.scrollTo({ left: item.__scroll, behavior: 'auto' });
						if (this.isTouch) { item.parentNode.classList.remove(this.settings.clsInnerPage); }
						this.setPage('pageid');
					}
				} else {
					this.setModal(true);
					item.dataset.pageOpen = 'true';
					item.__scroll = item.parentNode.scrollLeft;
					const section = item.closest('[data-section-type]')
					if (this.isTouch && section.dataset.sectionType !== 'stack') {
						item.parentNode.classList.add(this.settings.clsInnerPage);
					}
					const data = item.firstElementChild.dataset;
					this.setPage('pageid', data.pageId, data.title);
					item.firstElementChild.scrollTo({ top: 0, behavior: 'auto' });
				}
			});
		});
	}

	/**
	 * @function lazyLoad
	 * @description Use Intersection Observer to lazy-load iframes, images, picture-source and videos
	*/
	lazyLoad() {
		const elements = document.querySelectorAll("iframe[data-src], img[data-src], video");
		const lazyObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					const element = entry.target;
					const tagName = element.tagName;
					if (tagName === 'VIDEO') {
						for (let source in element.children) {
							const videoSource = element.children[source];
							if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
								videoSource.src = videoSource.dataset.src;
							}
						}
						element.load();
					}
					else {
						element.src = element.dataset.src;
						delete element.dataset.src;
						if (element.dataset.srcset) {
							element.srcset = element.dataset.srcset;
							delete element.dataset.srcset;
						}
					}
					lazyObserver.unobserve(element);
				}
			});
		});
		elements.forEach(function(element) {
			lazyObserver.observe(element);
		});
	}

	/**
	 * @function loadPopupPage
	 * @description If URL contains `pageid`, show that `page` (popup) 
	*/
	loadPopupPage() {
		const params = new URLSearchParams(document.location.search);
		if (params.has('pageid')) {
			const page = document.querySelector(`[data-page-id="${params.get('pageid')}"]`);
			if (page) {
				page.parentNode.dataset.pageOpen = 'true';
				const section = page.closest('[data-section-type]')
				if (this.isTouch && section.dataset.sectionType !== 'stack') {
					page.closest('[data-inner]').classList.add(this.settings.clsInnerPage);
				}
				this.setModal(true);
			}
		}
		else {
			const page = document.querySelector('[data-page-open]');
			if (page) {
				page.removeAttribute('data-page-open');
				const inner = page.closest('[data-inner]');
				inner.classList.remove(this.settings.clsInnerPage);
				this.setModal(false);
			}
		}
	}

	/**
	 * @function observeIntersections
	 * @param {NodeList} selector
	 * @description Observes sections with animations
	*/
	observeIntersections(selector, itemSelector) {
		const io = new IntersectionObserver((entries) => {	
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const section = entry.target;

					if (section.dataset.setProps) {
						section.style.setProperty('--ratio', entry.intersectionRatio);
						section.style.setProperty('--top', entry.boundingClientRect.y < entry.rootBounds.y ? 1 : 0);
					}

					/* Use custom intersectionRatio from dataset, or use fallback: 0 */
					const ratio = parseInt(section.dataset.animationIntersection || 0, 10) / 100;

					if (entry.intersectionRatio >= ratio) {
						/* Unobserve section, unless `setProps` is enabled */
						if (!section.dataset.setProps) {
							io.unobserve(entry.target);
						}

						if (!section.dataset.animationDone) {
							if (section.dataset.animation) {
								section.classList.add(section.dataset.animation);
							}

							if (section.dataset.animationItems && section.__items) {
								section.__items.forEach(item => {
									item.classList.add(section.dataset.animationItems)
								});
								delete section.__items;
							}
							/* Prevent animations from running again, if `setProps` is enabled */
							section.dataset.animationDone = 'true';
						}
					}
				}
			})
			},
			{
				threshold: [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0]
			}
			);
		selector.forEach(section => {
			if (section.dataset.animationItems && itemSelector) {
				const items = section.querySelector(itemSelector);
				section.__items = items ? [...items.children] : [];
			}
			io.observe(section);
		});
	}

	/**
	 * @function setModal
	 * @param {Boolean} open
	 * @description Prevents overflow/bounce on iOS devices when opening a modal. Needs custom prop `--scroll-y`
	*/
	setModal(open) {
		const body = document.body;
		const root = document.documentElement;
		const scrollY = open ? root.style.getPropertyValue('--scroll-y') || 0 : body.style.top;
		if (open) { root.style.scrollBehavior = 'auto'; }
		body.style.position = open ? 'fixed' : '';
		body.style.top = open ? `-${scrollY}px` : '';
		if (!open) {	
			window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
			root.style.scrollBehavior = 'smooth';
		}
	}

	/**
	 * @function setPage
	 * @param {String} key
	 * @param {String} value
	 * @param {String} title
	 * @description Upadtes search-params in a url - Sets a `virtual page`.
	*/
	setPage(key, value = '', title = document.title) {
		const params = new URLSearchParams(location.search);
		const url = new URL(location.href);

		if (value) {
			params.append(key, value);
			url.search = params.toString();
			history.pushState({page: value-0}, title, url);
		}
		else {
			params.delete(key);
			url.search = params.toString();
			history.replaceState({page: 0}, title, url);
		}
	}

	/**
	 * @function toggleLayout
	 * @param {NodeList} selector
	 * @description Toggles between `stack` and `slider`
 */
	toggleLayout(selector) {
		selector.forEach(toggle => {
			toggle.addEventListener('click', () => {
				const section = toggle.closest('[data-section-type]');
				const currentLayout = section.dataset.sectionType;
				const newLayout = section.dataset.toggleLayout;
				const header = toggle.innerText === toggle.dataset.layoutLabel ? toggle.dataset.layoutLabelToggle : toggle.dataset.layoutLabel;

				section.dataset.toggleLayout = currentLayout;
				section.dataset.sectionType = newLayout;
				toggle.innerText = header;
			});
		});
	}
}