# Layout Block

**Note:** 
If value shown and value to be set differs, the value to be set will be shown in parentheses.  
Default values are shown with square brackets: `[default]`.

If value is an empty string, it will be: `[empty]`. In this case, the attribute should not be rendered at all.

---
## CMS Implementation

### Content Base Model
1. Headline (string)
2. Description (rich text)
3. Content Area
4. Expand All (short string)
5. Collapse All (short string)

The *Layout Block* has more than 30 configuration-options, divided into six areas / tabs:

1. Section
2. Layout
3. Spacing & Gaps
4. Header
5. Navigation & Animations
6. Items

All options, except *Header Below Content* are `enum` (drop-downs).

---
## Section: Settings
---
### Section Type
1. grid-gallery
2. masonry
3. slider
5. stack `[default]`

*Example:*
```html
<section class="c-lay"
  data-section-type="stack">
```
---
### Section Snap
If `true`, the section will snap when scrolling vertically.
1. false `[empty][default]`
2. true

*Example:*
```html
<section class="c-lay"
  data-snap="true">
```
---
### Inner max-width
This will set the width of the scrollable, inner content area. 

1. x-small (`xs`)
2. small (`s`)
3. medium `[empty][default]`
4. large (`l`)
5. x-large (`xl`)

*Example:*
```html
<section class="c-lay"
  data-inner-maw="s">
```
---
### Outer max-width
This will set the width of the scrollable, inner content area. 

1. x-small (`xs`)
2. small (`s`)
3. medium `[empty][default]`
4. large (`l`)
5. x-large (`xl`)

*Example:**
```html
<section class="c-lay"
  data-outer-maw="s">
```
---
### Expanded
By default, a section will be expanded. Using this setting with *Collapsed Height*, will add functionality to toggle the visible height.

1. true `[default]`
2. false

*Example:*
```html
<section class="c-lay"
  data-expanded="true">
```
---
### Collapsed Height
By default, a section will full height. Using this setting with *Expanded*, will add functionality to toggle the visible height.

1. full `[default]`
2. small
3. medium
4. large

*Example:**
```html
<section class="c-lay"
  data-collapsed-height="full">
```

---
## Layout: Settings
---
### Theme
1. default `[empty][default]`
2. theme 1 (theme01)
3. theme 2 (theme02)
4. theme 3 (theme03)
5. theme 4 (theme04)

*Example:*
```html
<section class="c-lay"
  data-theme="theme02">
```
---
### Phone Grid
Grid to use on smaller devices.

1. 100 `[default]`
2. 50:50
3. hidden

*Example:*
```html
<section class="c-lay"
  data-grid-phone="50:50">
```
---
### Tablet Grid
Grid to use on medium-sized devices.

1. 100
2. 50:50
3. 25:75
4. 75:25
5. 33:33:33 `[default]`
6. 33:66
7. 66:33
8. 50:25:25
9. 25:50:25
10. 25:25:50
11. 25:25:25:25
12. hidden

*Example:*
```html
<section class="c-lay"
  data-grid-tablet="33:33:33">
```
---
### Tablet Desktop
Grid to use on larger devices.

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
11. 25:25:25:25 `[default]`
12. hidden

*Example:*
```html
<section class="c-lay"
  data-grid-desktop="25:25:25:25">
```
---
### Diagonal Layout
1. none `[empty][default]`
2. small
3. small, content only (`small header`)
4. small, wrapper only (`small content header`)
5. small reverse
6. small reverse, content only (`small header reverse`)
7. small reverse, wrapper only (`small content header reverse`)
8. medium
9. medium, content only (`medium header`)
10. medium, wrapper only (`medium content header`)
11. medium reverse
12. medium reverse, content only (`medium header reverse`)
13. medium reverse, wrapper only (`medium content header reverse`)

*Example:*
```html
<section class="c-lay"
  data-diagonal="small header">
```
---
### Toggle Layout
Adds functionalty to toggle between `stack` and `slider`-types. Labels for *Show all* and *Collapse All* should be defined elsewhere.

1. false `[default]`
2. true

*Example:*
```html
<section class="c-lay"
  data-toggle-layout="false">
```

---
## Spacing & Gaps: Settings
---
### Margin Bottom
This will add margin to the bottom of the section.  
1. none `[empty][default]`
2. 1x
3. 2x
4. 3x
5. 4x

*Example:*
```html
<section class="c-lay"
  data-mb="1x">
```
---
### Margin Top
This will add margin to the top of the section.  
1. none `[empty][default]`
2. 1x
3. 2x
4. 3x
5. 4x

*Example:*
```html
<section class="c-lay"
  data-mt="1x">
```
---
### Padding Bottom
This will add padding to the bottom of the section.  
It's a CSS modifier-class, that will be added to the main `class`-attribute.
1. none `[empty][default]`
2. 1x
3. 2x
4. 3x
5. 4x

