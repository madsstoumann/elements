# Need some `<input>`?

Form field structure

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset
https://github.com/w3c/csswg-drafts/issues/3072

fieldset:invalid {
  background-color: red;
}
fieldset:valid {
  background-color: green;
}

![No CSS](assets/input_noCSS.png)

```html
<fieldset>
  <header>
    <label>
    <hint-text>
  </header>
  <field-wrapper>
    <pre-fix>
      <span>
      <select>
      <button>
    </pre-fix>
    <icon-leading>
    <input>
    <icon-trailing>
    <suf-fix>
      <span>
      <select>
      <button>
    </suf-fix>
  </field-wrapper>
  <footer>
    <error-label>
    <text-counter>
  </footer>
</fieldset>
```