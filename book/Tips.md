# A helpful tip
_Tooltips_ and _Toggletips_ are popular interface patterns, displaying small snippets of extra information on either `mouseover` (keyboard: `:focus` or `:hover`) for _Tooltips_ — and `click` (keyboard: `enter` or `space`) for _Toggletips_. 

---
## User Experience

In [Inclusive Componens](https://inclusive-components.design/tooltips-toggletips/), Heydon Pickering writes:

> ... tooltips are for clarification; they are for providing missing information. But why should that information be missing in the first place?

— so should we even use them?

I think there are some valid use-cases.

---

## Tooltips

---

## Toggletips
Most implementations of _Toggletips_, use the `<button>`-element as _toggler_, and JavaScript to handle the `open`-state.

I like to use the `<details>`-element, HTML5's built-in _"Disclosure Widget"_, since this is in line with the _minimum viable experience_-philosophy, i.e. making controls work, even when JavaScript fails (or is disabled).

---

### Pattern: Description List, as inline links

```html
<details class="c-tgt" data-js="tgt">
  <summary class="c-lnk c-lnk--ica c-tgt__summary">
    <span class="c-tgt__summary-header">
      Internet protocol suite
    </span>
  </summary>
  <dl class="c-tgt__dialog">
    <dt class="c-tgt__dialog-headline">
      Internet protocol suite
    </dt>
    <dd class="c-tgt__dialog-text">
      The Internet protocol suite is the conceptual model and set of communications protocols used on the Internet and similar computer networks. It is commonly known as TCP/IP because the original protocols in the suite are the Transmission Control Protocol (TCP) and the Internet Protocol (IP).
    </dd>
  </dl>
</details>
```

---

### Pattern: Block, that push content down