# Menu Component

The *Menu Component* is a configurable component with a *Content Area*, onto which you can drag three different items:

- Link (with optional image/icon)
- Panel (with optional image/icon)
- Main Menu 

The *Main Menu* is a toggler (typically the "burger"-icon) with a *Content Area* of it's own, containing  *Link-* or *Panel*-items.

A *Panel* can contain more *Panel*- or *Link*-items.

## Main Menu Toggler
Only **one** *Main Menu* is allowed on a *Menu Component*.

```html
<input type="checkbox" id="menu-toggle" hidden />
<label
  data-burger
  data-menu-item=""
  data-menu-order="1"
  for="menu-toggle">
  <i aria-hidden="true"></i>
</label>
<div
  data-menu-panel="root"
  data-menu-toggle>
  <!-- CONTENT AREA -->
</div>
````

---
## Mobile Menu
Sets style and options of the mobile menu.  

---
### Position / Type

Defaults to `Fixed: Auto-hide`: hide on scroll-down, reveal on scroll-up.

1. Bottom `(bottom)` *Docked to bottom. Always visible*
2. Top: Fixed `(fixed)` *Docked to top. Always visible*
3. Top: Fixed: Auto-hide `(empty) [default]` *Docked to top. Auto show/hide*
4. Float: Bottom Right `(float)`
5. Float: Bottom Center `(float center)`


*Example:*
```html
<body
  data-menu-mobile="bottom">
</body>
```

---
### Mobile Menu Panel Width
- 100% `(empty) [default]`

### Mobile Menu Panel Height
- 100% `(empty) [default]`

---
### Desktop Menu
Set style of desktop menu.  
Defaults to fixed, hide on scroll-down, reveal on scroll-up.

1. Top: Fixed `(fixed)`
2. Top: Fixed: Auto-hide `(empty) [default]`
3. Top: Static `(static)`

*Example:*
```html
<body
  data-menu-desktop="static">
</body>
```

---
### Slide Direction
Sets the direction, from which the mobile menu-panel slides in.  
On desktop, menu-panels always slide in from the top.

1. Slide From Top `(top)`
1. Slide From Right `(right)`
1. Slide From Bottom `(bottom)`
1. Slide From Left `(left)`

*Example:*
```html
<nav
  data-menu
  data-menu-slide="top">
</nav>
```

---
### Burger Icon
`data-burger`

### Drop-Down Arrows
`data-arrow`


---
## Menu Items

---
### **Option:** Overwriting Item Order

The order in which the menu-items appear in the *Content Area* will always be used on dektop-devices, but the order for the mobile menu can be manually overridden using the `data-menu-order`-attribute (`1-10`).

*Example:*

```html
<a
  data-menu-order="5"
  href="/home">
```

---
### **Option:** Adding a circle with a number
*Example:*

```html
<a
  data-circle-num="8"
  href="/home">
```

---
### **Option:** Scaling and circling an item
*Example:*

```html
<a
  data-menu-item="scale"
  href="/home">
```


---
### Menu Item: Link

```html
<a
  data-menu-item="root"
  data-menu-order="5"
  href="/URL">
  {{ICON}} / {{IMAGE}}
  <span data-show="d:sr">Cart</span>
</a>
```

---
#### Icon

```html
 <i
  aria-hidden="true"
  data-icon="{{ICON}}">
</i>
```

---
#### Image

```html
<img
  alt="{{ALT-TEXT}}"
  data-show="{{SHOW}}"
  loading="lazy"
  src="{{IMAGE-SRC}}"
/>
```

---
### Menu Item: Panel

**Model:**


1. Label
2. Label Show-Options (`data-show`)
3. Label Expand Icon:
    - None
    - Down arrow
    - Right arrow
    - Plus
4. Order on Mobile (only for panels DIRECTLY in root) NUMERIC SELECTOR
5. Slide Direction:
    - None
    - Top
    - Right
    - Bottom
    - Left
6. Height
7. Width
8. Open

9. Circle Number (empty / numeric selector)

10. Icon / Image (+ data-show)
11. Content Area (accepts Panel, Item)

```html
<details
  data-menu-order="{{ORDER}}"
  {{OPEN}}>

  <summary
    data-circle-num="{{CIRCLENUM}}"  
    data-menu-item>
    <!-- ICON / IMAGE -->
    <span
      data-exp-icon="{{EXPAND-ICON}}"
      data-show="{{LABEL-SHOW-OPTIONS}}">
      {{LABEL}}
    </span>
  </summary>

  <div
    data-menu-panel
    data-menu-panel-height="{{PANEL-HEIGHT}}"
    data-menu-panel-slide="{{PANEL-SLIDE-DIRECTION}}"
    data-menu-panel-width="{{PANEL-WIDTH}}">
    ... CONTENT AREA...
  </div>
</details>
```

---
## Show / Hide

The `data-show`-attribute can be used on all items to control what's visible for specific breakpoints.

- Hidden (`s-d:n`)
- Screen Reader Only (`d:sr`)

---

- Block (`s-d:b`)
- Flex (`s-d:f`)
- Inline (`s-d:il`)
- Inline Block (`s-d:ib`)
- Inline Flex (`s-d:if`)

---


## Content Area
The types that can be added to the *Content Area* are:

- Link (w/wo icon/text)
- Panel
- Main Menu Wrapper
  - Link
  - Panel
    - Panel
    - Link