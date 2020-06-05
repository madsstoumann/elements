/**
 * ImageComponent module.
 * @module /image-component.mjs
 * @version 0.0.3
 * @summary 04-06-2020
 * @description Generate code for responsive <picture>
 * @example
 * <div data-js="image-component">
 */
import CssApp from './css-app.mjs';
export default class ImageComponent extends CssApp {
	constructor(element, settings) {
		super(element, Object.assign({
			clsDrag: 'app__img--drag',
			lblAddBreakpoint: 'Add breakpoint',
			lblAddImage: 'Add image',
			lblAltText: 'alt text',
			lblAndOr: 'and / or',
			lblAppHeader: 'CSS Transform Editor',
			lblAspectHeight: 'aspect-ratio height',
			lblAspectWidth: 'aspect-ratio width',
			lblBreakpoint: 'breakpoint (px)',
			lblColorScheme: 'color-scheme',
			lblCrossorigin: 'crossorigin',
			lblDecoding: 'decoding',
			lblDelete: '✕',
			lblJSONCode: 'JSON',
			lblHTMLCode: 'HTML',
			lblLoading: 'loading',
			lblMinWidth: 'min-width (px)',
			lblSize: 'size approx.',
			lblSizeUnit: 'unit',
			lblUploadImage: 'Upload or drag image/s',
			presetEntry: {
				alt: 'alt text',
				aspectHeight: 9,
				aspectWidth: 16,
				crossorigin: 'anonymous',
				decoding: 'async',
				images: [
					{
						breakpoint: 320,
						colorscheme: '',
						src: 'small.jpg'
					},
					{
						breakpoint: 768,
						colorscheme: 'dark',
						src: 'big.jpg'
					}
				],
				loading: 'lazy',
				media: [
					{
						breakpoint: 320,
						size: 100,
						unit: 'vw'
					},
					{
						breakpoint: 768,
						size: 100,
						unit: 'vw'
					}
				]
			},
			colorscheme: ['', 'dark', 'light'],
			crossorigin: ['anonymous', 'use-credentials'],
			decoding: ['auto', 'async', 'sync'],
			loading: ['auto', 'eager', 'lazy'],
			units: ['ch', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'q', 'rem', 'vw', 'vh', 'vmin', 'vmax']
		}, settings));

		this.init();
	}

	/**
	* @function addBreakpoint
	* @description Adds a new entry to the default preset
	*/
	addBreakpoint() {
		this.preset.values[0].media.push({ breakpoint: 0, size: 100, unit: 'vw' });
		this.renderBreakpoints();
		this.setCode();
	}

	/**
	* @function addImage
	* @description Adds a new entry to the default preset
	*/
	addImage() {
		this.preset.values[0].images.push({ src: 'image.jpg' });
		this.renderImageList();
		this.setCode();
	}

	/**
	* @function delBreakpoint
	* @param {Node} element
	* @description Delete an entry from the default preset
	*/
	delBreakpoint(element) {
		if (this.preset.values[0].media.length === 1) { return false; }
		const index = parseInt(element.dataset.index, 10);
		this.preset.values[0].media.splice(index, 1);
		this.renderBreakpoints();
		this.setCode();
	}

	/**
	* @function delBreakpoint
	* @param {Node} element
	* @description Delete an entry from the default preset
	*/
	delImage(element) {
		if (this.preset.values[0].images.length === 1) { return false; }
		const index = parseInt(element.dataset.index, 10);
		this.preset.values[0].images.splice(index, 1);
		this.renderImageList();
		this.setCode();
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
					super.addPreset();
					break;
				case 'addBreakpoint':
					this.addBreakpoint();
					break;
				case 'addImage':
					this.addImage();
					break;
				case 'delBreakpoint':
					this.delBreakpoint(element);
					break;
				case 'delImage':
					this.delImage(element);
					break;
				case 'resetPreset':
					// super.resetPreset();
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
		const element = event.target;
		const index = element.dataset.index - 0 || 0;
		const key = element.dataset.elm;
		const obj = element.dataset.obj;
		let value = element.value;

		if (key === 'presetDesc' || key === 'presetName') { return; }

		if (element.type === 'number') {
			value = value - 0;
		}
		if (obj) {
			this.preset.values[0][obj][index][key] = value;
		}
		else {
			this.preset.values[0][key] = value;
		}
		this.setCode();
	}

