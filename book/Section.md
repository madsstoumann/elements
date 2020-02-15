# Section Slider



## Settings

---

Settings can either be defined as an object, or parsed as `element.dataset`. 

When a `dataset` is used, all non-string values have to be prefixed with a colon:

```html
<section class="c-snp"
  data-align="center"
  data-items-per-page=":3"
  data-js="slider"
```

Also note, that the settings-object is in `camelCase`, whereas a data-set is in `kebab-case`, so

```js
clsBtnNext
```

Should be:

```html
data-cls-btn-next
```

| Setting          | Description                             |
| :--------------- | :-------------------------------------- |
| align            | Empty, or `center`                      |
| breakpoints      | Array of breakpoints and items per page |
| clsBtnNext       | Class for `next`-button                 |
| clsBtnPrev       | Class for `prev`-button                 |
| clsDot           | Class for `navigation`-dot              |
| clsDotCur        | Class for current `navigation`-dot      |
| clsDotWrap       | Class for `navigation`-dot-wrapper      |
| clsItemLeft      | Class added to previous item            |
| clsItemRight     | Class added to next item                |
| clsNav           | Class for navigation                    |
| clsNavInner      | Class for inner navigation              |
| clsOverflow      | Class added by JS to hide overflow      |
| itemsPerPage     | Numeric value: 1, 2, 3, 4, 5 or 6       |
| lblItemRole      | aria-role for item                      |
| lblNext          | aria-label for `next`-button            |
| lblPrev          | aria-label for `prev`-button            |
| lblRole          | aria-role for main section              |
| loop             | Makes navigation-buttons `continuous`   |
| scrollBehavior   | Empry, or `smooth`                      |