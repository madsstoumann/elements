# Sharp as a `<button>`

The `<button>`-element is one of the most used — and misused - of all the HTML5-elements.

---

## User experience
It should be used for **important actions**, such as *Buy item*, *Sign up*, *Log in* etc., **not** for linking between a site's pages. For that, we have the `<a>`-element.

Heydon Pickering immortalised [this StackOverflow-post](https://stackoverflow.com/questions/710089/how-do-i-make-an-html-link-look-like-a-button/5118149) at Fronteers in 2016.  
Entitled _"How do I make an html link look like a button?"_, the suggested answers are full of examples on what **not** to do — like this:

```html
<a href="somepage.html"><button type="button">Text of Some Page</button></a>
```

And sometimes, you'll see the opposite: an `<a>`-element, that _should have been_ a `<button>`:

```html
 <a href="javascript:void(0)" onclick="gotoNext();">Next page</a>
 ```

### Rule-of-thumb: Link or Button?
If your control is using JavaScript to do something after a user-interaction, you probably need to use `<button>`.  
If your control is changing the URL of the page (or part of the URL, like the fragment), you need to use `<a>`. 

Another reason to use proper semantics, taken from the [US Web Design Standards](https://designsystem.digital.gov/components/button):

> **Screen readers handle buttons and links differently**. When styling links to look like buttons, remember that screen readers handle links slightly differently than they do buttons. Pressing the Space key triggers a button, but pressing the Enter key triggers a link.

 Semantically, the `<button>`-element should also be used for navigation-controls in carousels and tabs, and for smaller UI-elements (often only with an icon and `aria-label` and maybe `aria-pressed`) such as _"Add to wishlist"_. 
 
 A `<button>` is often also seen as the _toggler_ of custom list-controls, but here I'd suggest using the `<details>`-element instead, which is HTML5's built-in *disclosure*-element.

 ### The battle for attention
 You should _never_ use two similar buttons next to each other. One of them _must_ be more important than the other, and thus styled differently.

And ... to quote the _US Web Design Standards_ yet again:
 > Avoid using too many buttons on a page.
 
 [Steve Schoger](https://twitter.com/steveschoger), the excellent designer behind _Refactoring UI_, recently asked on Twitter:

 > Has anyone seen a good pattern for suuporting both "save and stay" and "save and done" when editing a multipgae form?

 In the image he attached, were three buttons: "Discard changes", "Save changes" and "Done editing".

If it were up to me, I'd do the saving automatically, without disturbing the user.  
I'd have two buttons. 
A primary button: _"Done editing"_ —  and a secondary button _"Discard changes"_ (and in smaller type: _Since last save_).
 
 I once had to make a product-card with a built-in _Image Gallery_-component. The UX'er wanted the whole card to be clickable **and** navigation-buttons for previous- and next image within. Obviously, this is doable, but a bad design-pattern.

 If you need a lot of JavaScript to change the default behaviour of your elements, it typically is a bad design-pattern, and you should challenge the designer / UX'er.

---

## Types and states
A `<button>` can have one of these "behavioural" types:

- submit (default)
- reset
- button

The first two are identical to `<input type="submit">` and `<input type="reset">`, which you shouldn't use anymore. Why? Because `<input>`-elements are self-closing and cannot have pseudo-elements `::after` and `::before`. A `<button>` on the other hand, can have inner HTML-content and thus also pseudo-content.

Like other form-elements, a `<button>` can also have a `name` and a `value`, that will be submitted as a pair.  
To be honest, I haven't had a usecase for this (yet!).

The _states_ of a button is similar to any form-element:

- Default
- Active
- Disabled
- Focus
- Hover

I'll look into styling the various states below.

---

## Markup
The basic markup for a `<button>` is simple:
```html
<button>My button</button>
```

But as you probably want to style it, and not having all your buttons submitting forms, add `type` and `class`.
_Example:_

```html
<button type="button" class="c-btn">My button</button>
```

### Design pattern: Button with an icon
```html
<button type="button" class="c-btn">
  <svg class="c-ico"><use xlink:href="icons.svg#icon-id"></use></svg>
  <span class="c-btn__text">My button</span>
</button>
```

To add space between the icon and text, use logical properties in CSS.  
_Example:_
```css
.c-ico + .c-btn__text {
  margin-inline-start: /* value */
}
```

To have an icon _after_ the text, switch the `<span>` and `<svg>`, and use `margin-inline-end` instead.

When using `<svg>`-icons in a `<button>`, I usually add `pointer-events:none` in the CSS for the icon, so it doesn't capture any pointer-events.

### Design pattern: Button with _only_ an icon
```html
<button type="button" class="c-btn" aria-label="Close">
  <svg class="c-ico"><use xlink:href="icons.svg#icon-close"></use></svg>
</button>
```

### Design pattern: Button with tooltip on :hover
```html
<button type="button" class="c-btn c-ttp__wrapper">
  Delete item?
  <span class="c-ttp">Be careful here</span>
</button>
```

### ARIA: state and roles
If the `<button>` is used to toggle something, add `aria-pressed` with either `true`, `false` or `mixed` as value.  
If the button controls something that is then expanded, also add the `aria-expanded` attribute.

The `role="button"`-attribute is not nessecary for a `<button>`-element.

MDN's documentation for ["ARIA: button role"](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role) explains why:
>  Where possible, it is recommended to use native HTML buttons rather than the button role, as native HTML buttons are supported by all user agents and assistive technology and provide keyboard and focus requirements by default, without need for additional customization.

---

## Styling
When starting to specify how many button-styles you need for a given website, the anser is probably: _lots!_

- Various sizes (small, medium, large etc.)
- Types: Primary, Secondary, Tertiary, Link
- With Icon
- With Tooltip

minimum viable experience

 (think "secondary buttons", "small buttons", "large buttons", "Next slide"-buttons, "Small clickable icon-buttons" etc.), I recommend putting all these possible combinations as CSS Custom Properties