	/**
	* @function init
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	async init() {
		await super.init();
		this.loadPreset();
	}

		/**
	* @function loadPreset
	* @paramn {Node} element
	* @description Loads preset / overwrites preset
	*/
	loadPreset(element) {
		/* If element exists, load preset - otherwise `reset` to default values */
		if (element) {
			super.loadPreset(element);
		}
		else {
			this.preset.values[0] = {...this.settings.presetEntry};
		}
		this.renderImageInfo();
		this.renderImageList();	
		this.renderBreakpoints();
		this.setCode();
	}

	renderBreakpoints() {
		this.elements.breakpoints.innerHTML = this.preset.values[0].media.map((breakpoint, index) => {
			return this.templateBreakPoints(breakpoint, index)
		}).join('');
	}

	renderImage(preset) {
		return `\n\t<img alt="${preset.alt}" src="${preset.images[0].src}"${preset.crossorigin ? ` crossorigin="${preset.crossorigin}"`: ''}${preset.decoding ? ` decoding="${preset.decoding}"`: ''}${preset.loading ? ` loading="${preset.loading}"`: ''} />`;
	}

	renderImageInfo() {
		this.elements.imageinfo.innerHTML = this.templateImageInfo(this.preset.values[0]);
	}

	renderImageList() {
		this.elements.imagelist.innerHTML = this.preset.values[0].images.map((image, index) => {
			return this.templateImageList(image, index);
		}).join('');
	}

	renderPicture(preset) {
		return `<picture style="--h:${preset.aspectHeight};--w:${preset.aspectWidth};">${this.renderPictureSource(preset)}${this.renderImage(preset)}\n</picture>`;
	}

	renderPictureSource(preset) {
		/* TODO: if breakpoint exists, split ImageSizes, color-scheme etc. */
		return `${preset.images.map(image => { return `\n\t<source media="${image.breakpoint > 0 ? ` (min-width: ${image.breakpoint}px)` : ''}${(image.breakpoint > 0) && image.colorscheme ? ` and ` : ''}${image.colorscheme ? `(prefers-color-scheme: ${image.colorscheme})`: ''}" srcset="\n${preset.media.map(entry => { return `\t\t${image.src}?w=${entry.breakpoint} ${entry.breakpoint}w` }).join(',\n')}" \n\t\tsizes="100vw">\n`}).join('')}`
	}

	/**
	* @function setCode
	* @description Updates CSS- and preset-code
	*/
	setCode() {
		super.setCode();
		this.elements.htmlCode.innerText = this.renderPicture(this.preset.values[0]);
	}

	/**
	* @function template
	* @description Renders main template for ColorPicker
	*/
	template() {
		return `
		<form class="app" data-elm="app">
			<strong class="app__header">${this.settings.lblAppHeader}</strong>
			<div class="app__edit">
				<div class="app__preview">
					<strong class="app__subheader">Basic <code>img</code> info</strong>
					<p class="app__text">Fill out <code>alt</code>-text, if a fixed aspect-ratio is needed, change the values from <code>0</code></p>
					<div data-elm="imageinfo"></div>
				</div>

				<div class="app__controls">
					<strong class="app__subheader">Image-list</strong>
					<p class="app__text">If you have more than one image, chose which breakpoint to use, or if that image should be shown for a preferred <code>color-scheme</code>, or a combination.</p>

					<div data-elm="imagelist"></div>
					<button type="button" class="app__button" data-elm="addImage">${this.settings.lblAddImage}</button>

					<strong class="app__subheader--mt"><code>srcset</code> and <code>sizes</code></strong>
					<p class="app__text">For a given breakpoint, fill out the approx. size, the final image will have at that breakpoint.</p>

					<div data-elm="breakpoints"></div>
					<button type="button" class="app__button" data-elm="addBreakpoint">${this.settings.lblAddBreakpoint}</button>

					<div class="app__fieldset app__fieldset--topspace">
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
				<summary class="app__summary"><span>${this.settings.lblHTMLCode}</span></summary>
				<div class="app__code"><pre data-elm="htmlCode"></pre></div>
			</details>
			<details class="app__details" open>
				<summary class="app__summary"><span>${this.settings.lblJSONCode}</span></summary>
				<div class="app__code"><pre data-elm="presetCode"></pre></div>
			</details>
		</form>`
	}

