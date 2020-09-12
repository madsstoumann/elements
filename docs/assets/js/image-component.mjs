/**
 * ImageComponent module.
 * @module /image-component.mjs
 * @version 0.0.4
 * @summary 07-09-2020
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
			lblPath: 'path',
			lblSize: 'size approx.',
			lblSizeUnit: 'unit',
			lblUploadImage: 'Upload or drag image/s',
			presetEntry: {
				alt: 'alt text',
				aspectHeight: 0,
				aspectWidth: 0,
				crossorigin: 'anonymous',
				decoding: 'async',
				images: [
					{
						breakpoint: 0,
						colorscheme: '',
						src: '[IMAGE-1].jpg'
					}
				],
				loading: 'lazy',
				media: [
					{
						breakpoint: 0,
						size: 100,
						unit: 'vw'
					}
				],
				path: '../assets/img/',
				scaler: [250, 450, 650, 850, 1050, 1250, 1450, 1650, 1850]
			},
			colorscheme: ['', 'dark', 'light'],
			crossorigin: ['anonymous', 'use-credentials'],
			decoding: ['auto', 'async', 'sync'],
			loading: ['auto', 'eager', 'lazy'],
			units: ['%', 'ch', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'q', 'rem', 'vw', 'vh', 'vmin', 'vmax']
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
		const len = this.preset.values[0].images.length;
		this.preset.values[0].images.push({ 
			breakpoint: 0,
			colorscheme: '',
			src: `[IMAGE-${len + 1}].jpg` 
		});
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

	renderImage(preset, standalone = false) {
		return `${standalone ? '' : '\t'}<img alt="${preset.alt}" src="${preset.path}${preset.images[0].src}"${preset.crossorigin ? ` crossorigin="${preset.crossorigin}"`: ''}${preset.decoding ? ` decoding="${preset.decoding}"`: ''}${preset.loading ? ` loading="${preset.loading}"`: ''}${standalone ? `\nsrcset="\n${this.renderScrSet(preset.images[0], preset)}"`:''}${standalone ? `\nsizes="${this.renderSizes(preset)}"`:''} />`;
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
		return `<picture${(preset.aspectHeight > 0) && (preset.aspectWidth > 0) ? ` style="--h:${preset.aspectHeight};--w:${preset.aspectWidth};"`: ''}>${this.renderSource(preset)}${this.renderImage(preset)}\n</picture>`;
	}

	renderSource(model) {
		const len = model.images.length;
		return `${model.images.map((image, index) => {
			const media = [];
			if (image.breakpoint > 0) {
				media.push(`(min-width: ${image.breakpoint}px)`);	
			}
			if (len > index + 1) { 
				const next = model.images[index + 1];
				if (next?.breakpoint > image?.breakpoint) {
					media.push(`(max-width: ${next.breakpoint - 1}px)`);	
				}
			}
			if (image.colorscheme) {
				media.push( `(prefers-color-scheme: ${image.colorscheme})`);	
			}
			return `\n\t<source${media.length > 0 ? `\n\t\tmedia="${media.join(' and ')}" `: ''} \n\t\tsrcset="\n${this.renderScrSet(image, model, 3)}" \n\t\tsizes="${this.renderSizes(model)}">\n`}).join('')
		}`
	}

	renderScrSet(image, model, indent = 1) {
		return model.scaler.map(width => { return `${'\t'.repeat(indent)}${model.path}${image.src}?w=${width} ${width}w`}).join(',\n');
	}

	renderSizes(model) {
		let fallback = '';
		const len = model.media.length;
		return `${model.media.map((entry, index) => {
			const media = [];
			if (entry.breakpoint > 0) {
				media.push(`(min-width: ${entry.breakpoint}px)`);
				if (len > index + 1) { 
					const next = model.media[index + 1];
					if (next?.breakpoint > entry?.breakpoint) {
						media.push(`(max-width: ${next.breakpoint - 1}px)`);	
					}
				}
			}
			else {
				fallback = entry.size + entry.unit;
			}
			return `${media.length > 0 ? `${media.join(' and ')} ${entry.size}${entry.unit},\n`: ''}`
		}).join('')}${fallback}`
	}

	/**
	* @function setCode
	* @description Updates CSS- and preset-code
	*/
	setCode() {
		const preset = this.preset.values[0];
		const useImgTag = preset.images.length === 1 && (preset.aspectHeight === 0 && preset.aspectWidth === 0);
		super.setCode();
		this.elements.htmlCode.innerText = useImgTag ? this.renderImage(preset, true) : this.renderPicture(preset);
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
					<strong class="app__subheader">Basic image info</strong>
					<p class="app__text">Fill out <code>alt</code>-text, and chose other default options. If a fixed aspect-ratio is needed, change the values from <code>0</code>.</p>
					<div data-elm="imageinfo"></div>
				</div>

				<div class="app__controls">
					<strong class="app__subheader">Image-list</strong>
					<p class="app__text">If you want to change to another image at a given breakpoint, add another image to the list. You can also switch to another image for a preferred <code>color-scheme</code>, or a combination. If aspect-ratios are <code>0</code> and this list only contains one image, the <code>img</code>-tag will be used., otherwise the <code>picture</code>-tag will be used</p>

					<div data-elm="imagelist"></div>
					<button type="button" class="app__button" data-elm="addImage">${this.settings.lblAddImage}</button>

					<strong class="app__subheader--mt">Image-Scaler</strong>
					<p class="app__text">A server-side scaler should be used. </p>

					<strong class="app__subheader--mt">Source and sizes</strong>
					<p class="app__text">For a given breakpoint, fill out the approx. size, the final image will have at that breakpoint. This will be common to all images in the list above.</p>

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
				<summary class="app__summary"><span>${this.settings.lblPresets}</span></summary>
				<div class="app__panel" data-elm="presets"></div>
			</details>
			<details class="app__details" open>
				<summary class="app__summary"><span>${this.settings.lblHTMLCode}</span></summary>
				<div class="app__code"><pre data-elm="htmlCode"></pre></div>
			</details>
			<details class="app__details">
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
				<label class="app__label"><input type="text" size="50" data-elm="path" value="${entry.path}" />${this.settings.lblPath}</label>
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