# Dialog component

## How to use
```js
import Dialog from './dialog.mjs';
const dialog = new Dialog(settings);
dialog.show()
```

## Settings object
| Setting          | Description                             |
| :--------------- | :-------------------------------------- |
| accept           | Text on accept-button                   |
| cancel           | Text on cancel-button                   |
| header           | Header-text                             |
| hideCancel       | Hides cancel-button (false)             |
| message          | Message-text                            |
| modifier         | Extra class to add to main dialog       |
| template         | Extra markup or logic to add to message |
| value            | Default value of value-field            |
| clsAccept        | Class for Accept-button                 |
| clsCancel        | Class for Cancel-button                 |
| clsDialog        | Class for main `<dialog>`               |
| clsHeader        | Class for Header                        |
| clsInput         | Class for Input                         |
| clsMessage       | Class for Message                       |
| clsNav           | Class for wrapper around buttons        |
| clsNoSupport     | Class added if  no `<dialog>` support   |

## `show()`-method
The `show()`-method shows the dialog and creates a `Promise`, that will `resolve()` if the user clicks the _accept_-button and `reject()` if the user clicks the _cancel_-button. The dialog can also be closed by pressing `Escape`. The `show()`-method also accepts a `settings`-object similar to the main `settings`-object.  
This object will be merged with the default `settings`-object.

## Simple example: error dialog
```js
const errorDialog = new Dialog({
  accept: 'OK',
  cancel: 'Cancel',
  header: 'An error occured',
  message: 'Please refresh your browser'
});
errorDialog.show();
```

## Example, chaining multiple dialogs
```js
const dialog = new Dialog({});
dialog.show({
  accept: 'Delete',
  header: 'Confirm delete',
  message:'Really delete this row?',
  modifier: 'c-dialog--delete'
}).then(result => {
  if (result) {
    dialog.show({
      header:'Your age',
      message: 'Enter your age',
      modifier: 'c-dialog--confirm',
      value: 10
    }).then(age => {
      if (age) {
        dialog.show({
          hideCancel: true,
          header:`Your age is ${age}`,
          message:`You don't look a day over ${age - 5}`
        });
      };
    })
  };
});
```