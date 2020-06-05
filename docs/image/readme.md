# Responsive images and CMS

The first time I implemented responsive images in Episerver, it was very basic:

```html
<img srcset="
	big.jpg?w=768 768w,
	medium.jpg?w=320 320w,
	small.jpg?w=160 160w"
	src="fallback.jpg"
/>
```

When you don't fill out `sizes`, it will assume `100vw`, and at that time it didn't throw a validation error if you omitted `sizes`.

Later, a back-end developer added another service, allowing to use "presets" - a bit more readable, perhaps:

```html
<img srcset="
image.jpg?preset=hero-phone 415w,
image.jpg?preset=hero-phablet 641w,
image.jpg?preset=hero-tablet-grid-1-1 1025w,
image.jpg?preset=hero-desktop-grid-1-1 1281w"

sizes="(max-width: 415px) 50vw,
(max-width: 641px) 50vw,
(max-width: 1025px) 55vw,
(max-width: 1281px) 1281px"

src="image.jpg?preset=hero-phone">
```

Today, responsive images is still something we typically "hardcode" per "block" (Episerver for "component"). So - we'll pick the typical sizes for, as an example, a "hero" block - and then the block will use these settings.

Lately I've had more and more requests from editors to have more control over images:

- "Can we change to a different image per breakpoint"?
- "Can we show another image when in 'dark mode'"?
- "Can we change aspect-ratio per breakpoint"?