# Layout Block

1. Headline
	1. Tag Selector h1-h6
	2. Style Selector h1-h6
2. Description
3. Content Area
4. `Show All` Label
5. `Collapse All` Label

!!! TODO: Control description and headline widths individually from section inner width.
Set margin gaps and padding

c-sec-mb
c-sec-mb--medium
c-sec-mb--large
c-sec-mb--xlarge

OR CUSTOM: update var(--sec-mb);

## Text Below Content
Boolean

## Section Type [enum]  
Set attribute `data-section-type`.
1. Stack [default]
	- Set `data-section-type="stack"`
2. Slider
	- Set `data-section-type="slider"`
3. Expand
	- Set `data-section-type="stack"`
	- Set `data-expanded="false"`
4. Masonry
	- Set `data-section-type="masonry"`
---

## Item Type [enum]
Set attribute `data-item-type`
1. Default
2. Card

## Theme [enum]
A theme updates these five CSS Custom properties:
1. `--lay-bg` (background-color)
2. `--lay-c` (color)
3. `--lay-head-c` (headline color)
4. `--lay-scrbar-bg` (scrollbare background)
5. `--lay-scrbar-thumb-bg` (scrollbar thumb)

Default themes:

1. Theme 1 (default)
2. Theme 2: `.c-lay--theme01`
3. Theme 3: `.c-lay--theme02`
4. Theme 4: `.c-lay--theme03`
5. Theme 5: `.c-lay--theme04` 

_Example:_

```css
.c-lay--theme01 {
	--lay-bg: hsl(195,100%,30%);
	--lay-c: hsl(195, 100%, 100%);
	--lay-scrbar-bg: hsl(195, 100%, 35%);
	--lay-scrbar-thumb-bg: hsl(195, 100%, 90%);
}
@media (prefers-color-scheme: dark) {
	.c-lay--theme01 {
		--lay-bg:#2d3949;
		--lay-c: #FEFEFE;
	}
}
```


## Phone Layout [enum]  
Set attribute `data-layout`.
1. None [default, don't render attribute]
2. 100
	- Set `data-layout="100"`
3. 50:50
	- Set `data-layout="50:50"`

- Or **custom** [string], example:

`data-layout="my-custom-grid"`

---
## Tablet Layout [enum]  
Set attribute `data-layout-tablet`.
1. 100 [default]
2. 50:50
3. 25:75
4. 75:25
5. 33:33:33
6. 33:66
7. 66:33
8. 50:25:25
9. 25:50:25
10. 25:25:50
---
## Desktop Layout [enum]  
Set attribute `data-layout-desktop`.
1. 100
2. 50:50
3. 25:75
4. 75:25
5. 33:33:33
6. 33:66
7. 66:33
8. 50:25:25
9. 25:50:25
10. 25:25:50
---
## Section Inner Max-Width [enum or string]
Chose from a dropdown:

1. Small
2. Medium (default)
3. Large
4. Extra Large

 - or set manually [text field]:  
`value` must be a valid CSS unit or Custom Property.
The "inner max-width" of the section.

_Examples:_
```html 
<section
	style="--sec-inner-w:1200px;">
</section>
<section
	style="--sec-inner-w:var(--desktop-large);">
</section>
```
---
## Section Outer Max-Width
Chose from a dropdown, or set manually.  
`value` must be a valid CSS unit or Custom Property.
The "outer max-width" of the section, typically full-width.

_Examples:_
```html 
<section
	style="--sec-outer-w:1600px;">
</section>
<section
	style="--sec-outer-w:var(--desktop-xlarge);">
</section>
```
---
### Animation [enum]. Set attribute `data-animation`.
1. None [default, don't render attribute]
2. Fade-in from top [a-fade-in-top]
3. Fade-in from right [a-fade-in-right]
4. Fade-in from bottom [a-fade-in-bottom]
5. Fade-in from bottom left [a-fade-in-bl]
6. Fade-in from bottom right [a-fade-in-br]
7. Fade-in from left [a-fade-in-left]
8. Bounce-in from top [a-bounce-in-top]
9. Bounce-in from right [a-bounce-in-right]
10. Bounce-in from bottom [a-bounce-in-bottom]
11. Bounce-in from left [a-bounce-in-left]
12. Bounce-in from center [a-scale-up-center]
---
### Animation Target [enum]. Set `data-animation-target`.
1. Section [default, don't set attribute]
2. Items
	- Set `data-animation-target=".c-lay__item"`
3. Both
	- Set `data-animation-target="both"`
---
### Gap Between Items [enum]

---
## CSS Custom Properties
All these props must be set directly on the `style`-attribute of the section.

---
### Background-color
Chose from a ColorPicker or similar.  
`value` must be a valid CSS color or Custom Property.

_Examples:_
```html 
<section
	style="--sec-bg:#CCC;">
</section>
<section
	style="--sec-bg:var(--color-primary);">
</section>
```
---

## Expand Height
The height of a collapsed "expand section".  
Chose from a dropdown, or set manually.  
`value` must be a valid CSS unit or Custom Property.

_Examples:_
```html 
<section
	style="--sec-sec-expand-h:250px;">
</section>
<section
	style="--sec-expand-h:var(--expand-small);">
</section>
```

## Setting with JavaScript
All **CSS Custom Properties** can also be set with JavaScript, example:
```javascript
const height = 800;
section.style.setProperty('--sec-expand-h', `${height}px`);
```
---
## Margins and padding

---

## Booleans

### [x] Show preview of next- and previous item.  
This option sets `scroll-snap-align:center; ` and works best with an odd number of items.
- Set `data-align-center="true"`
---
### [x] Loop Slider
- Set `data-loop="true"`
