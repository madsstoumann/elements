/**
 * VideoLoader module.
 * @module /assets/js/video
 * @version 1.1.12
 * @summary 02-01-2021
 * @description Video-handling
 */
import { insertScript } from './common/insertscript.mjs';
export default class VideoLoader {
	constructor(settings) {
		this.settings = Object.assign({
			intersectionRatio: 0.75,
			youtubeAPI: 'https://www.youtube.com/player_api'
		}, settings);
		this.init();
	}

	/**
	 * @function init
	 * @description Init 
	*/
	init() {
		/* Inject YouTube API-script */
		insertScript(this.settings.youtubeAPI);

		/* Check for saveData */
		this.saveData = false;
		if ('connection' in navigator && (navigator.connection.saveData === true)) {
			this.saveData = true;
		}

		/* Add eventListeners */
		window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);
		document.addEventListener("visibilitychange", () => { if (document.hidden) this.pauseVideo(); });

		/* Add IntersectionObserver */
		this.IO = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const video = entry.target.querySelector('iframe, video');
					if (entry.intersectionRatio < this.settings.intersectionRatio) {
						this.pauseVideo(video);
					}
					else {
						if (entry.target.dataset.video === 'autoplay') {
							this.playVideo(video);
						}
					}
				}
			});
		}, {
			threshold: [0, this.settings.intersectionRatio]
		});

		this.loadVideos();
		this.loadButtons();
	}

		/**
	 * @function loadButtons
	 * @param {String} selector
	 * @description Add eventListener to play/pause buttons
	*/
	loadButtons(selector = `[data-video-play]:not([data-video-loaded])`) {
		document.querySelectorAll(selector).forEach(button => {
			button.addEventListener('click', (event) => { this.toggleVideo(event) });
			/* Prevent button from being selected again, if new videos are loaded dynamically */
			button.dataset.videoLoaded = '';
		});
	}

	/**
	 * @function loadVideos
	 * @param {String} selector
	 * @description Add video-elements to IntersectionObserver.
	*/
	loadVideos(selector = `[data-video="autoplay"]:not([data-video-loaded])`) {
		if (this.saveData) { return; }
		document.querySelectorAll(selector).forEach((element) => {
			this.IO.observe(element);
			/* Prevent video from being selected again, if new videos are loaded dynamically */
			element.dataset.videoLoaded = '';
		});
	}

	/**
	 * @function onYouTubeIframeAPIReady
	 * @description Init YouTube API
	*/
	onYouTubeIframeAPIReady() {
		const videos = document.querySelectorAll(`iframe[src*="youtube"]`);
		videos.forEach(video => {
			const player = new YT.Player(video, {
				events: {
					'onReady': this.onYouTubePlayerReady.bind(this),
					'onStateChange': this.onYouTubePlayerStateChange.bind(this)
				}
			});
		});
	}

	/**
	 * @function oYouTubePlayerReady
	 * @param {Event} event
	 * @description Set a property on YouTube-iframe with the (inner) player as reference. This is (as per January 2021), the "h"-property.
	*/
	onYouTubePlayerReady(event) {
		event.target.h.__VIDEO_PLAYER = event.target;
	}

	/**
	 * @function onYouTubePlayerStateChange
	 * @param {Event} event
	 * @description Triggers when a YouTube-video change state (play/pause)
	*/
	onYouTubePlayerStateChange(event) {
		/* Native YouTube play-button pressed */
		if (event.data === 1) {
			if (window.__VIDEO_PLAYING !== event.target.h) {
				this.pauseVideo();
			}
			window.__VIDEO_PLAYING = event.target.h;
		};
	}

	/**
	 * @function pauseVideo
	 * @description Pauses a video
	*/
	pauseVideo() {
		if (window.__VIDEO_PLAYING === undefined) { return; }
		const video = window.__VIDEO_PLAYING;
		if (video) {
			video.tagName === 'VIDEO' ? video.pause() : video?.__VIDEO_PLAYER?.pauseVideo();
		}
	}

	/**
	 * @function playVideo
	 * @param {Node} video
	 * @description Plays a video
	*/
	playVideo(video) {
		if (video) {
			video.tagName === 'VIDEO' ? video.play() : video?.__VIDEO_PLAYER?.playVideo();
			console.log(window.__VIDEO_PLAYING)
			if (!video?.__VIDEO_PLAYER) return;
			window.__VIDEO_PLAYING = video;
		}
	}

	/**
	 * @function toggleVideo
	 * @param {Event} event
	 * @description Handles clicks on custom play-buttons
	*/
	toggleVideo(event) {
		const button = event.target;
		const poster = button.parentNode.querySelector('[data-video-poster]');
		const video = button.parentNode.querySelector('[data-video] iframe, [data-video] video');

		if (poster && video) {
			this.pauseVideo();

			// TODO
			const keep = button.dataset.videoPlay.includes('keep');
			const hideButton = button.dataset.videoPlay.includes('hide-button');

			if ('playing' in button.dataset) {
				delete button.dataset.playing;
				if (keep) { poster.hidden = false; }
			}
			else {
				if (hideButton) { button.hidden = true; }
				button.dataset.playing = '';
				poster.hidden = true;
				this.playVideo(video);
			}
		}

		/* Re-show poster and play-button, when video is done */
		video.addEventListener('ended', function videoEnded() {
			delete button.dataset.playing;
			button.hidden = false;
			poster.hidden = false;
			video.removeEventListener('ended', videoEnded);
		});
	}
}