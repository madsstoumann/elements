/**
 * VideoLoader module.
 * @module /assets/js/video
 * @version 1.1.27
 * @summary 19-01-2021
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
						v.__VIDEO.pause = 'pause';
						v.__VIDEO.play = 'play';
						v.__VIDEO.player = new Vimeo.Player(v, {});
						v.__VIDEO.player.on('ended', () => {
							this.restorePoster(v);
							this.log('Vimeo', 'Finished', 'cornflowerblue');
						});
						v.__VIDEO.player.on('play', () => {
							window.__VIDEO.playing = v;
							this.log('Vimeo', 'Play', 'cornflowerblue');
						});
						v.__VIDEO.player.on('pause', () => { 
							if (window.__VIDEO.playing === v) { window.__VIDEO.playing = ''; }
							this.log('Vimeo', 'Pause', 'cornflowerblue');
						});
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
											v.__VIDEO.pause = 'pauseVideo';
											v.__VIDEO.play = 'playVideo';
											v.__VIDEO.player = e.target;
										},
										'onStateChange': (e) => {
											if (e.data === 0) { /* ended */
												this.restorePoster(e.target.h);
												this.log('Youtube', 'Finished', 'red');
											}
											if (e.data === 1) { /* play */
												window.__VIDEO.playing = e.target.h;
												this.log('Youtube', 'Play', 'red');
											}
											if (e.data === 2) { /* pause */
												if (window.__VIDEO.playing === e.target.h) { window.__VIDEO.playing = ''; }
												this.log('YouTube', 'Pause', 'red');
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
			selector: `[data-video]:not([data-loaded]) iframe, [data-video]:not([data-loaded]) video`,
		}, settings);
		this.init();
	}

	/**
	 * @function createVideoObjects
	 * @param {Nodelist} videos
	 * @description Add video-elements to IntersectionObserver.
	*/
	createVideoObjects(videos) {
		videos.forEach(video => {
			video.__VIDEO = {
				controls: video.dataset.videoOptions.includes('controls'),
				pause: 'pause',
				pip: '',
				play: 'play',
				player: '',
				posterhide: video.dataset.videoOptions.includes('posterhide'),
			}
		});
	}

	/**
	 * @function init
	 * @description Init 
	*/
	init() {
		const videos = [...document.querySelectorAll(this.settings.selector)];
		if (!videos) return;

		this.saveData = ('connection' in navigator && (navigator.connection.saveData === true));

		/* Create global video-object */
		window.__VIDEO = { playing: '' }

		/* Create object per video */
		this.createVideoObjects(videos);

		if (this.settings.hosts) {
			const promises = [];
			/* Iterate hosts, if any */
			this.settings.hosts.forEach(host => {
				host.videos = videos.filter(video => video?.src.includes(host.filter));
				/* If a host exists AND have matching videos, push host API to promises-array */
				if (host.videos) {
					promises.push(insertScript(host.api))
				}
			});

			/* Iterate all host api-promises - then, when all done/loaded, find host in hosts-array, and run `ready()`-method */
			Promise.all(promises).then((result) => {
				result.forEach(entry => {
					const index = this.settings.hosts.findIndex(host => host.api === entry);
					if (index > -1) {
						const host = this.settings.hosts[index];
						host.ready(host.videos);
					}
				});
				/* When all promises are done, run `prepAndObserveVideos` */
				this.prepAndObserveVideos(videos);
			})
		}
		else {
			/* No external hosts/api's specified, observe only inline <video>s */
			this.prepAndObserveVideos(videos);
		}

		/* Pause video, if user goes to another browser tab */
		document.addEventListener("visibilitychange", () => { if (document.hidden) this.pauseVideo(); });

		/* IntersectionObserver */
		this.IO = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const video = entry.target;

					/* Video is leaving viewPort */
					if (entry.intersectionRatio < this.settings.intersectionRatio) {
						if (video === window.__VIDEO.playing) {
							this.pauseVideo(video);
							this.log('IO', `Pause: ${video.tagName}`, 'gray');
						}
					}

					/* Video is entering viewport */
					else {
						if (video.parentNode.dataset.video === 'autoplay') {
							if (!this.saveData) {
								this.playVideo(video);
								this.log('IO',  `Play: ${video.tagName}`, 'gray');
							}
						}
					}
				}
			});
		}, {
			threshold: [0, this.settings.intersectionRatio]
		});
	}

	/**
	 * @function log
	 * @param {String} header
	 * @param {String} message
	 * @param {String} background
	 * @param {String} color
	 * @description Custom console.log with color-options
	*/
	log(header, message, background = 'red', color = 'white') {
		console.log(`%c ${header} %c ${message} `, `background:#333333 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff`, `background:${background} ; padding: 1px; color: ${color}`);
	}

	/**
	 * @function prepAndObserveVideos
	 * @param {Nodelist} videos
	 * @description Add eventListeners, detect pip etc. for an array of videos
	*/
	prepAndObserveVideos(videos) {
		videos.forEach((video) => {
			if (video.tagName === 'VIDEO') {
				video.addEventListener('play', (e) => { window.__VIDEO.playing = e.target; }); 
				video.addEventListener('pause', (e) => { if (window.__VIDEO.playing === e.target) { window.__VIDEO.playing = ''; } }); 
				video.addEventListener('ended', () => { this.restorePoster(video); });

				/* Check DOM for `picture-in-picture`-buttons */
				const pipBtn = video.parentNode.querySelector('[data-video-pip');
				if (pipBtn) {
					if (document.pictureInPictureEnabled) { 
						pipBtn.addEventListener('click', () => { this.togglePip(video) });
						/* Add listener to video itself, so native "pip leave" can also be used */
						video.addEventListener('leavepictureinpicture', () => {
							/* Delete pip-attribute on button (change icon) */
							delete video.__VIDEO.pip.dataset.pip;
						});
						video.__VIDEO.pip = pipBtn;
					}
					else {
						/* `picture-in-picture` not supported, hide button */
						pip.hidden = true; 
					}
				}
			}

			/* Check DOM for play/pause-button and custom poster */
			const button = video.parentNode.querySelector('[data-video-play]')
			const poster = video.parentNode.querySelector('[data-video-poster]');

			if (button && poster) {
				button.__VIDEO = { player: video }
				video.__VIDEO.button = button;
				video.__VIDEO.poster = poster;
				button.addEventListener('click', () => { this.toggleVideo(button) });
			}

			/* Add to Observer */
			this.IO.observe(video);

			/* Prevent video from being selected again, if new videos are loaded dynamically */
			video.parentNode.dataset.loaded = '';	
		});
	}

	/**
	 * @function restorePoster
	 * @param {Node} video
	 * @description Show/hide custom poster, updates play-button when pausing.
	*/
	restorePoster(video) {
		if (video.__VIDEO.poster) {
			const button = video.__VIDEO.button;
			if (!video.__VIDEO.posterhide) {
				button.hidden = false;
				video.__VIDEO.poster.hidden = false;
			}
			button.setAttribute('aria-label', button.dataset.videoPlay);
			delete button.dataset.playing;
		}
	}

	/**
	 * @function pauseVideo
	 * @description Pauses a video
	*/
	pauseVideo() {
		if (document.pictureInPictureElement) { return; }
		const video = window.__VIDEO.playing;

		if (video) {
			this.restorePoster(video);

			if (video.__VIDEO.player) {
				/* External host */
				video.__VIDEO.player[video.__VIDEO.pause]();
			}
			else {
				/* Inline <video> */
				window.__VIDEO.playing = '';
				this.log('Inline', 'Pause', 'orange');
				video.pause();
			}
		}
	}

	/**
	 * @function playVideo
	 * @param {Node} video
	 * @description Plays a video
	*/
	playVideo(video) {
		if (document.pictureInPictureElement) { return; }
		if (window.__VIDEO.playing) { this.pauseVideo(); }
		if (video) {
			/* If the video has a custom poster and play-button, hide poster and add `data-playing`-attribute to button */
			if (video.__VIDEO.poster) {
				const button = video.__VIDEO.button;
				video.__VIDEO.poster.hidden = true;
				if (video.__VIDEO.controls) { video.__VIDEO.button.hidden = true; }
				button.setAttribute('aria-label', button.dataset.videoPause);
				button.dataset.playing = '';
			}

			if (video.__VIDEO.player) {
				/* External host */
				video.__VIDEO.player[video.__VIDEO.play]();
			}
			else {
				/* Inline <video>. `preload="none" might be set, so create `play`-promise */
				try {
					const play = video.play();
					if (play !== undefined) {
						play.then(_ => {
							this.log('Inline', 'Play', 'orange');
						})
						.catch(error => { console.error(error) });
					}
				}
				catch(error) {
					console.error(error);
				}
			}	
			window.__VIDEO.playing = video;
		}
	}

	/**
	 * @function togglePip
	 * @param {Node} video
	 * @description En/disables picture-in-picture
	*/
	togglePip(video) {	
		if (document.pictureInPictureElement) {
			document.exitPictureInPicture();
			if (video !== window.__VIDEO.playing) {
				//TODO
			}
		}
		else {
			window.__VIDEO.playing = video;
			video.requestPictureInPicture();
			video.__VIDEO.pip.dataset.pip = ''
		}
	}

	/**
	 * @function toggleVideo
	 * @param {Event} event
	 * @description Handles clicks on custom play-buttons
	*/
	toggleVideo(button) {
		const isPlaying = window.__VIDEO.playing === button.__VIDEO.player;
		if (isPlaying) {
			this.pauseVideo();
		}
		else {
			this.playVideo(button.__VIDEO.player);
		}
	}
}