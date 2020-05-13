/**
 * ClipPath module.
 * @module /assets/js/clippath
 * @requires /assets/js/common
 * @version 0.1.9
 * @summary 04-05-2020
 * @description Edit clip-path data, polygon
 * @example
 * <div data-js="clippath">
 */

import { scrollPosition, stringToType, uuid } from './common.mjs';

export default class ClipPath {
	constructor(element, settings) {
		this.settings = Object.assign({
			appType: 'icon',
			clsDrag: 'app__img--drag',
			eventAddPreset: 'eventAddPreset',
			eventDelPreset: 'eventDelPreset',
			iconColor: 'rgba(96, 96, 96, 1)',
			iconColorHover: 'rgba(20, 40, 80, 1)',
			lblAddPreset: 'Add or overwrite preset',
			lbladdEntry: 'Add shadow',
			lblAppHeader: 'CSS <code>clip-path</code> Editor',
			lblCode: 'Generated code',
			lblColor: 'Icon color',
			lblColorHover: 'Icon color :hover',
			lblCSSCode: 'CSS code',
			lblFullCode: 'Original code',
			lblOverwrite: 'Overwrite existing preset?',
			lblPresetCode: 'Preset code',
			lblPresetName: 'Preset name',
			lblPresetDesc: 'Preset description',
			lblPresets: 'Presets',
			lblReset: '↺ Reset',
			lblSVGCode: 'SVG code',
			lblSVGImportType: 'SVG import profile',
			lblUploadImage: 'Upload or drag SVG with path or polygon',
			pointSize: 40,
			presetEntry: {},
			txtEmptyPreset: 'icon-preset',
			txtNoCode: 'No code rendered',
			urlPresets: '',
			useLocalStorage: true
		}, stringToType(settings));

		this.app = element;
		this.init();
	}

	/**
	* @function addPreset
	* @description Adds a new  preset
	*/
	addPreset() {
		/* TODO */
		if (this.elements.presetName.value) {
			const key = this.elements.presetName.value.replace(' ', "-").toLowerCase();
			const presetIndex = this.findPreset(key);
			this.elements.presetName.value = key;
			this.preset.name = key;
			if (presetIndex > -1) {
				// eslint-disable-next-line no-alert
				if (!window.confirm(this.settings.lblOverwrite)) {
					return;
				}
				this.presets.splice(presetIndex, 1, this.preset);
			}
			else {
				this.presets.push(this.preset);
			}
			this.app.dispatchEvent(new CustomEvent(this.settings.eventAddPreset, { detail: JSON.stringify(this.preset) }));
			this.renderPresets();

			if (this.settings.useLocalStorage) {
				window.localStorage.setItem(this.settings.appType, JSON.stringify(this.presets));
			}
		}
	}

	/**
	* @function delPreset
	* @param {Node} element
	* @description Delete a preset
	*/
	delPreset(element) {
		/* TODO */
		const presetIndex = parseInt(element.dataset.index, 10);
		if (presetIndex > -1) {
			const preset = this.presets[presetIndex];
			this.presets.splice(presetIndex, 1);
			this.app.dispatchEvent(new CustomEvent(this.settings.eventDelPreset, { detail: JSON.stringify(preset) }));
			this.renderPresets();

			if (this.settings.useLocalStorage) {
				window.localStorage.setItem(this.settings.appType, JSON.stringify(this.presets));
			}
		}
	}

