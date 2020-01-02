# `<a>` Hyperlink to Another World

The `<a>`-element is the most important of all the elements: it's the reason why the Internet exists.  
Without it, we wouldn't be able to click on links to videos of cats playing the piano — or people falling!

---

## User experience

The default browser behaviour for the `<a>`-element is identical to the accessibility-entry for links in the [US Web Design Standards](https://designsystem.digital.gov/components/typography/#links):

- Users should be able to tab to navigate between links.
- Users should be able to activate a link when pressing ‘Enter’ on their keyboard.
- Users should be able to identify links without relying on color alone.
- Users should be able to activate hover and focus states with both a mouse and a keyboard.

If the links on a website _do not_ behave like this, it's because someone decided to change the default behaviour. That's normally a good idea (otherwise, the Web would be full of pages set in _Times New Roman_) — but if you _do_ change the defaults, make sure everything is still accessible.

---
## The `href` attribute
It's valid to have an `<a>`-element _without_ the `href`-attribute ("hypertext reference"):

> If the `a` element has no `href` attribute, then the element represents a placeholder for where a link might otherwise have been placed, if it had been relevant.

That could work for design patterns such as _Toggle Tips_ (and in some cases _Tool Tips_), which are often _styled_ like links, but do not actually link anywhere. Without the `href`-attribute, keyboard-tab-focus is lost, and need to be re-applied with `tabindex`:

```html
<a aria-describedby="tt1" tabindex="0">
  I have a tooltip
  <span id="tt1" role="tooltip">I'm the tip</span>
</a>
```

In most cases though, it doesn't make any sense to remove the "link" from a "hyperlink".  
If you have an `<a>`-element similar to this:

```html
<a href="javascript:void(0)">Sign in</a>
```
— or using `event.preventDefault()` to prevent the default behaviour of `<a>`, then **you're using the wrong element!** Maybe you're looking for the `<button>`-element?

The `href`-attribute is a string with a valid URL scheme, typically:

- A relative link to a page on the same site: 
```html
<a href="/products">
```
- A link to an identifier on the same page: 
```html
<a href="#cool-article">
```
- A link to an external page: 
```html
<a href="https://google.com">
```
- A link to an email: 
```html
<a href="mailto:user@domain.com">
```
- A link to a phone number: 
```html
<a href="tel:+1(555)23456">
```

But that's just the [tip of the iceberg](https://en.wikipedia.org/wiki/List_of_URI_schemes).  
While all URL schemes might not be supported by all browsers, web sites can [add support](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler) using `registerProtocolhandler()`.

_Other examples;_

- SMS links
```html
<a href="sms:+1(555)23456">
<a href="sms:?&body=/* message body here */"> 
 ```

- Skype link
```html
<a href="skype:USERNAME?call"> 
```

---

## The `ping` attribute
Websites can use the `ping`-attribute to track clicks on hyperlinks.
You provide a space-separated list of URI's:

```html
<a ping="/relativeuri https://not-so-relative-uri.com">
```

Each URI will recieve a POST with the request payload 'PING'.

Google use this feature on their search-result-page.  
Here's an example if you search for "ping attribute":

```html
<a href="https://www.w3schools.com/tags/att_a_ping.asp" ping="/url?sa=t&amp;source=web&amp;rct=j&amp;url=https://www.w3schools.com/tags/att_a_ping.asp&amp;ved=2ahUKEwixrcD5g93mAhUqy8QBHRrVAN0QFjACegQIBBAB">...</a>
```

As a user, you will only see the content of the `href`-attribute when you hover the link. You will _not see_ the list of URI's in the `ping`-attribute, that will be POST'ed if you follow the link.

This is against the official recommendation:

> When the `ping` attribute is present, user agents should clearly indicate to the user that following the hyperlink will also cause secondary requests to be sent in the background, possibly including listing the actual target URLs.

Currently, Firefox is the only browser that disables the `ping`-attribute by default.  
It's [not possible](https://lapcatsoftware.com/articles/Safari-link-tracking.html) to disable it in Safari. 

And in Chrome, the setting:

```html
chrome://flags#disable-hyperlink-auditing
```

— has been removed. Even if you enable "Do Not Track*)", the `ping` URI's are still POST'ed.

In these days of GDPR, it's surprising to see a tracking-mechanism that cannot be disabled or bypassed by the user. In Firefox, Google Search falls back to a JavaScript event handler, so you still need to know how to turn off JavaScript, in order not to be tracked!

### *) Do Not Track
"Do Not Track" (DNT) was a proposed HTTP header field, designed to allow internet users to opt-out of tracking by a website. It's still a setting (typically hidden away under "Advanced") in most browsers, but — alas — it doesn't have any effect, and DNT has been cancelled, which is a pity. 

---

## The `rel` attribute
The `rel` ("relationship") attribute defines the _type_ of the link.  
That's a bit confusing, as there's also a lesser known `type`-attribute, but that's for [Media Types](http://www.iana.org/assignments/media-types/media-types.xhtml) (formerly known as MIME-types).

There are [a lot of](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types) `rel`-types, but I'll only cover those which makes sense to use from either a security- or SEO-perspective:

- `alternate`. The link points to an alternate version of the same page. Maybe in a different language, which can then be specified using the `hreflang`-attribute.
- `next` and `prev`. The link points to either the `next` or the `previous` page in a series (could be a search-result spanning multiple pages, or a series of articles).
- `nofollow`. The link is not approved or endorsed by the author / owner of the current page.  
This has, historically, been used for paid/sponsored links and for user-generated content — but Google wants to split it up into three `rel`-types:

> The `rel="nofollow"` is for cases where you want to link to a page but don’t want to imply any type of endorsement, including passing along ranking credit to another page.

> The `rel="sponsored"` is for paid and sponsored links.

> The `rel="ugc"` is for user-generated content.

- `noopener`. Prevents the target link from using `window.opener` and thus have access to the referring document.*)
- `noreferrer`. Prevents the browser from sending information about the current page to the target.*)

