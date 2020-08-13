/**
 * Layout module.
 * @module /assets/js/controlPanel
 * @requires /assets/js/common
 * @version 1.0.7
 * @summary 13-08-2020
 * @description Control Panel
 * @example
 * <div data-control-panel="alignment audio background brightness colormode contrast fontsize spacing tabstops typography width">
 */
import { h, stringToType, uuid } from './common.mjs';
export default class ControlPanel {
	constructor(element, settings, callback) {
		this.settings = Object.assign({
			clsForm: 'c-cpl',
			clsOuter: 'c-clp__outer',
			clsTrigger: 'c-cpl__trigger',
			clsTriggerLabel: 'c-cpl__summary',
			controlPanelId: '',
			lblAudio: 'Audio',
			lblTrigger: 'Settings',
			lblExpanded: 'Close Settings',
			lblPitch: 'Pitch',
			lblPause: 'Pause audio',
			lblPlay: 'Read article',
			lblRate: 'Rate',
			lblReset: 'Reset',
			lblVoices: 'Voices',
			urlData: '../assets/data/control-panel.json'
		}, stringToType(settings));
		if (callback && (typeof callback === 'function')) {
			this.fnCallback = callback;
		}
		this.wrapper = element;
		this.init();
	}

	/**
	 * @function getVoices
	 * @description Returns speechSynthesis-voices on local system
	 */
	async getVoices() {
		return new Promise(resolve => {
			let voices = window.speechSynthesis.getVoices()
			if (voices.length) {
				resolve(voices);
				return
			}
			window.speechSynthesis.onvoiceschanged = () => {
				voices = window.speechSynthesis.getVoices();
				resolve(voices);
			}
		})
	}

	/**
	 * @function init
	 * @description Creates a new ControlPanel, creates controls/events
	 */
	async init() {
		/* Fetch data from API */
		this.data = await (await fetch(this.settings.urlData)).json();
		this.options = this.settings.controlPanel.split(' ');

		if (this.data && this.options.length && (typeof this.settings.controlPanelTrigger === 'string')) {
			/* Initial audio-checks */
			this.audio = {
				enabled: false,
				supported: (typeof window.speechSynthesis !== 'undefined')
			}
			if (this.audio.supported && this.options.includes('audio')) {
				this.audio.voices = await this.getVoices();
				const index = Object.values(this.data.audio.value).findIndex(key => { return key['data-type'] === 'voices'; });
				this.data.audio.value[index].__data = this.audio.voices;
				this.initAudio();
			}

			/* Find trigger insertion-node, if not found = exit */
			let [trigger, insertMethod] = this.settings.controlPanelTrigger.split('::');
			const wrapper = this.wrapper.querySelector(trigger);
			if (!wrapper) { return false; }

			/* Create inner markup from this.data & this.options */
			let html = '';
			this.options.forEach(option => {
				if (this.data[option]) {
					html+= this.renderGroup(this.data, option);
				}
			});

			/* Create main controls, add eventListeners */
			this.form = h('form', { class: this.settings.clsForm,  'data-cp-form': '' });
			this.form.innerHTML = html;
			this.form.addEventListener('change', (event) => { return this.setValue(event.target) });
			this.form.addEventListener('reset', this.resetForm.bind(this));
			this.reset = h('button', { type: 'reset', 'data-cp-reset': '' }, [this.settings.lblReset]);
			this.form.appendChild(this.reset);
			this.trigger = h('details', { 'data-cp-trigger': '' }, [h('summary', { 'data-cp-trigger-label': '' }, [h('span', { }, [this.settings.lblTrigger])])]);
			this.trigger.addEventListener('keydown', (event) => { if(event.key === 'Escape') {
				this.trigger.open = false;
				this.trigger.firstElementChild.focus();
			}});
			this.trigger.appendChild(this.form);
			this.outer = h('nav', { class: this.settings.clsOuter, 'data-cp': '', id: this.settings.controlPanelId ? this.settings.controlPanelId : uuid() }, [this.audio.enabled ? this.play : '', this.trigger]);
			wrapper.insertAdjacentElement(insertMethod || 'beforeend', this.outer);

			/* Close panel when clicking outside */
			document.addEventListener('click', () => {
				if (!this.outer.contains(event.target)) {
					this.trigger.open = false;
				}
			});
		}
		// eslint-disable-next-line
		console.log(this);
	}

