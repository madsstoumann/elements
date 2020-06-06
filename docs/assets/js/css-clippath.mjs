/**
 * ClipPath module.
 * @module /assets/js/clippath
 * @requires /assets/js/common
 * @version 0.2.2
 * @summary 06-06-2020
 * @description Edit clip-path: ellipse, polygon, url
 * @example
 * <div data-js="clippath">
 */

import { scrollPosition, uuid } from './common.mjs';
import { svgCreateWrapper, svgCreateClipPath } from './svg.mjs';
import CssApp from './css-app.mjs';
export default class ClipPath extends CssApp {
	constructor(element, settings) {
		super(element, Object.assign({
			appType: 'clip-path',
			lblAnimation: 'Animation preview',
			lblAnimationIntro: 'Hover to see animation between original state and current state.<br />Animation will only work if the number of points are the same.',
			lblAppHeader: 'CSS <code>clip-path</code> Editor',
			lblAppIntro: 'To add a point, select the point you want to insert a new point <em>after</em> and press <kbd>+</kbd><br />To delete the selected point, press <kbd>-</kbd> or <kbd>Delete</kbd><br />To <em>move</em> the selected point, use mouse, touch or <kbd>Arrow</kbd>-keys.<br />Hold down <kbd>shift</kbd> while selecting a preset to <em>only</em> update animation clip-path.',
			lblPath: 'url() raw data',
			pointSize: 40,
			previewImage: '../assets/img/clippath-demo.jpg'
		}, settings));
		this.init();
	}

	/**
	* @function init
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	async init() {
		let svgID = uuid();
		document.body.insertAdjacentHTML('beforeEnd', svgCreateWrapper(svgID));
		this.svgWrapper = document.getElementById(svgID);

		await super.init();

		this.elements.points.addEventListener('pointerdown', (event) => { this.pointDown(event); });
		this.elements.points.addEventListener('pointerup', () => { this.point.element = null; });
		this.elements.points.addEventListener('pointerleave', () => {
			this.point.element = null;
			if (window.getSelection) {window.getSelection().removeAllRanges();}
		 });
		this.elements.points.addEventListener('pointermove', (event) => { this.pointMove(event) });
		
		const resizeObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				this.pointInit();
				if (this.preset.values[0]?.type === 'polygon') {
					this.pointCreate();
				}
			}
		});
		resizeObserver.observe(this.elements.points);
	}

	/**
	* @function loadPreset
	* @paramn {Node} element
	* @description Loads preset / overwrites preset
	*/
	loadPreset(element, event) {
		if (event && event.shiftKey) {
			/* Update animation-preview only */
			const style = element?.firstChild.getAttribute('style').replace('clip-path:', '');
			this.elements.animation.style.setProperty('--clippath-ani', style);
			return false;
		}
		super.loadPreset(element);
		this.elements.animation.style.setProperty('--clippath-ani', this.preset.value);
		this.isPolygon = this.preset.values[0].type === 'polygon';
		this.setControls(true);
		if (this.preset.values[0].coords) {
			this.pointCreate();
		}
	}

	/**
	* @function pointAdd
	* @paramn {Number} index
	* @description Add a point to a polygon
	*/
	pointAdd(index) {
		if (!this.isPolygon) { return false; }
		const len = this.preset.values[0].coords.length;
		const position = index + 1 < len ? index + 1 : 0;
		let [x, y] = [...this.preset.values[0].coords[index]];
		let [X, Y] = [...this.preset.values[0].coords[position]];
		this.preset.values[0].coords.splice(position, 0, [(x + X) / 2, (y + Y) / 2]);
		this.pointCreate();
		this.pointRender();
	}

	/**
	* @function pointCreate
	* @description Creates points from polygon
	*/
	pointCreate() {
		this.elements.points.innerHTML = '';
		this.preset.values[0].coords.forEach((coord, index) => {
			const point = document.createElement('button');
			const [x, y] = [...coord];
			point.addEventListener('keydown', (event) => this.pointKeyMove(event));
			point.classList.add('app__point');
			point.dataset.index = index;
			point.innerText = index;
			point.style.left = `${(x * this.point.percent)}px`;
			point.style.top = `${(y * this.point.percent)}px`;
			point.type = 'button';
			this.elements.points.appendChild(point);
		})
	}

	/**
	* @function pointDelete
	* @paramn {Number} index
	* @description Deletes a point from a polygon
	*/
	pointDelete(index) {
		if (!this.isPolygon) { return false; }
		this.preset.values[0].coords.splice(index, 1);
		this.pointCreate();
		this.pointRender();
	}

	/**
	* @function pointDown
	* @paramn {Event} event
	* @description Init-code when a point is first selected
	*/
	pointDown(event) {
		const element = event.target;
		if (element?.dataset?.index) {
			const index = element.dataset.index - 0;
			let [x, y] = [...this.preset.values[0].coords[index]];

			this.point.element = element;
			this.point.rect = element.getBoundingClientRect();
			this.point.offsetX = event.clientX - this.point.rect.x;
			this.point.offsetY = event.clientY - this.point.rect.y;
			this.elements.coords.innerText = `point ${index} — x: ${x}, y: ${y}`;
		}
	}

	/**
	* @function pointInit
	* @description Inits the point-object, run on init and resize
	*/
	pointInit() {
		this.point = {
			element: null,
			offsetX: 0,
			offsetY: 0,
			parentRect: this.elements.points.getBoundingClientRect(),
			percent: this.elements.preview.getBoundingClientRect().width / 100,
			rect: null,
			width: this.settings.pointSize,
		}
	}

