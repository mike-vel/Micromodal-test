## Release History
* **0.8.5**
    * 🌀 `ENHANCEMENT` Changed the way to disable escape keys
    * 🌀 `ENHANCEMENT` Made nanomodal.js even smaller
* **0.8.4**
    * 🌀 `ENHANCEMENT` Removed some of the unnecessary code to reduce size
* **0.8.3**
    * 🌀 `ENHANCEMENT` Added some safeguards to prevent issues or errors
    * 🌀 `ENHANCEMENT` Added new features in nanomodal.js that have not been added yet
* **0.8.2**
    * 💡 `FEATURE` Added an option to disable the Escape key to close the modal (Fixes #105)
    * 🌀 `ENHANCEMENT` Improved the process of checking whether a user clicked on a close modal button (Fixes #490)
* **0.8.1**
    * 🐞 `BUGFIX` Focus trap works if the focus is outside of the modal
* **0.8.0**
    * 🌀 `ENHANCEMENT` Added nanomodal.js &mdash; a lightweight version of Micromodal! 😊
* **0.7.5**
    * 🌀 `ENHANCEMENT` Made the code easier to read
* **0.7.4**
    * 🐞 `BUGFIX` Added back the ability to pass an element to Micromodal (Fixes breaking change in 0.6.2)
* **0.7.3**
    * 🌀 `ENHANCEMENT` Refactored some of the code and seprated some lines to functions
    * 🌀 `ENHANCEMENT` Improved the disable scroll funciton on mobile
* **0.7.2**
    * 🌀 `ENHANCEMENT` Improved the documentation and added new features to it
    * 🐞 `BUGFIX` The triggerMap iteration is now fixed (#372)
    * 🐞 `BUGFIX` The Escape key closes the topmost one instead of all modals when more than one is open (#421)
    * 🐞 `BUGFIX` Pressing tab works properly when multiple modals are open (#544)
    * 🐞 `BUGFIX` Fixed a bug removing a modal with animation, showing it again causes the modal to disappear after the animation
* **0.7.1**
    * 🌀 `ENHANCEMENT` MicroModal.show now initializes a new modal if the element passed in is unregistered
    * 🌀 `ENHANCEMENT` Improved the description in debug mode
    * 🐞 `BUGFIX` Debug mode is fixed
* **0.7.0**
    * 💡 `FEATURE` Added api to initialize and remove modals
    * 💡 `FEATURE` Added a way to configure the properties of existing modals
    * 🌀 `ENHANCEMENT` Initial options are stored globally
    * 🐞 `BUGFIX` The config option now applies in MicroModal.show()
* **0.6.2**
    * 🐞 `BUGFIX` Fixed a bug where MicroModal.close() causes issues when multiple modals are present (#338)
    * ⚠️ `BREAKING CHANGE` Modals now must have ids to function properly<br>
    `MIGRATION` Add id attributes to modal elements; example: &lt;div id="modal-1" ...&gt;.
* **0.6.1**
    * 🐞 `BUGFIX` Add ability to pass an element to MicroModal.close()
    * 🌀 `ENHANCEMENT` Updated documentation for show and close methods
* **0.6.0**
    * 💡 `FEATURE` Added ability to pass an element to Micromodal
* **0.5.2**
    * 🐞 `BUGFIX` Updated dependencies
* **0.4.10**
    * 🐞 `BUGFIX` Reverted passive listener to enable event methods
* **0.4.9**
    * 🐞 `BUGFIX` Correctly closes modal when clicking on nested close elements
* **0.4.8**
    * 🐞 `BUGFIX` Fixed issue where clicking on a input field would close the modal
* **0.4.7**
    * 🐞 `BUGFIX` Correctly disable scroll on iOS devices
    * 🐞 `BUGFIX` Fixed issue where 'window' would be undefined
    * 🐞 `BUGFIX` Close button works even if there are nested elements within
    * 🐞 `BUGFIX` Marks event handler as 'passive' to make the page more responsive
    * 🐞 `BUGFIX` Prevents click handlers from triggering underlying elements
* **0.4.6**
    * 🐞 `BUGFIX` Removed focus error when no focusable element exists in the modal
* **0.4.5**
    * 🐞 `BUGFIX` On open, correctly focuses on non close triggers when possible
    * 🐞 `BUGFIX` Custom open class is now properly removed on modal close
* **0.4.4**
    * 💡 `FEATURE` Added ability to customize open class name
* **0.4.3**
    * 🌀 `ENHANCEMENT` Finds a focusable element which is not the close button on modal open
    * 🌀 `ENHANCEMENT` Handle events cleanup if modals are not closed properly
    * 🌀 `ENHANCEMENT` The original trigger event is now passed to the onShow and onClose methods
    * 🌀 `ENHANCEMENT` Added engines property to package.json
    * 🐞 `BUGFIX` Fixed callbacks for programmatically toggling modal
    * 🐞 `BUGFIX` No longer intercept click events on open and close to prevent default action
    * 🐞 `BUGFIX` No longer throws error if modal has no focusable elements
    * 🐞 `BUGFIX` Setting `disableScroll` no longger changes the height of the body
    * 🐞 `BUGFIX` Fixed issue where focus trap would leak if a hidden element exists within modal
    * 🐞 `BUGFIX`  Fixed issue where active element was not being passed to the onClose method
* **0.4.2**
    * 🐞 `BUGFIX`  Fixed broken CDN link
* **0.4.1**
    * 💡 `FEATURE`  A flag to `awaitOpenAnimation` before focusing on element in modal
    * 💡 `FEATURE`  Passing actual node as second argument to `onShow`
    * 🐞 `BUGFIX`  Fixed issue where active element was `undefined`
    * 🐞 `BUGFIX`  Fixed issue where an opened modal could not be closed by `id`
* **0.4.0**
    * 💡 `FEATURE` Added abilty to close modals by ID - #113 @roebuk
    * 🐞 `BUGFIX` Fixed bug where micromodal would error on initialization - #106 @stoicsquirrel
    * 🐞 `BUGFIX` Fixed bug where IE crashed due to null reference - #171 @wcarson
    * 🐞 `BUGFIX` Fixed bug which didn't lock modal overlay in IE
* **0.3.2**
    * 🐞 `BUGFIX` Fixed bundling for es and umd builds
* **0.3.1**
    * 💡 `FEATURE` **Breaking** Renamed `hasAnimation` to `awaitCloseAnimation`
    * 🐞 `BUGFIX` Updated correct version of modal in dist
* **0.3.0**
    * 💡 `FEATURE` **Breaking** Added flag to await close animation end before destroying modal
    * 💡 `FEATURE` Added flag to disable focus on first element
    * 💡 `FEATURE` Added ability to pass custom data-attributes for open and close
    * 🐞 `BUGFIX` Fixed modal not working without animations
    * 🐞 `BUGFIX` Not focusing on last element in modal in case of file inputs
* **0.2.0**
    * 💡 `FEATURE` Added api to programmatically close modal
    * 💡 `FEATURE` Added abilty to disable scroll on modal open
    * 💡 `FEATURE` Added hooks for open/close animations
    * 💡 `FEATURE` Added flag for toggling debug logs in console
    * 🌀 `ENHANCEMENT` Added ability to pass config to `show` method
    * 🌀 `ENHANCEMENT` Cleaned up `aria` tags for accessibilty
    * 🌀 `ENHANCEMENT` Added test suite for browser tests
    * 🐞 `BUGFIX` Fixed native form events not firing in modal
    * 🐞 `BUGFIX` Fixed modal blocking custom event listeners
* **0.1.1**
    * 🐞 `BUGFIX` Fixed issue where validation was not firing
* **0.1.0**
    * 🌀 `ENHANCEMENT` Released first minor version 😊
