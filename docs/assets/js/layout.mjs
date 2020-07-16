/**
 * Layout module.
 * @module /assets/js/layout
 * @requires /assets/js/common
 * @version 1.1.03
 * @summary 11-07-2020
 * @description Helper-functions for Layout Block
 * @example
 * <section data-section-type>
 */

import { debounced, h, stringToType } from './common.mjs';
export class Layout {
	constructor(settings) {
		this.settings = Object.assign({
		}, stringToType(settings));
		this.init();
	}

	init() {
		this.backToTop = document.querySelector(`[data-back-to-top]`);
		this.expandCollapse(document.querySelectorAll(`[data-toggle-expanded]`));
		this.isTouch = ('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
		this.itemPopup(document.querySelectorAll(`[data-item-type='popup'] .c-lay__item`));
		this.observeAnimations(document.querySelectorAll('[data-animation]'));
		this.toggleLayout(document.querySelectorAll(`[data-layout-collapsed]`));

		window.addEventListener('scroll', debounced(200, () => {
			document.documentElement.style.setProperty('--scroll-y', window.scrollY);
			/* Show `back-to-top` if scrolled more than 4 screens: https://www.nngroup.com/articles/back-to-top/ */
			if (this.backToTop) {
				this.backToTop.style.opacity = window.scrollY > window.screen.height * 4 ? 1 : 0;
			}
		}))

		const sliders = document.querySelectorAll(`[data-section-type='slider']`);
		sliders.forEach(slider => {
			const preview = slider.dataset.preview;
			if (!(this.isTouch && (preview === 'both' || preview === 'next'))) {
				new Slider(slider, slider.dataset);
			}
		})
	}

	/**
	 * @function itemPopup
	 * @param {NodeList} selector
	 * @description Adds listener to opup-items (open items in full screen)
	*/
	itemPopup(selector, popupClass = 'c-lay__item--popup', popupWrapper = 'c-lay__inner--popup') {
		selector.forEach(item => {
			item.addEventListener('click', (event) => {
				if (item.classList.contains(popupClass)) {
					if (event.target === item) {
						const body = document.body;
						const scrollY = body.style.top;
						body.style.position = '';
						body.style.top = '';
						window.scrollTo(0, parseInt(scrollY || '0') * -1);
						item.classList.remove(popupClass);
						if (this.isTouch) {
							item.parentNode.classList.remove(popupWrapper);
						}
						document.documentElement.style.scrollBehavior = 'smooth';
					}
				} else {
					document.documentElement.style.scrollBehavior = 'auto';
					const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
					const body = document.body;
					const section = item.closest('.c-lay');
					body.style.position = 'fixed';
					body.style.top = `-${scrollY}px`;
					item.classList.add(popupClass);
					if (this.isTouch && section.dataset.sectionType === 'slider') {
						item.parentNode.classList.add(popupWrapper);
					}
				}
			});
		});
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
			if (expanded) {
				outer.removeAttribute('style');
				section.dataset.expanded = 'false';
				section.setAttribute('aria-expanded', 'false');
				const rect = section.getBoundingClientRect();
				const scrollPosition = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
				window.setTimeout( () => {
					window.scrollTo({ top: parseInt(rect.top + scrollPosition, 10), behavior: 'smooth'});
				}, 250);
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
	 * @function observeAnimations
	 * @param {NodeList} selector
	 * @description Observes sections with animations
	*/
	observeAnimations(selector) {
		const io = new IntersectionObserver((entries) => {	
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const section = entry.target;
					const animation = section.dataset.animation;
					const target = section.dataset.animationTarget;
					if (target) {
						const items = section.querySelectorAll(section.dataset.animationTarget);
						items.forEach(item => {
							item.classList.add(animation)
						});
						if (target === 'both') {
							section.classList.add(animation);
						}
					}
					else {
						section.classList.add(animation);
					}
					io.unobserve(entry.target);
				}
				},
				{
					threshold: [0.5]
				});
			});
		
		selector.forEach(section => {
			io.observe(section);
		});
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
				if (section.dataset.sectionType === 'slider') {
					section.dataset.sectionType = 'stack';
					toggle.innerText = toggle.dataset.layoutExpanded;
				}
				else if (section.dataset.sectionType === 'stack') {
					section.dataset.sectionType = 'slider';
					toggle.innerText = toggle.dataset.layoutCollapsed;
				}
			});
		});
	}
}