	/**
	* @function templateBreakPoints
	* @description Renders a breakpoint
	*/
	templateBreakPoints(entry, index = 0) {
		return `
			<div class="app__fieldset">
				<label class="app__label"><input type="number" min="0" size="3" value="${entry.breakpoint}" data-elm="breakpoint" data-index="${index}" data-obj="media" />${this.settings.lblBreakpoint}</label>
				<label class="app__label"><input type="number" min="0" size="3" value="${entry.size}" data-elm="size" data-index="${index}" data-obj="media" />${this.settings.lblSize}</label>
				<label class="app__label">	
					<select data-elm="unit" data-index="${index}" data-obj="media">${this.settings.units.map(unit => { return `<option value="${unit}"${entry.unit === unit ? ' selected': ''}>${unit}</option>`}).join('')}</select>
					${this.settings.lblSizeUnit}
				</label>
			<label class="app__label app__label--del"><button type="button" data-elm="delBreakpoint" data-index="${index}" aria-label="">${this.settings.lblDelete}</button>del</label>
		</div>`
	}

	/**
	* @function templateImageInfo
	* @description Renders basic image-info
	*/
	templateImageInfo(entry) {
		return `
			<div class="app__fieldset">
				<label class="app__label"><input type="text" size="50" data-elm="alt" value="${entry.alt}" />${this.settings.lblAltText}</label>
			</div>
			<div class="app__fieldset">
				<label class="app__label"><input type="number" min="0" size="3" data-elm="aspectWidth" value="${entry.aspectWidth}" />${this.settings.lblAspectWidth}</label>
				<label class="app__label"><input type="number" min="0" size="3" data-elm="aspectHeight" value="${entry.aspectHeight}" />${this.settings.lblAspectHeight}</label>
			</div>
			<div class="app__fieldset">
				<label class="app__label">	
					<select data-elm="crossorigin">
						${this.settings.crossorigin.map(value => { return `<option value="${value}"${entry.crossorigin === value ? ' selected': ''}>${value}</option>`}).join('')}
					</select>
					${this.settings.lblCrossorigin}
				</label>
				<label class="app__label">	
					<select data-elm="decoding">
						${this.settings.decoding.map(value => { return `<option value="${value}"${entry.decoding === value ? ' selected': ''}>${value}</option>`}).join('')}
					</select>
					${this.settings.lblDecoding}
				</label>
				<label class="app__label">	
					<select data-elm="loading">
						${this.settings.loading.map(value => { return `<option value="${value}"${entry.loading === value ? ' selected': ''}>${value}</option>`}).join('')}
					</select>
					${this.settings.lblLoading}
				</label>
			</div>`
	}

	/**
	* @function templateImageList
	* @description Renders a breakpoint
	*/
	templateImageList(entry, index = 0) {
		return `
			<div class="app__fieldset">
				<label class="app__label app__label--auto"><input type="text" data-elm="src" data-index="${index}" data-obj="images" value="${entry.src}" />src</label>
				<label class="app__label">	
					<select data-elm="colorscheme" data-index="${index}" data-obj="images">
						${this.settings.colorscheme.map(value => { return `<option value="${value}"${entry.colorscheme === value ? ' selected': ''}>${value}</option>`}).join('')}
					</select>
					${this.settings.lblColorScheme}
				</label>
				<label class="app__label"><input type="number" min="0" size="3" value="${entry.breakpoint}" data-elm="breakpoint" data-index="${index}" data-obj="images" />${this.settings.lblMinWidth}</label>
				<label class="app__label app__label--del"><button type="button" data-elm="delImage" data-index="${index}" aria-label="">${this.settings.lblDelete}</button>del</label>
		</div>`
	}
}