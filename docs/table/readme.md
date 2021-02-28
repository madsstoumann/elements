# Table

## Options
sticky-header
sticky-first
resizable
rounded

col style
- lines
- zebra

row style:
- lines
- separate
- zebra

density
pagination

row :focus :hover :focus-inside td
edit
sortable
search / filter




webfont-smoothing


Segoe UI

SCSS variables and CSS Custom Props are NOT similar.
Where the first will be replaced upon build with STATIC values, CSS Custom Props are DYNAMIC and thus easy to update AND easy to read/write from JavaScript.
If used correctly, they will greatly reduce the amount of CSS - SCSS or not.

Example:
https://stoumann.dk/

A single custom prop is updated, when you drag the colorful slider. 
From this single prop, all the colors are calculated - but only in CSS.

Now, click on the icon with colored sqaures.
This overlay contains calculated colors, again based on that single prop, using hsl() and calc().

If you use a keyboard, links in the overlays will automatically be the exact OPPOSITE of the current background-color, which will guarentee accessibility.
Again, this color is auto-calculated.

All this logic would previously require tons of JavaScript and CSS, now it's down to 1kb of JS for the entire site.

Other examples:

Image Compare with a single line of JavaScript / One single CSS prop:
https://codepen.io/stoumann/pen/VwKgJNv

Table Designer with CSS props for color, column-border-widths etc.:
https://codepen.io/stoumann/full/YzpVYWZ

So! If you're not going to support IE, I'm all for CSS Custom Properties.
For me, they have greatly reduced the amount of CSS outputted, because I can just update props instead of (re-)writing CSS / add modifier-classes that rerepat attributes.