	/**
	* @function pointKeyMove
	* @paramn {Event} event
	* @description Keyhandler for polygon-editor
	*/
	pointKeyMove(event) {
		const element = event.target;
		const index = element.dataset.index - 0;
		let [x, y] = [...this.preset.values[0].coords[index]];

		switch(event.key) {
			case 'ArrowDown': event.preventDefault(); y++; break;
			case 'ArrowLeft': event.preventDefault(); x--; break;
			case 'ArrowRight': event.preventDefault(); x++; break;
			case 'ArrowUp': event.preventDefault(); y--; break;
			case 'Delete': case '-': this.pointDelete(index); return;
			case '+': this.pointAdd(index); return;
			default: break;
		}

		x = Math.min(Math.max(x, 0), 100);
		y = Math.min(Math.max(y, 0), 100);
		element.style.left = `${x * this.point.percent}px`;
		element.style.top = `${y * this.point.percent}px`;
		this.pointUpdate(index, x, y);
	}

	/**
	* @function pointMove
	* @paramn {Event} event
	* @description  Pointer-handler (touch, mouse) for polygon-editor
	*/
	pointMove(event) {
		if (this.point.element) {
			const index = this.point.element.dataset.index - 0;
			let x = event.clientX - this.point.offsetX - this.point.parentRect.left;
			let y = event.clientY + scrollPosition() - this.point.offsetY - this.point.parentRect.top;

			if (x < 0) x = 0;
			if (y < 0) y = 0;
			if ((x  + this.point.width) > this.point.parentRect.width) x = this.point.parentRect.width - this.point.width;
			if ((y + this.point.width) > this.point.parentRect.height) y = this.point.parentRect.height - this.point.width;

			this.point.element.style.left = `${x}px`;
			this.point.element.style.top = `${y}px`;
			this.pointUpdate(index, Math.ceil(x / this.point.percent), Math.ceil(y / this.point.percent));
		}
	}

	/**
	* @function pointRender
	* @description  Renders a polygon from coords, sets current preset
	*/
	pointRender() {
		if (this.isPolygon) {
			const polygon = this.preset.values[0].coords.map(entry => { return entry.map(i => `${i}%`).join(' ')}).join(',');
			this.preset.value = `polygon(${polygon})`;
		}
		else {
			const [position, y, x] = [...this.preset.values[0].coords];
			const radiusX = x[0] - 50;
			const radiusY = 50 - y[1];
			this.preset.value = `ellipse(${radiusX}% ${radiusY}% at ${position.join('% ')}%)`;
			
		}
		this.setControls();
	}

	/**
	* @function pointUpdate
	* @paramn {Number} index
	* @paramn {Number} x
	* @paramn {Number} y
	* @description Triggers whena single point updates
	*/
	pointUpdate(index, x, y) {
		this.preset.values[0].coords.splice(index, 1, [x, y]);
		this.elements.coords.innerText = `point ${index} — x: ${x}, y: ${y}`;
		this.pointRender();
	}

	/**
	* @function setControls
	* @param {Boolean} resetPoints
	* @description Updates code-blocks, sets CSS Custom Prop
	*/
	setControls(resetPoints = false) {
		if (resetPoints) {
			this.elements.coords.innerHTML = '';
			this.elements.points.innerHTML = '';
		}
		super.setCode();
		this.elements.app.style.setProperty('--clippath', this.preset.value);
	}

	/**
	* @function svgInsert
	* @param {Object} preset
	* @description Creates and inserts svg clipPath
	*/
	svgInsert(preset) {
		this.svgWrapper.insertAdjacentHTML('beforeEnd', svgCreateClipPath(preset.name, preset.values[0].data, preset.values[0].width, preset.values[0].height));
	}

	/**
	* @function template
	* @description Renders main template
	*/
	template() {
		return `
		<form class="app" data-elm="app">
			<strong class="app__header">${this.settings.lblAppHeader}</strong>
			<p class="app__text">${this.settings.lblAppIntro}</p>
			<div class="app__edit">
				<div class="app__preview">
					<figure class="app__img-wrapper" data-elm="containment">
						<img src="${this.settings.previewImage}" class="app__img" data-elm="preview" />
						<div data-elm="points"></div>
					</figure>
					<code data-elm="coords"></code>
				</div>

				<div class="app__controls">
					<div class="app__animation">
						<figure class="app__img-wrapper-animation">
							<img src="${this.settings.previewImage}" class="app__img-animation" data-elm="animation" />
						</figure>
						<header>
							<strong class="app__subheader">${this.settings.lblAnimation}</strong>
							<p class="app__text">${this.settings.lblAnimationIntro}</p>
						</header>
					</div>
					<div class="app__fieldset" hidden><!-- TODO -->
						<label class="app__label"><textarea data-elm="path" data-lpignore="true"></textarea>${this.settings.lblPath}</label>
					</div>
					<div class="app__fieldset">
						<label class="app__label"><input type="text" data-elm="presetName" data-lpignore="true" size="15">${this.settings.lblPresetName}</label>
					</div>
					<div class="app__fieldset">
						<label class="app__label"><textarea data-elm="presetDesc" data-lpignore="true"></textarea>${this.settings.lblPresetDesc}</label>
					</div>
					<div class="app__fieldset">
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

	/**
	* @function templatePresetEntry
	* @param {Object} preset
	* @param {Number} index
	* @description Renders a single preset
	*/	
	templatePresetEntry(preset, index = 0) {
		if (preset.values[0].type === 'url') { this.svgInsert(preset); }
		return `<button type="button" class="app__preset--clip" data-index="${index}"><div style="clip-path:${preset.value}"></div>${preset.name}</button>`
	}
}