# Menu Component

---
### Mobile Menu
Set style of mobile menu.  
Defaults to fixed, hide on scroll-down, reveal on scroll-up.

1. Bottom `(bottom)` *Docked to bottom. Always visible*
2. Top: Fixed `(fixed)` *Docked to top. Always visible*
3. Top: Fixed: Auto-hide `(empty) [default]` *Docked to top. Auto show/hide*
4. Float Right `(float)`
5. Float Center `(float center)`
6. Top: Static `(static)` *Top*

*Example:*
```html
<body
  data-menu-mobile="bottom">
</body>
```

---
### Mobile Menu Panel Width
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
<body
  data-menu-slide="top">
</body>
```

---
### Burger Icon
`data-burger`

### Drop-Down Arrows
`data-arrow`


---
### Menu Items
`data-menu-item="scale"`


`data-menu-order` 1-10

LINK:

```html

<a data-menu-item="root" data-menu-order="5" href="/URL">
  <i aria-hidden="true" data-icon="cart"></i>
  <span class="sr-only desktop-only mobile-only">Cart</span>
</a>


`data-circle-num`


Direction ? Down / Right

## Content Area
The types that can be added to the *Content Area* are:

- Link (w/wo icon/text)
- Panel
- Main Menu Wrapper
  - Link
  - Panel
    - Panel
    - Link