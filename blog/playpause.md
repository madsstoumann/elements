# Pause And Play Animations

I've done a lot of work with the `<details>`-tag recently - it's the obvious candidate for [accordions](https://codepen.io/stoumann/pen/ExydEYL), but it can also be used for [tool-tips](https://css-tricks.com/exploring-what-the-details-and-summary-elements-can-do/), [toggle-tips](https://codepen.io/stoumann/pen/abZXxPx), drop-downs (styled `<select>`-lookalike), mega-menus ... you name it. It *is* HTML's official disclosure-tag, after all. Apart from the *global attributes* and *global events* that all HTML-elements have, it has a single attribute: `open`, and a single event: `toggle`. 

So, I thought, can you (mis-)use it like the "checkbox hack" to "toggle" anything?
And ... what if the **state** it sets is one or more *CSS Custom Properties**?

The "checkbox-hack" requires a unique `id` for the `<input type="checkbox">` and a `for`-attribute for the `<label>`, unless you wrap everything within the `<label>`, which limits you a bit. The "details-hack" is actually a bit simpler:

```html
<details>
  <summary>Toggle</summary>
</details>
```

And in CSS:

```css
details[open] {
  --state: 1;
}
details:not([open]) {
  --state: 0;
}
```

I decided to do a *slideshow*, where the slides change automatically by a *primary animation* and each inidvidual slide can have it's own unique animation, a *secondary animation*.

```html
<figure style="--animn:slide;--index:0;">
  <img src="..." />
  <figcaption>Caption</figcaption>
</figure>
```


In order not to overload the GPU, the *primary animation* will pause the *secondary animations*


```css
@keyframes autoplay {
  0.1% {
    --img-animps: running;
    opacity: 0;
    z-index: calc(var(--z) + var(--slides))
  }
  5% { opacity: 1 }
  50% { opacity: 1 }
  51% { --img-animps: paused }
  100% {
    opacity: 0;
    z-index: var(--z)
  }
}
```

[EMBED]
https://codepen.io/stoumann/pen/NWRGavM



How often have you used `animation-play-state`?



