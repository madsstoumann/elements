# Menu Component

---
### Mobile Menu
Set style of mobile menu.  
Defaults to fixed, hide on scroll-down, reveal on scroll-up.

1. Bottom `(bottom)` *Docked to bottom. Always visible*
2. Top: Fixed `(fixed)` *Docked to top. Always visible*
3. Top: Reveal `(empty) [default]` *Docked to top. Auto show/hide*
4. Top: Static `(static)` *Top*

*Example:*
```html
<body
  data-menu-mobile="bottom">
</body>
```

---
### Desktop Menu
Set style of desktop menu.  
Defaults to fixed, hide on scroll-down, reveal on scroll-up.

1. Top: Fixed `(fixed)`
2. Top: Reveal `(empty) [default]`
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

Direction ? Down / Right