*Example:*
```html
<section class="c-lay"
  data-pb="1x">
```
---
### Padding Top
This will add padding to the top of the section. 
1. none `[empty][default]`
2. 1x
3. 2x
4. 3x
5. 4x

*Example:*
```html
<section class="c-lay"
  data-pt="1x">
```
---
### Inner Padding Bottom
This will add padding to the bottom of the inner content area.  
1. none (`0x`)
2. 1x `[empty][default]`
3. 2x (`2x`)
4. 3x (`3x`)
5. 4x (`4x`)

*Example:*
```html
<section class="c-lay"
  data-inner-pb="1x">
```
---
### Phone: Remove Gaps Between
Remove gaps between grid-items, edges, cols or rows on smaller devices.

1. default `[empty][default]`
2. column
3. column edge
4. edge
5. column row
6. column edge row
7. grid
8. grid edge
9. grid, smaller gap (`small`)						
10. grid, smaller gap, edges (`edge smal`)						
11. row
12. row edge

*Example:*
```html
<section class="c-lay"
  data-gap-phone="column edge">
```
---
### Tablet: Remove Gaps Between
Remove gaps between grid-items, edges, cols or rows on medium sized devices.

1. default `[empty][default]`
2. column
3. column edge
4. edge
5. column row
6. column edge row
7. grid
8. grid edge
9. grid, smaller gap (`small`)						
10. grid, smaller gap, edges (`edge smal`)						
11. row
12. row edge

*Example:*
```html
<section class="c-lay"
  data-gap-tablet="column edge">
```
---
### Desktop: Remove Gaps Between
Remove gaps between grid-items, edges, cols or rows on larger devices.

1. default `[empty][default]`
2. column
3. column edge
4. edge
5. column row
6. column edge row
7. grid
8. grid edge
9. grid, smaller gap (`small`)						
10. grid, smaller gap, edges (`edge smal`)						
11. row
12. row edge

*Example:*
```html
<section class="c-lay"
  data-gap-desktop="column edge">
```

---
## Header: Settings
---
### Header Align
Align text in `header`-area.
1. center `[empty][default]`
2. left
3. right

*Example:*
```html
<section class="c-lay"
  data-align-header="left">
```
---
### Headline Tag
Set main tag of headline. Also, add functionality to replace pipe-char, | , in headline with `&shy;`.  
Double pipe-chars, || , should output a regular pipe-char.

1. h1 `[default]`
2. h2
3. h3
4. h4
5. h5
6. h6

*Example:*
```html
<section class="c-lay">
  <header class="c-lay__header">
    <h1 class="c-lay__headline">Text</h1>
  </header>
</section>
```
---
### Headline Style
Set main style of headline.

1. h1 `(g-typ--h1)[default]`
2. h2 `(g-typ--h2)`
3. h3 `(g-typ--h3)`
4. h4 `(g-typ--h4)`
5. h5 `(g-typ--h5)`
6. h6 `(g-typ--h6)`

*Example:*
```html
<section class="c-lay">
  <header class="c-lay__header">
    <h1 class="c-lay__headline g-typ--h1">Text</h1>
  </header>
</section>
```
---
### Headline Width
Sets the width of the headline.  

1. small (`s`)
2. medium (`m`)
3. large `[empty][default]`

*Example:*
```html
<section class="c-lay"
  data-headline-w="m">
```
---
### Description Width
Sets the width of the description-text.  
1. small (`s`)
2. meidum (`m`)
3. large `[empty][default]`

*Example:*
```html
<section class="c-lay"
  data-desc-w="s">
```
---
### Header Below Content
Checkbox. If checked, the `<header>`-tag should be rendered *after* the `<div data-outer>`-tag.

---
## Navigation & Animations: Settings
---
### Slider Navigation
If section-type is set to *slider*, this will control how and if arrows, dots and navigation arrows are shown.

1. all (`arrows dots scroll`)
2. arrows only (`arrows`)
3. arrows, scrollbar (`arrows scroll`) `[default]`
4. arrows, dots (`arrows dots`)
5. arrows, dots inside (`arrows dots inside`)
6. dots only (`dots`)
7. dots inside only (`dots inside`)
8. scrollbar only (`scroll`)

*Example:*
```html
<section class="c-lay"
  data-nav="arrows scroll">
```
---
### Auto-Play Slides
If section-type is set to *slider*, this will control if slides should *auto-play*, as well as the time between each slide.

1. don't autoplay `[empty][default]`
2. every 3 seconds (`3000`)
3. every 5 seconds (`5000`)
4. every 8 seconds (`8000`)


*Example:*
```html
<section class="c-lay"
  data-auto-play="3000">
```
---
### Animation
Triggers an animation when the section is intersecting (partly visible).

