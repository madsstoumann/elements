/**
 * ImageComponent module.
 * @module /image-component.mjs
 * @version 0.0.1
 * @summary 21-05-2020
 * @description Generate code for responsive <picture>
 * @example
 * <div data-js="image-component">
 */

import CssApp from './css-app.mjs';

export default class ImageComponent extends CssApp {
	constructor(element, settings) {
		super(element, Object.assign({
			clsDrag: 'app__img--drag',
			lblAppHeader: 'CSS Transform Editor',
			lblAspectHeight: 'aspect-ratio height',
			lblAspectWidth: 'aspect-ratio width',
			lblBreakpoint: 'breakpoint (px)',
			lblCrossorigin: 'crossorigin',
			lblDecoding: 'decoding',
			lblDelete: '✕',
			lblJSONCode: 'JSON',
			lblHTMLCode: 'HTML',
			lblLoading: 'loading',
			lblSize: 'size approx.',
			lblSizeUnit: 'unit',
			lblUploadImage: 'Upload or drag image/s',
			sizes: ['em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'cm', 'mm', 'q', 'in', 'pc', 'pt', 'px']
		}, settings));

		this.init();
	}

		/**
	* @function handleInput
	* @param {Event} event
	* @description Handle main form input.
	*/
	handleInput(event) {
		const element = event.target;
		const key = element.dataset.elm;
		// this.elements.app.style.setProperty(`--${key}`,`${element.value}${element.dataset.suffix || ''}`);
		// this.preset.values[0][key] = key === 'url' ? element.value : element.value - 0;
		// this.setValue();
	}

	/**
	* @function init
	* @description Initialize: Create elements, add eventListeners etc.
	*/
	async init() {
		this.breakpoints = [320, 768, 1024, 1200, 1800];
		await super.init();
		/* Add drag/drop functionality to preview-image-area */
		this.elements.filedrop.addEventListener("change", this.setImage.bind(this));
		this.elements.preview.addEventListener("dragover", (event) => { event.preventDefault(); return false; });
		this.elements.preview.addEventListener("dragenter", () => { this.elements.preview.classList.add(this.settings.clsDrag); });
		document.addEventListener("drop", () => { this.elements.preview.classList.remove(this.settings.clsDrag) ;});

		
		const ImageSizes = [600, 900, 1200, 1400];
		const Model = {
			alt: 'This is the alt text',
			aspectHeight: 1,
			aspectWidth: 1,
			media: [
				{
					breakpoint: 320,
					size: 100,
					unit: 'vw'
				}
			],
			crossorigin: 'anonymous',
			decoding: 'async',
			loading: 'lazy',
			images: [
				{
					src: 'fallback.jpg'
				},
				{
					src: 'big.jpg',
					minWidth: 900
				}
			]
		}
	
	
	
		console.log(this.renderPicture(Model, ImageSizes));
	}

	/**
	* @function objFilter
	* @param {Object} obj1
	* @param {Object} obj2
	* @description Compare 2 simple objects, return object with differences
	*/
	objFilter(obj1, obj2) {
		const obj = {};
		Object.keys(obj1).forEach(key => { if(obj1[key] !== obj2[key]) { obj[key] = obj1[key] }});
		return obj;
	}

  renderImage(Model) {
    return `<img alt="${Model.alt}" src="${Model.images[0].src}"
      ${Model.crossorigin ? ` crossorigin="${Model.crossorigin}"`: ''}
      ${Model.decoding ? ` decoding="${Model.decoding}"`: ''}
      ${Model.loading ? ` loading="${Model.loading}"`: ''}/>`;
  }

  renderPicture(Model, ImageSizes) {
    return `
      <picture style="--h:${Model.aspectHeight};--w:${Model.aspectWidth};">
        ${this.renderPictureSource(Model, ImageSizes)}
        ${this.renderImage(Model)}
      </picture>`;
  }

  renderPictureSource(Model, ImageSizes) {
    return `
      ${Model.images.map(image => {
        /* TODO: if minWidth, split ImageSizes */
        return `<source
        ${image.minWidth ? `media="(min-width: ${image.minWidth}px)"` : ''}
        srcset="${ImageSizes.map(size => { return `${image.src}?w=${size} ${size}w` }).join(', ')}"
        sizes="100vw">  
    `}).join('')}`
  }

	/**
	* @function setImage
	* @description Sets preview-image to dragged (or file-upload) image-src.
	*/
	setImage(event) {
		console.log(this.elements.filedrop.files)
		const reader = new FileReader();
		reader.onload = (e) => {
			// this.elements.preview.setAttribute("src", e.target.result);
			// console.log(e.target.result);
		};
		// reader.readAsDataURL(event.target.files[0]);
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
					<div  data-elm="preview">
						<input type="file" id="${this.uuid}file" class="app__file-drop" data-elm="filedrop" multiple />
					</div>
					<ul data-elm="filelist"></ul>
					<label for="${this.uuid}file" class="app__label">${this.settings.lblUploadImage}</label>
				</div>

				<div class="app__controls">

					<div class="app__fieldset">
						<label class="app__label"><input type="number" size="3" value="0" data-elm="w" />${this.settings.lblAspectWidth}</label>
						<label class="app__label"><input type="number" size="3" value="0" data-elm="h" />${this.settings.lblAspectHeight}</label>
					</div>

				<label class="app__label">	
					<select data-elm="crossorigin">
						<option value="">none</option>
						<option value="anonymous">anonymous</option>
						<option value="use-credentials">use-credentials</option>
					</select>
					${this.settings.lblCrossorigin}
				</label>
				<label class="app__label">	
					<select data-elm="decoding">
						<option value="">auto</option>
						<option value="async">async</option>
						<option value="sync">sync</option>
					</select>
					${this.settings.lblDecoding}
				</label>
				<label class="app__label">	
					<select data-elm="loading">
						<option value="">auto</option>
						<option value="eager">eager</option>
						<option value="lazy">lazy</option>
					</select>
					${this.settings.lblLoading}
				</label>

				<code>media min-width</code> and <code>sizes</code>
				<div data-elm="breakpoints">
					${this.breakpoints.map((breakpoint, index) => { return this.templateBreakPoints(breakpoint, index) }).join('')}
				</div>
				
				</div>
			</div>

			<details class="app__details" open>
				<summary class="app__summary"><span>${this.settings.lblHTMLCode}</span></summary>
				<div class="app__code" data-elm="htmlCode"></div>
			</details>
			<details class="app__details">
				<summary class="app__summary"><span>${this.settings.lblJSONCode}</span></summary>
				<div class="app__code"><pre data-elm="jsonCode"></pre></div>
			</details>
		</form>`
	}
	/**
	* @function templateBreakPoints
	* @description Renders a breakpoint
	*/
	templateBreakPoints(breakpoint, index = 0) {
		return `
			<div class="app__fieldset">
				<label class="app__label"><input type="number" size="3" value="${breakpoint}" data-elm="x" data-index="${index}" />${this.settings.lblBreakpoint}</label>
				<label class="app__label"><input type="number" size="3" value="30" data-elm="y" data-index="0" />${this.settings.lblSize}</label>
				<label class="app__label">	
					<select>${this.settings.sizes.map(unit => { return `<option value="${unit}">${unit}</option>`}).join('')}</select>
					${this.settings.lblSizeUnit}
				</label>
			<label class="app__label app__label--del"><button type="button" data-elm="delEntry" data-index="${index}" aria-label="">${this.settings.lblDelete}</button>del</label>
		</div>`
	}
}