	/**
	 * @function initAudio
	 * @description Init speechSynthesis, set defaults
	 * TODO
	 */
	initAudio() {
		const [lang, region] = (this.wrapper.lang || document.documentElement.lang || 'en-US').split('-');

		this.audio.enabled = true;
		this.audio.paused = false;
		this.audio.playing = false;
		this.audio.utterance = new SpeechSynthesisUtterance();
		this.audio.utterance.lang = `${lang}-${region}`;
		this.audio.utterance.pitch = 1;
		this.audio.utterance.rate = 1;
		this.audio.utterance.text = this.wrapper.innerText;
		this.audio.utterance.voice = this.audio.voices[0];
		this.audio.utterance.volume = 0.5;

		this.play = h('button', { class: this.settings.clsPlay, type: 'button', 'data-cp-play': '' }, [this.settings.lblPlay]);

		/* Add eventListeners */
		this.audio.utterance.addEventListener('boundary', (event) => { console.log(event); })
		this.audio.utterance.addEventListener('end', (event) => { console.log(event); })
		this.audio.utterance.onpause = () => { this.audio.paused = true; console.log('pause event') }
		this.play.addEventListener('click', this.playPauseAudio.bind(this));
	}

	/**
	 * @function playPauseAudio
	 * @description Play/Pause speechSynthesis
	 * TODO 
	 */
	playPauseAudio() {
		if (this.audio.playing) {
			this.audio.playing = false;
			this.play.innerText = this.settings.lblPlay;
			// speechSynthesis.pause();
			// speechSynthesis.cancel(); /* WIP: CHROME MAC */
			// speechSynthesis.resume();
			// this.paused = false;
		}
		else {
			// speechSynthesis.resume();
			this.audio.playing = true;
			this.play.innerText = this.settings.lblPause;
			// speechSynthesis.speak(this.audio.utterance);
		}
	}

	/**
	 * @function renderGroup
	 * @description Renders a radio-button group
	 * @param {Object} obj
	 * @param {String} key
	 * TODO
	 * data-target="${item.target || obj[key].target || ''}"
	 * ${item.checked ? ' checked': ''}
	 */
	renderGroup(obj, key) {
		const id = uuid();
		return `
		<details data-cp-item>
			<summary data-cp-item-summary><span data-cp-item-label>${obj[key].name}</span></summary>
			<div data-cp-item-panel>
			${obj[key].value.map(item => {
				const tag = item.type === 'select' ? item.type : 'input';
				return `
				<label aria-label="">
					<!-- TODO! LABEL BEFORE -->
					<${tag} ${item.type==='radio' ? ` name="${id}"` : ''}
						${Object.keys(item).map(entry => {return !entry.startsWith('__') ? `${entry}="${item[entry]}"` : ''}).join('')}
						data-key="${obj[key].key || item.__key}"
						data-key-type="${obj[key].type || 'property'}"
						data-parent="${key}">
						${tag === 'select' && item.__data ? item.__data.map(option => { return `<option value="${option.value || option.name}">${option.name}</option>` }).join('') : '' }
					</${tag}>

					${item.__icon ? item.__icon : ''}
					${!item.__icon && item.__label ? `<span class="${item.__labelclass || ''}">${item.__label}</span>` : ''}
				</label>
			`}).join('')}
			</div>
		</details>`;
	}

	/**
	 * @function resetForm
	 * @description Resets to default values
	 */
	resetForm() {
		/* Run updates after regular `reset`-event */
		setTimeout( () => {
			const elements = this.form.querySelectorAll(`[checked], [type="checkbox"]:not(checked), [type="range"], select`);
			elements.forEach(element => {
				this.setValue(element);
			})
		}, 100);
	}

	/**
	 * @function saveState
	 * @description Save current state to localStorage
	 */
	saveState() {
		window.localStorage.setItem(this.outer.id, JSON.stringify(this.data));
	}

	/**
	 * @function setCSSProperty
	 * @description Helper-function for setting a custom CSS property on a given element
	 * @param {Node} element
	 * @param {String} property
	 * @param {String | Number} value
	 * @param {String} [suffix]
	 */
	setCSSProperty(element = document.documentElement, property, value, suffix = '') {
		element.style.setProperty(`--${property}`, `${value}${suffix}`);
	}

	/**
	 * @function setCSSClass
	 * @description Helper-function for setting a CSS-class, and removing classes matching a prefix-key.
	 * @param {Node} target
	 * @param {Node} element
	 */
	setCSSClass(target, element) {
		const keys = [...target.classList].filter(item => {return !item.includes(element.dataset.key)});
		keys.push(element.value);
		target.className = keys.join(' ');
	}

	/**
	 * @function setValue
	 * @description Main event-handler
	 * @param {Node} element
	 */
	setValue(element) {	
		const target = element.dataset.target ? document.querySelector(element.dataset.target) || this.wrapper : this.wrapper;
		let value = element.value;
		switch (element.dataset.keyType) {
			case 'pitch':
				break;
			case 'property':
				if (element.type === 'checkbox' && !element.checked) { 
					value = 0;
				}
				this.setCSSProperty(target, element.dataset.key, value, element.dataset.suffix);
				break;
			case 'rate':
				break;
			case 'voices':
				this.audio.utterance.voice = this.audio.voices[element.selectedIndex];
				break;
			default:
				this.setCSSClass(target, element);
				break;
		}
		if (this.fnCallback) {
			this.fnCallback(element);
		}
	}
}