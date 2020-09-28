/**
 * @function lazyLoad
 * @description Use Intersection Observer to lazy-load iframes, images, picture-source and videos
*/
export function lazyLoad() {
	const elements = document.querySelectorAll("iframe[data-src], img[data-src], video");
	const lazyObserver = new IntersectionObserver(function(entries) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) {
				const element = entry.target;
				const tagName = element.tagName;
				if (tagName === 'VIDEO') {
					for (let source in element.children) {
						const videoSource = element.children[source];
						if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
							videoSource.src = videoSource.dataset.src;
						}
					}
					element.load();
				}
				else {
					element.src = element.dataset.src;
					delete element.dataset.src;
					if (element.dataset.srcset) {
						element.srcset = element.dataset.srcset;
						delete element.dataset.srcset;
					}
				}
				lazyObserver.unobserve(element);
			}
		});
	});
	elements.forEach(function(element) {
		lazyObserver.observe(element);
	});
}