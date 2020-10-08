# Page Structure

## Settings/Model
- “Page Title” (use for `<title>`)
- Add hidden “Page Title”. If the page does NOT have an `<h1>`, enable this for SEO and A11Y-outline
- “Skip Link” Text
- “Back to Top” Text
- Show “Back to Top”
- Show “Scroll Line”


```html
<body>
  <a href="#main" data-skip-link>
	  <span>Go to main content</span>
  </a>

  <header>MAIN NAVIGATION</header>

  <main class="c-lay__wrapper" id="main">
    <!-- if (addHiddenPageTitle) { -->
	  <h1 class="sr-only">Layout Block Demo</h1>
    <!-- } -->

	  <!-- TOP BANNER CONTENT AREA -->
    
    <!-- if (showScrollLine) { -->
    <div data-scroll-line></div>
    <!-- } -->

    <!-- CONTENT AREA: SECTIONS -->

    <!-- if (showBackToTop) { -->
    <a data-back-to-top href="#main">Back to top</a>
    <!-- } -->
  </main>

  <footer>
    BREADCRUMBS
    SITEMAP
    LEGAL
  </footer>

</body>
```