	/**
	* @function dropFile
	* @description Handles dropFile, cleans file, sets preview
	*/
	dropFile(event) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const xml = e.target.result;
			console.log(xml)
			// const svg = this.svgClean(xml);
			// this.preset.value = `url('data:image/svg+xml,${svg}');`
			// this.setPreset(true, xml, svg);
		};
		reader.readAsText(event.target.files[0]);
	}

	/**
	* @function findKey
	* @param {String} key
	* @description Look up a preset in the presets-collection, return index in array
	*/
	findPreset(key) {
		return this.presets.findIndex(obj => { return obj.name === key });
	}

	/**
	* @function handleClick
	* @param {Event} event
	* @description Handle main form clicks.
	*/
	handleClick(event) {
		const element = event.target;
		if (element.tagName === 'BUTTON' && element.dataset.elm) {
			switch(element.dataset.elm) {
				case 'addPreset':
					this.addPreset();
					break;
				case 'resetPreset':
					this.resetPreset();
					break;
				default: break;
			}
		}
	}

	/**
	* @function handleInput
	* @param {Event} event
	* @description Handle main form input.
	*/
	handleInput(event) {
		/* TODO */
		const element = event.target;
		const index = element.dataset.index - 0 || 0;
		const key = element.dataset.elm;
		let value = element.value;

		// if (element.type === 'checkbox') {
		// 	value = element.checked ? true : false;
		// }
		// else if (element.type === 'number') {
		// 	value = value - 0;
		// }
		// else if (element.type === 'radio') {
		// 	return;
		// }
	}

	/**
	* @function init
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	async init() {
		this.uuid = uuid();
		this.app.innerHTML = this.template();
		this.elements = {};
		this.app.querySelectorAll(`[data-elm]`).forEach(element => {
			this.elements[element.dataset.elm] = element;
		});

		this.presets = [];
		const presets = await (await fetch(this.settings.urlPresets)).json();
		if (presets) {
			this.presets = presets.values;
			this.elements.presets.addEventListener('keydown', this.keyDown.bind(this));
			this.elements.presets.addEventListener('pointerdown', this.pointerDown.bind(this));
			this.renderPresets();

			/* TODO: load localStorage */
		}

		this.elements.app.addEventListener('click', this.handleClick.bind(this));
		this.elements.app.addEventListener('input', this.handleInput.bind(this));

		this.elements.filedrop.addEventListener("change", this.dropFile.bind(this));
		this.elements.points.addEventListener("dragover", (event) => { event.preventDefault(); return false; });
		this.elements.points.addEventListener("dragenter", () => { this.elements.points.classList.add(this.settings.clsDrag); });
		document.addEventListener("drop", () => { this.elements.points.classList.remove(this.settings.clsDrag) ;});

		this.resetPreset();

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
				if (this.preset.values.type === 'polygon') {
					this.pointCreate();
				}
			}
		});
		resizeObserver.observe(this.elements.points);
	}

	/**
	* @function keyDown
	* @paramn {Event} event
	* @description Copies the color of the curent swatch, when user press "Spacebar"
	*/
	keyDown(event) {
		const element = event.target;
		if (element.tagName === 'BUTTON') {
			switch (event.key) {
				case ' ': this.loadPreset(element); break;
				case 'Delete': this.delPreset(element); break;
				default: break;
			}
		}
	}

	/**
	* @function loadPreset
	* @paramn {Node} element
	* @description Loads preset / overwrites preset
	*/
	loadPreset(element) {
		const index = parseInt(element.dataset.index, 10);
		const preset = this.presets[index];
		if (preset) {
			this.preset = JSON.parse(JSON.stringify(preset));
			this.setPreset();
		}
	}

	/**
	* @function pointAdd
	* @paramn {Number} index
	* @description Add a point to a polygon
	*/
	pointAdd(index) {
		const len = this.preset.values.coords.length;
		const position = index + 1 < len ? index + 1 : 0;
		let [x, y] = [...this.preset.values.coords[index]];
		let [X, Y] = [...this.preset.values.coords[position]];
		this.preset.values.coords.splice(position, 0, [(x + X) / 2, (y + Y) / 2]);
		this.pointCreate();
		this.pointRender();
	}

	/**
	* @function pointCreate
	* @description Creates points from polygon
	*/
	pointCreate() {
		this.elements.points.innerHTML = '';
		this.preset.values.coords.forEach((coord, index) => {
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
		this.preset.values.coords.splice(index, 1);
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
			let [x, y] = [...this.preset.values.coords[index]];

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
		let [x, y] = [...this.preset.values.coords[index]];

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
		/* TODO: Handle `circle` and `ellipsis` */
		const polygon = this.preset.values.coords.map(entry => { return entry.map(i => `${i}%`).join(' ')}).join(',');
		this.preset.value = `polygon(${polygon})`;
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
		/* TODO: Handle `circle` and `ellipsis` */
		this.preset.values.coords.splice(index, 1, [x, y]);
		this.elements.coords.innerText = `point ${index} — x: ${x}, y: ${y}`;
		this.pointRender();
	}

	/**
	* @function pointerDown
	* @paramn {Event} event
	* @description Copies the color of the curent swatch, starts a clickTimer-callback for "long-click"
	*/
	pointerDown(event) {
		const element = event.target;
		if (element.tagName === 'BUTTON') {
			this.loadPreset(element);
		}
	}

	/**
	* @function renderPresets
	* @description Renders list of presets
	*/
	renderPresets() {
		this.elements.presets.innerHTML = this.presets.map((preset, index) => {
			return this.templatePresetEntry(preset, index)
		}).join('');
	}

	/**
	* @function resetPreset
	* @description Resets current preset
	*/
	resetPreset() {
		this.elements.points.innerHTML = '';
		this.preset = { value: '', values: {} };
		this.setPreset(true);
	}

	/**
	* @function setControls
	* @param {Boolean} resetPoints
	* @description Updates code-blocks, sets CSS Custom Prop
	*/
	setControls(resetPoints = false) {
		if (resetPoints) {
			this.elements.points.innerHTML = '';
		}
		this.elements.presetName.value = this.preset.name;
		this.elements.cssCode.innerText = this.preset.value;
		this.elements.presetCode.innerText = JSON.stringify(this.preset);
		this.elements.app.style.setProperty('--clippath', this.preset.value);
	}

	/**
	* @function setPreset
	* @param {Boolean} init
	* @param {String} xml
	* @param {String} svg
	* @description Sets active preset, optional initialize
	*/
	setPreset(init = false) {
		if (init) {
			this.preset.name = this.settings.txtEmptyPreset;
			this.preset.deletable = true;
			this.preset.readonly = false;
		}
		this.setControls(true);
		if (this.preset.values?.coords) {
			this.pointCreate();
		}
	}

	/**
	* @function svgClean
	* @param {String} xml
	* @param {Object} settings 
	* @description Removes unnecessary attributes and tags from an SVG
	*/
	svgClean(xml, settings) {
		const options = {...{
			removeAttr: ['enable-background', 'height', 'id', 'style', 'version', 'width', 'x', 'xml:space', 'xmlns:xlink', 'y'],
			removeAttrInTags: ['class', 'fill', 'id', 'style'],
			removeTags: ['defs', 'desc', 'discard', 'metadata', 'script', 'style', 'title'],
			tags: 'circle, g, line, path, pattern, polygon, polyline, rect, text, tspan',
			useViewBox: true
		},...settings};

		const parser = new DOMParser;
		const doc = parser.parseFromString(xml, 'text/xml');
		let svg = doc.querySelector('svg');

		if (!svg.hasAttribute('viewBox') && options.useViewBox) {
			svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('width')||100} ${svg.getAttribute('height')||100}`)
		}

		options.removeAttr.forEach(attr => {
			if (svg.hasAttribute(attr)) {
				svg.removeAttribute(attr);
			}
		});

		options.removeTags.forEach(tag => {
			const tags = svg.getElementsByTagName(tag);
			if (tags) {
				[...tags].forEach(elm => { elm.parentNode.removeChild(elm)})
			}
		});

		const children = svg.querySelectorAll(options.tags);
		children.forEach(child => {
			options.removeAttrInTags.forEach(attr => {
				if (child.hasAttribute(attr)) {
					child.removeAttribute(attr);
				}
			})
		});

		svg = svg.outerHTML.toString().trim()
			.replace(/(\r\n|\n|\r|\t)/gm,'')
			.replace(/\s\s+/g, ' ')
			.replace(/%/g,'%25')
			.replace(/#/g,'%23');

		return svg;
	}

	/**
	* @function template
	* @description Renders main template
	*/
	template() {
		return `
		<form class="app" data-elm="app">
			<strong class="app__header">${this.settings.lblAppHeader}</strong>
			<p>To add a point, select the point you want to insert a new point <em>after</em> and press <kbd>+</kbd><br />
			To delete the selected point, press <kbd>-</kbd> or <kbd>Delete</kbd><br />
			To <em>move</em> the selected point, use mouse, touch or <kbd>Arrow</kbd>-keys.</p>
			<div class="app__edit">
				<div class="app__preview">
					<figure class="app__img-wrapper" data-elm="containment">
						<img src="../assets/img/clippath-demo.jpg" class="app__img" data-elm="preview" />
						<div data-elm="points"></div>
						<input type="file" id="${this.uuid}file" class="app__file-drop" data-elm="filedrop" />
					</figure>
					<code data-elm="coords"></code>
					<label for="${this.uuid}file" class="app__label">${this.settings.lblUploadImage}</label>

				</div>

				<div class="app__controls">


					<div class="app__fieldset">
						<label class="app__label"><input type="text" data-elm="presetName" data-lpignore="true" size="15">${this.settings.lblPresetName}</label>
						<label class="app__label">	
							<select data-elm="importType">
								<option value="deep">deep: remove as much</option>
								<option value="lite">lite: keep fill, class, style</option>
								<option value="keep">keep: import as is</option>
							</select>
							${this.settings.lblSVGImportType}
						</label>
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
				<div class="app__code" data-elm="presetCode"></div>
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
		return `<button type="button" class="app__preset--clip" data-index="${index}"><div style="clip-path:${preset.value}"></div>${preset.name}</button>`
	}
}