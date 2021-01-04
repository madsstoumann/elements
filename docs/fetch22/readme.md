# fetch2
Wrapper for fetch with timeout, custom error-, spinner-, and parser-callbacks.  
Use: `fetch2(url, options)`

## Options object

| Setting             | Possible values (*default)                 |
| :------------------ | ----------------------------: |
| body (1)            | blank (use with `FormData`)
| cache               | *default, no-cache, no-store, reload, force-cache, only-if-cached 
| credentials         | include, *same-origin, omit
| errorHandler        | Custom error-function
| header(2)           | blank
| integrity(3)        | blank
| isHistoryNavigation | false
| isReloadNavigation  | false
| keepalive           | false
| method              | *GET, POST, PUT, DELETE, PATCH
| mode                | no-cors, cors, *same-origin
| parser              | Custom parser-function (response)
| redirect            | manual, *follow, error
| referrer            | no-referrer, *client
| referrerPolicy      | *no-referrer-when-downgrade, no-referrer, origin", origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
| spinner             | Custom spinner-function (boolean)
| timeout(4)          | *9999

(1) Data type must match "Content-Type" header  
(2) { "Content-Type": "application/json" } etc.  
(3) Example: 'sha256-abd'  
(4) Timeout in milliseconds

## Error callback
If an error occurs, it is normally sent to the built-in method `logError`.  
You can specify a custom `error`-method in the `options`-object.

## Parser callback
By default, a `response` is parsed through the `setResponse`-method, that will return `json` or `text`.  
You can specify a custom `parser`-method in the `options`-object.

## Spinner callback
A dummy _spinner_-method is triggered _before_ a fetch and when it's completed.  
You can specify a custom `spinner`-method in the `options`-object (must recieve a boolean as it's single parameter).

## Examples
_See `index.html` for more_

```js
import fetch2 from './fetch2.mjs';

(async () => {
  const data = await fetch2('https://jsonplaceholder.typicode.com/albums/?_limit=10&q=lorem', {
    error: myError,
    mode: 'cors',
    spinner: mySpinner
  });
  console.log(data);
})();

fetch2('//dawa.aws.dk/adresser/autocomplete?side=1&per_side=10&q=marievej', {
  error: myError,
  mode: 'cors',
  timeout: 3000
}).then(data => {
  console.log(data);
});

fetch2('//httpstat.us/500', {
  error: myError,
  mode: 'cors'
}).then(data => {
  console.log(data);
});

fetch2('logifront.svg', {
  parser: myParser
}).then(data => {
  console.log(data);
});
```