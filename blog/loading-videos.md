# Loading videos
It's simple enough to include a video on a webpage, but as soon as you have multiple videos — maybe even _both_ locally hosted videos and videos from external vendors like YouTube — things get complicated.

Some videos could be small, auto-playing, “gif-like” videos — others will require a manual “click to play”.

No matter _which_ type of video, it needs to pause/stop when:

1. You click on *another* video, or when another video is activated automatically as it enters the viewport (with `autoplay` enabled)
2. The video leaves the viewport (detect using `IntersectionObserver`)
3. You go to another browser-tab (detect using `onVisibilityChange`)

In this tutorial, I'll be building a `VideoLoader`-class in JavaScript, which will be able to handle all these scenarios for videos using the `<video>`-tag _and_ for embedded YouTube-videos, using the `<iframe>`-tag. The free version of the YouTube API will be used to pause/play YouTube-videos.

---

## Data-model

No matter if the video is using the `<video>`-tag or is an embedded YouTube-video in an `<iframe>`, the data-model should be the same:

- autoplay `(boolean: false)`
- controls `(boolean: true)` _Show video controls_
- fullscreen `(boolean: true)` _Show fullscreen control_
- lang `(string: empty)` [^1]
- loop `(boolean: false)`
- mute `(boolean: false)`
- playsinline `(boolean: true)`
- poster `(string/url)` [^2]
- preload `(boolean: false)`
- src `(string/url)` [^3]
- title `(string)`

[^1] Either empty, or a valid ISO 639-1 two-letter language-code: http://www.loc.gov/standards/iso639-2/php/code_list.php

[^2] Image-asset. Display a poster-image instead of the first video-frame. When this is added, an additional layer with a "play"-button will be added as well.  

If a poster-image exists, _autoplay_ will be ignored.

[^3] The src of the video is a `url`, that can either point to a local asset or to a YouTube-video.

Below is a JSON-exanple of the _Data Model:_
```json
{
  "autoplay": false,
  "controls": true,
  "fullscreen": true,
  "lang": "", 
  "loop": false,
  "mute": false,
  "playsinline": true,
  "poster": "",
  "preload": false,
  "src": "https://www.youtube.com/embed/GNuG-5m4Ud0",
  "title": "New in Chrome 86"
}
```

---

## Global config
Videos with a `poster` will require some global `consts`, specifying which texts and icons to use for the `play/pause`-button.

- pause icon `(string)`
- pause text `(string)`
- play icon `(string)`
- play text `(string)`


---

## Update CSP to support YouTube
When using YouTube-videos, the site's _Content Security Policy_ needs to be updated as well — extend your existing settings with these values:

```html
<meta http-equiv="Content-Security-Policy" content="
script-src *.youtube.com *.ytimg.com;
img-src 'self' *.ytimg.com data:;
frame-src *.youtube.com;">
```

---

## HTML

No matter if it's a `<video>` or `<iframe>`-tag, it should be placed within a wrapper with a `data-video`-attribute:

```html
<div data-video>
  <video> ... </video>
</div>
```

In the CMS, create partial views for both `<video>` and `<iframe>`-cases.  
The latter should be called/used, if `src` points to either an external url, or if the string contains the word “youtube” — it's entirely up to you how you want to detect that. Below are JavaScript-examples on how to create these partial views.

*_Example:_*  
`<video>`-tag, called with a video-object (see `json` above):

```js
tmplVideo(video) {
  return `
  <div data-video="${video.autoplay ? 'autoplay':''}">
    <video
      ${video.controls ? ` controls`:''}
      ${video.fullscreen ? ` data-hide-fullscreen`:''}
      ${video.loop ? ` loop`:''}
      ${video.mute ? ` muted`:''}
      ${video.playsinline ? ` playsinline`:''}
      preload="${video.preload ? 'auto':'none'}">
      <source src="${video.src}" type="video/mp4">
    </video>
    ${video.poster ? `
      <img data-video-poster src="${video.poster}" alt="${video.title}" />
      <button data-video-play type="button" aria-label="PLAY TEXT">
        PLAY-ICON
      </button>`:''}
  </div>`
}
```