/**
 * Slider
 * @requires /assets/js/common
 * @version 1.1.05
 * @summary 15-07-2020
 * @description Slider-functionality for Layout Block
 * @example
 * <section data-section-type="slider">
 */
export class Slider {
	constructor(element, settings) {
		this.settings = Object.assign({
			autoPlay: 'false',
			clsBtnNext: 'c-lay__nav-btn',
			clsBtnPrev: 'c-lay__nav-btn',
			clsDot: 'c-lay__dot',
			clsDotCur: 'c-lay__dot--current',
			clsDotWrap: 'c-lay__dots',
			clsNav: 'c-lay__nav',
			clsNavInner: 'c-lay__nav-inner',
			clsOverflow: 'c-lay__inner--overflow',
			lblGoToPage: 'Go to page',
			lblItemRole: 'slide',
			lblNext: 'Next',
			lblPrev: 'Prev',
			lblRole: 'carousel',
			nav: '',
			scrollBehavior: 'smooth',
			varGap: '--lay-item-gap',
			varItemsPerPage: '--lay-items-per-page'
		}, stringToType(settings));

		this.slider = element;
		this.init();
	}

	/**
	 * @function getGap
	 * @description Return current gap-value
	 */
	getGap() {
		return getComputedStyle(this.slider).getPropertyValue(this.settings.varGap) || `20px`;
	}

	/**
	 * @function getItemsPerPage
	 * @description Return current items per page
	 */
	getItemsPerPage() {
		return getComputedStyle(this.slider).getPropertyValue(this.settings.varItemsPerPage) - 0 || 0;
	}

	/**
	 * @function handleScroll
	 * @description Updates pagination etc., when scroll-position change, either by next/prev-buttons or manual pointer-event.
	 */
	handleScroll() {
		const gap = this.slider.dataset.preview === 'next' ? this.state.gap : 0;
		const page = Math.round(this.elements.inner.scrollLeft / Math.floor((this.itemsPerPage * (this.state.itemWidth + gap))));
		this.state.page = (page + 1);

		if (!this.state.loop) {
			/* Set navigation buttons to disabled, if first or last */
			this.elements.next.toggleAttribute('disabled', this.state.page === this.state.pages);
			this.elements.prev.toggleAttribute('disabled', this.state.page === 1);
		}
		if (this.itemsPerPage === 1) {
			this.updateDots(page);
		}
	}

	/**
	 * @function init
	 * @description Creates elements, adds eventListeners
	 */
	init() {
		/* Get text-direction */
		this.dir = this.slider.dir || document.dir || 'ltr';
		this.isChrome = window.navigator.userAgent.indexOf("Chrome") > -1;
		
		this.hasArrows = this.settings.nav.includes('arrows');
		this.hasDots = this.settings.nav.includes('dots');
		this.hasScroll = this.settings.nav.includes('scroll');

		/* Create elements */
		this.elements = {
			inner: this.slider.querySelector('[data-inner]'),
			nav: h('nav', { class: this.settings.clsNav }, [h('div', { class: this.settings.clsNavInner })]),
			outer: this.slider.querySelector('[data-outer]')
		}

		this.elements.outer.insertBefore(this.elements.nav, this.elements.inner);

		/* Add navigation arrows */
		if (this.hasArrows) {
			this.elements.next = h('button', { class: this.settings.clsBtnNext, rel: 'next', 'aria-label': this.settings.lblNext }, [h('i')]);
			this.elements.prev = h('button', { class: this.settings.clsBtnPrev, rel: 'prev', 'aria-label': this.settings.lblPrev }, [h('i')]);

			this.elements.nav.firstElementChild.appendChild(this.elements.prev);
			this.elements.nav.firstElementChild.appendChild(this.elements.next);

			this.elements.next.addEventListener('click', () => {
				this.state.page++;
				if (this.state.page > this.state.pages) { 
					this.state.page = this.state.loop ? 1 : this.state.pages;
				}
				this.scrollToPage();
			});
	
			this.elements.prev.addEventListener('click', () => {
				this.state.page--;
				if (this.state.page < 1) { 
					this.state.page = this.state.loop ? this.state.pages : 1;				
				}
				this.scrollToPage();
			});
		}
		
		/* Add navigation dots */
		if (this.hasDots) {
			this.elements.dots = h('nav', { class: this.settings.clsDotWrap });
			this.elements.outer.appendChild(this.elements.dots);
		}

		/* Detect resize: Add/remove dots and arrows */
		const resizeObserver = new ResizeObserver(() => {
			this.refreshSlider()
		});

		resizeObserver.observe(this.slider);

		/* Add eventListeners */
		let timeout = '';
		this.elements.inner.addEventListener('scroll', () => {
			if (timeout) {
				window.cancelAnimationFrame(timeout);
			}
			timeout = window.requestAnimationFrame(() => {
				this.handleScroll();
			});
		});
		this.slider.__refreshSlider = this.refreshSlider.bind(this);
		this.refreshSlider();

		/* Set aria-attributes */
		this.elements.inner.setAttribute('aria-live', 'polite');
		// this.slider.setAttribute('aria-roledescription', this.settings.lblRole);
		this.state.items.forEach((slide, index) => {
			slide.setAttribute('aria-label', `${this.settings.lblGoToPage} ${index+1}/${this.state.pages}`);
			// slide.setAttribute('aria-roledescription', this.settings.lblItemRole);
			// slide.setAttribute('role', 'group');
		});

		/* Autoplay */
		if (this.settings.autoPlay && this.settings.autoPlay !== 'false' ) {
			window.setInterval( () => {
				this.state.page++;
				if (this.state.page > this.state.pages) { 
					this.state.page = 1;
				}
				this.scrollToPage();
			}, parseInt(this.settings.autoPlay, 10) || 3000);
		}
	}