*) See further details in the `target`-attribute section.

---

## The `target` attribute
If you've used the `target`-attribute before, it has — with 99% probability — been:
```html
<a target="_blank">
 ```
This will open the link in a new tab or browser window.  
But! Using the `target`-attribute is a _change in the default behaviour_, as explained [in this article](https://css-tricks.com/use-target_blank/) by Chris Coyier.  
Furthermore, there are [phishing security issues](https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/) you need to be aware of.

Basically, the site/page you're linking **to** will have full `script`-access to the page it was linked **from** using `window.opener`.

To avoid this, you need to add:

```html
<a target="_blank" rel="noopener noreferrer">
 ```

 — to all external links using `target="_blank"`.  
 Mathias Bynens have created a [rel-noopener](https://mathiasbynens.github.io/rel-noopener/)-page to demonstrate the issue.

Other allowed values for the `target`-attribute are:
- framename (of an `iframe`)
- _parent
- _self
- _top

You'll never need those for the `<a>`-element, it's a relic from the `<iframe>`-days ... but, if you're using iframes, they're still perfectly valid!
The [Browsing context names](https://html.spec.whatwg.org/multipage/browsers.html#valid-browsing-context-name-or-keyword) explains it further.

**Conclusion:** Avoid using `target` if possible — all browsers have easy ways of opening links in a new browser window or tab — thus giving _the user_ full control.

---

## The `download`-attribute
If a link points to a downloadable asset, use the `download`-attribute.  
This tells the browser to stay on the current page and download the asset, if clicked.

```html
<a href="some-file-name.txt" download>
```

If used with a value, you can even use it to force a different filename:

```html
<a href="some-file-name.txt" download="file.txt">
```

If you care about SEO, add some more information about the asset, using the [DataDownload](http://schema.org/DataDownload) schema:

```html
<a href="some-file-name.txt"
  itemscope itemtype="http://schema.org/DataDownload" download="file.txt">
  <meta itemprop="description" content="Important information about the file">
  <meta itemprop="contentSize" content="2KB">
  <meta itemprop="inLanguage" content="English">
  <meta itemprop="uploadDate" content="2020-01-01">
  Download file
</a>
```
---
## JavaScript: `HTMLAnchorElement`
The DOM-interface for the `<a>`-element is `HTMLAnchorElement`.  
It inherits the properties from `HTMLElement` and `HTMLHyperlinkElementUtils`.

The latter are identical to those of `window.location`, establishing the connection between `<a>` and URI:

- hash
- host
- hostname
- origin
- password
- pathname
- port
- protocol
- search
- username

As I mentioned earlier, you should never use `event.preventDefault()` — but there are a few exceptions.

Let's say you have a single-page app with an array called `products`. The link for navigating to the next page is:

```html
<a href="/products?superhero=superman&realname=clark%20kent&page=2">Page 2</a>
```

If you want to prevent a page reload and filter the existing `products`-array, use `preventDefault()` and then e.g. the `URLSearchParams` API to extract search parameters:

```js
/* `event` inherited from handler */
event.preventDefault();
const element = event.target;
/* `element.pathname` could also be useful here */
const params = new URLSearchParams(element.search);
for (const [key, value] of params.entries()) {
  /* Iterate params, filter `products` */
}
```

If JavaScript is disabled or fails, the fallback is a regular link.

---

## Styling links

In addition to it's default style/state, a link has three pseudo-selectors/states in CSS:

- `:active`
- `:focus`
- `:visited`

It's valid to use the `disabled`-attribute, but styling it with `:disabled` has no effect (maybe becuase a disabled link is not ... a link?).

To cater for most of the various possibilities there is to style a link, create a `.class`, where all the values of the properties are variables (aka CSS Custom Properties). This way, it's very easy to create alternate versions by just updating a group of variables:

```css
.c-lnk {
  --lnk-bdc: none;
  --lnk-bdrs: 0;
  --lnk-bds: none;
  --lnk-bdw: 0;
  --lnk-bgc: transparent;
  --lnk-bxsh: transparent;
  /* ... etc. */

  background-color: var(--lnk-bgc);
  border-color: var(--lnk-bdc);
  border-radius: var(--lnk-bdrs);
  border-style: var(--lnk-bds);
  border-width: var(--lnk-bdw);
  box-shadow: var(--lnk-bxsh--sz) var(--lnk-bxsh);
  color: var(--lnk-c);
  cursor: var(--lnk-cur);
  /* ... etc. */
}
```

A lot of the variables defaults to `inherit` or `transparent`, but it gives you the option to change it along the way, as well as an easy way to create other versions, by simply changing variables.

Here's an "error link" with red text and a wavy red underline:

```css
.c-lnk--err {
  --lnk-c: var(--c-red-700);
  --lnk-tdc: var(--c-red-700);
  --lnk-tds: wavy;
}
```

Or "Dark Mode":

```css
@media (prefers-color-scheme: dark) {
  .c-lnk {
    /* Excerpt ... */
    --lnk-c: var(--c-link--dark);
    --lnk-c--hov: var(--c-txt);
    --lnk-c--vis: var(--c-link-vis--dark);
  }
}
```

Full example can be found at [elements.stoumann.dk/link](https://elements.stoumann.dk/link).  
Try out `:hover`, keyboard-navigation for `:focus`, `:active` and `:visited`.

> To preview "Dark Mode" without actually having "Dark Mode" on your device, go to the "Rendering"-drawer (in Chrome) and select `prefers-color-scheme: dark` under "Emulate CSS media feature".

---

## Styling fragments and `:target`
Closely related to styling links, is `:target`.  
The `:target`-pseudo-selector, allows you to style the element referenced in the `#fragment` of the URL.

_Example:_
```html
<article id="my-article" class="c-art">
```
```css
/* url: yoursite.com#my-article */
.c-art:target { background-color: lightgoldenrodyellow; }
```

### Text Fragment Anchors
There's a [new proposal](https://wicg.github.io/ScrollToTextFragment/) out, closely related to `:target`.  
By using a `~text`-section in a `#fragment`, it allows you to highlight a specific text-selection on a page.

To enable support for _Text Fragment Anchors_ in Chrome, enable:
```html
chrome://flags/#enable-text-fragment-anchor
```

Then navigate to: [https://en.wikipedia.org/wiki/History_of_computing#:~:text=The%20first%20recorded,Williams](https://en.wikipedia.org/wiki/History_of_computing#:~:text=The%20first%20recorded,Williams)

The browser will scroll to the specified selection and highlight it.

Currently, there's no way to style the highlighted text in CSS (Chrome uses the same formating as for the `<mark>`-element), but I assume we'll see a `:target-text` or something similar in CSS in the near future.

---

**Geeky, final note:** In Tim Berners-Lee's original _WorldWideWeb_-browser, links were [bidirectional](https://en.wikipedia.org/wiki/Hyperlink):

> In some hypertext, hyperlinks can be bidirectional: they can be followed in two directions, so both ends act as anchors and as targets. 

You had to double-click on links, because single-clicks were for editing pages (yes, pages could be edited by anyone).

A replica (built in React) of the original browser can be [found here](https://worldwideweb.cern.ch/browser/).