1. none`[empty][default]`
2. bounce-in-bottom (`a-bounce-in-bottom`)
3. bounce-in-left (`a-bounce-in-left`)
4. bounce-in-right (`a-bounce-in-right`)
5. bounce-in-top (`a-bounce-in-top`)
6. fade-in-bottom-left (`a-fade-in-bl`)
7. fade-in-bottom-right (`a-fade-in-br`)
8. fade-in-bottom (`a-fade-in-bottom`)
9. fade-in-left (`a-fade-in-left`)
10. fade-in-right (`a-fade-in-right`)
11. fade-in-top (`a-fade-in-top`)
12. scale-in-bottom (`a-scale-in-bottom`)
13. scale-in-center (`a-scale-in-center`)
14. slide-in-blurred-bottom (`a-slide-in-blurred-bottom`)
15. slide-in-blurred-top (`a-slide-in-blurred-top`)

*Example:*
```html
<section class="c-lay"
  data-animation="a-fade-in-bottom">
```
---
### Animation Target
By default, the selected animation targets the section.  
It can also be set to target *items* or *both*.

1. section`[empty][default]`
2. items (`.c-lay__item`)
3. both

*Example:*
```html
<section class="c-lay"
  data-animation-target=".c-lay__item">
```

---
## Items: Settings
---
### Align Items
Items are styled with *flexbox*, and will by default stretch to the height of the tallest item.

1. center
2. end
3. start
5. stretch `[default]`

*Example:*
```html
<section class="c-lay"
  data-align="stretch">
```
---
### Show Preview
If section-type is set to *slider*, this will control if a preview of the next item should be visible.  
If set to *both*, a preview of the previous item will be shown as well, as the user scrolls.

1. none `[empty][default]`
2. next item (`next`)
3. next item, phone only (`next-phone`)
4. previous and next item (`both`)
5. previous and next item, phone only (`both-phone`)

*Example:*
```html
<section class="c-lay"
  data-preview="next">
```
---
### Item Type
This is a JavaScript-hook for targeting items.  
The `page`-type will, with the current implementation, add JavaScript-functionality to open an item as a modal popup on `click`.

1. default `[empty][default]`
2. page

*Example:*
```html
<section class="c-lay"
  data-item-type="page">
```

---
## Basic/Minimum Markup
---

```html
<!--
  Values in [SQUARE BRACKETS] are from Base Model
  Values in {{double curly brackets}} indicate Modifiers/Settings
-->
<section class="c-lay"
  data-align="{{stretch}}"	
  data-grid-phone="{{100}}"
  data-grid-tablet="{{33:33:33}}"
  data-grid-desktop="{{25:25:25:25}}"
  data-section-type="{{stack}}">

<!--
  `<header>` should only be rendered, 
  if either [HEADLINE] or [DESCRIPTION] is not EMPTY
-->

  <header class="c-lay__header">
    <h2 class="c-lay__headline {{g-typ--h1}}">[HEADLINE]</h2>

  <!-- if `data-toggle-layout="false"` or NULL/EMPTY -->
    <div class="c-lay__description g-typ--m">[DESCRIPTION]</div>
  <!-- end if -->

  <!-- if `data-toggle-layout="true"`-->
    <div
      data-layout-expanded="[COLLAPSE-ALL]"
      data-layout-collapsed="[EXPAND-ALL]">[EXPAND-ALL]
    </div>
  <!-- end if -->
  </header>

  <div class="c-lay__outer" data-outer>
    <div class="c-lay__inner" data-inner>
      <!-- Content Area. Each item should be wrapped in: -->
      <div class="c-lay__item"> ... item ... </div>
      <!-- End Content Area -->
    </div>
  </div>

  <!-- Render `<header>` HERE instead, if `Header Below Content` is true -->

  <!-- if `data-expanded="false"` -->
  <button type="button" data-toggle-expanded="[COLLAPSE-ALL]" data-toggle-collapsed="[EXPAND-ALL]">
    <span class="c-lay__nav-btn">
      <i></i>
    </span>
    <span class="c-lay__nav-txt" data-toggle-label>[EXPAND-ALL]</span>
  </button>
  <!-- end if -->

</section>
```

---
## All Options
---

```html

<section class="c-lay"
  data-align=""
  data-align-header=""
  data-animation=""
  data-animation-target=""
  data-auto-play=""
  data-collapsed-height=""
  data-desc-w=""
  data-diagonal=""
  data-expanded=""
  data-gap-phone=""
  data-gap-tablet=""
  data-gap-desktop=""
  data-grid-phone=""
  data-grid-tablet=""
  data-grid-desktop=""
  data-headline-w=""
  data-inner-maw=""
  data-inner-pb=""
  data-item-type=""
  data-mb=""
  data-mt=""
  data-nav=""
  data-outer-maw=""
  data-pb=""
  data-preview=""
  data-pt=""
  data-section-type=""
  data-snap=""
  data-theme=""
  data-toggle-layout="">

  <header class="c-lay__header">
    <{{Headline Tag}} class="c-lay__headline {{Headline Style}}">[HEADLINE]</{{Headline Tag}}>
    ...
  </header>


</section>
```