	/**
	 * @function refreshSlider
	 * @description Run this method if/after slide-items are updated dynamically, to re-calculate state/dots etc.
	 */
	refreshSlider() {
		this.itemsPerPage = this.getItemsPerPage();
		this.setState();
		if (this.hasDots) {
			if (this.itemsPerPage === 1) {
				this.renderNavigationDots();
			}
			this.updateDots(this.state.page-1);
		}
		this.scrollToPage();
	}

	/**
	 * @function renderNavigationDots
	 * @description Creates navigation dots
	 */
	renderNavigationDots() {
		this.dots = [];
		this.elements.dots.innerHTML = '';
		for (let page = 1; page <= this.state.pages; page++) { 
			const dot = h('button', { class: this.settings.clsDot, type: 'button', 'aria-label': `${this.settings.lblGoToPage} ${page}`, 'data-page': page});
			dot.addEventListener('click', () => {
				this.state.page = parseInt(dot.dataset.page, 10);
				this.scrollToPage();
			})
			this.dots.push(dot);
			this.elements.dots.appendChild(dot);
		}
	}

	/**
	 * @function scrollToPage
	 * @description Scrolls to `this.state.page`
	 */
	scrollToPage() {
		let xPos;
		/* Scroll to center of page, calculate scroll using itemWidth */
		if (this.slider.dataset.preview === 'both') {
			if (this.itemsPerPage === 1) {
				xPos = (this.state.page - 1) * ((this.state.itemWidth - this.state.gap) * this.itemsPerPage);
			}
			else {
				xPos = (this.state.page - 1) * ((this.state.itemWidth - this.state.gap) * this.itemsPerPage);
			}
		}
		/* Scroll to page, use page-based widths */
		else {
			console.log(this.state.gap);
			xPos = (this.state.page - 1) * (this.itemsPerPage * (this.state.itemWidth + this.state.gap));
		}
		this.elements.inner.scrollTo({ left: xPos, behavior: this.settings.scrollBehavior });
	}

	/**
	 * @function setState
	 * @description Creates/updates a state-object
	 */
	setState() {
		this.state = {
			gap: this.getGap().match(/(\d+)/)[0] - 0,
			items: [...this.elements.inner.children],
			itemWidth: this.elements.inner.firstElementChild.offsetWidth,
			loop: this.slider.dataset?.loop === 'true',
			page: 1,
			pages: Math.ceil(this.elements.inner.childElementCount / this.itemsPerPage) || 1
		}
	}

	/**
	 * @function updateDots
	 * @description Set current dot
	 */
	updateDots(page) {
		if (this.dots?.length) {
			this.dots.forEach((dot, index) => {
				dot.classList.remove(this.settings.clsDotCur);
				if (index === page) {
					dot.classList.add(this.settings.clsDotCur);
				}
			});
		}
	}
}