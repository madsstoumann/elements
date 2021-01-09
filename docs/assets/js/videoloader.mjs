/**
 * VideoLoader module.
 * @module /assets/js/video
 * @version 1.1.18
 * @summary 07-01-2021
 * @description Video-handling
 */
import { insertScript } from './common/insertscript.mjs';
export default class VideoLoader {
	constructor(settings) {
		this.settings = Object.assign({
			hosts: [
				{
					api: 'https://player.vimeo.com/api/player.js',
					filter: 'vimeo',
					ready: (a) => a.forEach(v => {
						v.__VIDEO_PAUSE = 'pause',
						v.__VIDEO_PLAY = 'play',
						v.__VIDEO_PLAYER = new Vimeo.Player(v, {})
					})
				},
				{
					api: 'https://www.youtube.com/player_api',
					filter: 'youtube',
					ready: (a) => {
						window.onYouTubeIframeAPIReady = () => {
							a.forEach(v => new YT.Player(v,
								{
									events: {
										'onReady': (e) => {
											const v = e.target.h;
											v.__VIDEO_PAUSE = 'pauseVideo',
											v.__VIDEO_PLAY = 'playVideo',
											v.__VIDEO_PLAYER = e.target
										},
										'onStateChange': (e) => {
											if (e.data === 1) {
												if (window.__VIDEO_PLAYING !== e.target.h) {
													this.pauseVideo();
												}
												window.__VIDEO_PLAYING = e.target.h;
											}
										}
									}
								})
							)
						}
					}
				}
			],
			intersectionRatio: 0.75,
			lblPause: 'Pause',
			lblPlay: 'Play',
			selector: `[data-video]:not([data-loaded]) iframe, [data-video]:not([data-loaded]) video`,
		}, settings);
		this.init();
	}

	/**
	 * @function init
	 * @description Init 
	*/
	init() {
		this.saveData = ('connection' in navigator && (navigator.connection.saveData === true));
		this.wakeLock = ('wakeLock' in navigator);
		const videos = [...document.querySelectorAll(this.settings.selector)];

		if (this.settings.hosts) {
			const promises = [];
			this.settings.hosts.forEach(host => {
				host.videos = videos.filter(video => video?.src.includes(host.filter));
				if (host.videos) {
					promises.push(insertScript(host.api))
				}
			});

			Promise.all(promises).then((result) => {
				result.forEach(entry => {
					const index = this.settings.hosts.findIndex(host => host.api === entry);
					if (index > -1) {
						const host = this.settings.hosts[index];
						host.ready(host.videos);
					}
				});
				this.observeVideos(videos);
			})
		}
		else {
			this.observeVideos(videos);
		}

		/* Pause video, if user goes to another browser tab */
		document.addEventListener("visibilitychange", () => { if (document.hidden) this.pauseVideo(); });

		/* IntersectionObserver */
		this.IO = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const video = entry.target;
					if (entry.intersectionRatio < this.settings.intersectionRatio) {
						// console.log(document.pictureInPictureEnabled)
						this.pauseVideo(video);
					}
					else {
						if (entry.target.parentNode.dataset.video === 'autoplay') {
							if (!this.saveData) {
								this.playVideo(video);
							}
						}
					}
				}
			});
		}, {
			threshold: [0, this.settings.intersectionRatio]
		});

		this.loadButtons();
	}

	/**
	 * @function loadButtons
	 * @param {String} selector
	 * @description Selects custom play/pause buttons, adds event
	*/
	loadButtons(selector = `[data-video-play]:not([data-loaded])`) {
		document.querySelectorAll(selector).forEach(button => {
			button.addEventListener('click', (event) => { this.toggleVideo(event) });
			/* Prevent button from being selected again, if new videos are loaded dynamically */
			button.dataset.loaded = '';
		});
	}

	/**
	 * @function observeVideos
	 * @param {Nodelist} videos
	 * @description Add video-elements to IntersectionObserver.
	*/
	observeVideos(videos) {
		videos.forEach((video) => {
			this.IO.observe(video);
			/* Prevent video from being selected again, if new videos are loaded dynamically */
			video.parentNode.dataset.loaded = '';
		});
	}

	/**
	 * @function pauseVideo
	 * @description Pauses a video
	*/
	pauseVideo() {
		/* TODO: UPDATE toggleButtons! */
		const video = window.__VIDEO_PLAYING;
		if (video) {
			if (video.__VIDEO_PLAYER) {
				video.__VIDEO_PLAYER[video.__VIDEO_PAUSE]();
			}
			else {
				video.pause(); /* <video> and Vimeo */
			}
		}
	}

	/**
	 * @function playVideo
	 * @param {Node} video
	 * @description Plays a video
	*/
	playVideo(video) {
		/* TODO: UPDATE toggleButtons! */
		if (video) {
			if (video.__VIDEO_PLAYER) {
				video.__VIDEO_PLAYER[video.__VIDEO_PLAY]();
			}
			else {
				video.play();
			}	
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
		const isPlaying = ('playing' in button.dataset);

		if (poster && video) {
			this.pauseVideo();

			// TODO
			const keep = button.dataset.videoPlay.includes('keep');
			const hideButton = button.dataset.videoPlay.includes('hide-button');

			if (isPlaying) {
				delete button.dataset.playing;
				if (keep) { poster.hidden = false; }
				button.setAttribute('aria-label', this.settings.lblPlay);
			}
			else {
				if (hideButton) { button.hidden = true; }
				button.dataset.playing = '';
				button.setAttribute('aria-label', this.settings.lblPause);
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