*_Example:_*  
`<iframe>`-tag, called with a video-object (see `json` above):

```js
tmplVideoIframe(video) {
  return `
  <div data-video="${video.autoplay ? 'autoplay':''}">
    <iframe
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      frameborder="0"
      loading="${video.preload ? 'eager' : 'lazy'}"
      src="
      ${video.src}?${video.controls ? `controls=1`:''}
      ${video.fullscreen ? `&amp;fs=1`:''}
      ${video.lang ? `&amp;hl=${video.lang}`:''}
      ${video.loop ? `&amp;loop=1`:''}
      ${video.mute ? `&amp;mute=1`:''}
      ${video.playsinline ? `&amp;playsinline=1`:''}
      &amp;enablejsapi=1"
      title="${video.title}">
    </iframe>
    ${video.poster ? `
      <img data-video-poster src="${video.poster}" alt="${video.title}" />
      <button data-video-play type="button" aria-label="PLAY TEXT">
        PLAY-ICON
      </button>`:''}
  </div>`
}
```

> **IMPORTANT:** When using the `<video>`-tag, it's allowed to have multiple `<source>`-tags, all with different `type`-attributes (like `video/webm` or `video/ogg`).
In this tutorial, I'll be using a single `<source>`-tag with `type` set to `video/mp4`.

---

## Can the `<iframe>`-tag be used with other vendors?

The example above will also work with other iframe-based videos, such as Vimeo. Try changing the `scr` in the json:

```json
"src": "https://player.vimeo.com/video/336812660"
```

However, the `VideoLoader`-script does _not_ support other vendors than YouTube.

---

## What about structured markup?
In these examples, I've not added structured markup (or “schema”-code, or “Google Rich Snippets”). That's because you'd need more fields in the _Data Model_ in order to pass the structured markup validation:

- description `(string)`
- uploadDate `(date: ISO 8601)`
- thumbnailUrl `(string/url)`


_Example:_

```html
<div data-video itemscope itemtype="http://schema.org/VideoObject">
  <meta itemprop="description" content="${video.description}">
  <meta itemprop="name" content="${video.title}">
  <meta itemprop="thumbnailUrl" content="${video.thumbnail}">
  <meta itemprop="uploadDate" content="${video.date}">
  <video itemprop="video"> ... </video>
</div>
```

---

## CSS
Some global, basic styles are needed for the `VideoLoader` — these have been added as `data`-attributes, so you can use the regular `class` for the actual styles.

```css
[data-hide-fullscreen]::-webkit-media-controls-fullscreen-button {
/* when using <video>, and `fullscreen` is `false`*/
  display: none !important;
}
[data-video] > iframe,
[data-video] > video,
[data-video-poster] {
  height: 100%;
  object-fit: cover;
  position: absolute;
  width: 100%;
}
[data-video] {
/* `--h` and `--w` controls aspect-ratio, default is 16:9 */
  --h: 9;
  --w: 16;
  margin: 0;
  position: relative;
  padding: 0;
  width: 100%;
}
[data-video]::after {
  content: "";
  display: block;
  padding-bottom: calc(100% * (var(--h) / var(--w)));
}
[data-video-play] {
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

_Example:_

To overwrite `aspect-ratio` for a specific video, create a class:

```css
[data-video].aspr-2-1 {
  --h: 1;
  --w: 2;
}
```

And add to the wrapper:

```html
<div data-video class="aspr-1-2"> ... </div>
```

---

## Autoplay

The `autoplay`-setting is _not_ added as an inline attribute or as part of the embed-url, as you'd normally do. Instead it's added to the `data-video`-attribute on the main wrapper, and will be controlled from JavaScript.

---

## Handling dynamically loaded videos
