// MicroModal.js v0.8.4
const MicroModal = (() => {
  'use strict'

  const FOCUSABLE_ELEMENTS = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    'select:not([disabled]):not([aria-hidden])',
    'textarea:not([disabled]):not([aria-hidden])',
    'button:not([disabled]):not([aria-hidden])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])'
  ]

  // Keep references to the options, modals, and what are opened
  const options = { openTrigger: 'data-micromodal-trigger', identifier: 'data-micromodal-id' }

  class Modal {
    constructor ({
      targetModal,
      triggers = [],
      onShow = () => {},
      onClose = () => {},
      openTrigger = 'data-micromodal-trigger',
      closeTrigger = 'data-micromodal-close',
      openClass = 'is-open',
      disableScroll = false,
      disableFocus = false,
      awaitCloseAnimation = false,
      awaitOpenAnimation = false
    }) {
      // Save a reference of the modal
      this.modal = typeof targetModal === 'string' ? document.getElementById(targetModal) : targetModal

      if (this.modal === null) {
        console.warn(`MicroModal: ID '${targetModal}' not found.`)
        return
      }

      // Save a reference to the passed config
      this.config = { disableScroll, openTrigger, closeTrigger, openClass, onShow, onClose, awaitCloseAnimation, awaitOpenAnimation, disableFocus }

      // pre bind functions for event listeners
      this.showModal = this.showModal.bind(this)
      this.onClick = this.onClick.bind(this)
      this.onKeydown = this.onKeydown.bind(this)

      // Register click events only if pre binding eventListeners
      this.triggers = triggers
      this.registerTriggers()
    }

    /**
     * Loops through all openTriggers and binds click event
     */
    registerTriggers () {
      this.triggers.filter(Boolean).forEach(trigger => {
        trigger.addEventListener('click', this.showModal)
      })
    }

    unregisterTriggers () {
      this.triggers.filter(Boolean).forEach(trigger => {
        trigger.removeEventListener('click', this.showModal)
      })
    }

    /**
     * Hide modal and remove event listeners and triggers
     */
    destroy () {
      this.closeModal()
      this.unregisterTriggers()
    }

    showModal (event = null) {
      if (this.modal.classList.contains(this.config.openClass)) return // guard against multiple calls

      this.removeEventListeners() // clear events in case previous modal wasn't closed

      this.activeElement = document.activeElement
      this.modal.setAttribute('aria-hidden', 'false')
      this.modal.classList.add(this.config.openClass)
      this.toggleScrolling(false) // disable scrolling
      this.addEventListeners()

      if (this.config.awaitOpenAnimation) {
        this.modal.addEventListener('animationend', this.setFocusToFirstNode, { once: true })
      } else {
        this.setFocusToFirstNode()
      }

      this.config.onShow(this.modal, this.activeElement, event)
    }

    closeModal (event = null) {
      const modal = this.modal
      const openClass = this.config.openClass // <- old school ftw
      if (!modal.classList.contains(openClass)) return // guard for animationend being called twice

      this.modal.setAttribute('aria-hidden', 'true')
      this.removeEventListeners()
      this.toggleScrolling(true) // enable scrolling

      if (this.activeElement && this.activeElement.focus) {
        this.activeElement.focus()
      }
      this.config.onClose(this.modal, this.activeElement, event)

      if (this.config.awaitCloseAnimation) {
        this.modal.addEventListener('animationend', function () {
          modal.classList.remove(openClass)
        }, { once: true })
      } else {
        modal.classList.remove(openClass)
      }
    }

    toggleScrolling (value) {
      if (!this.config.disableScroll) return
      // const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = (!value) ? 'hidden' : ''
      document.body.style.touchAction = (!value) ? 'none' : '' // for mobile scrolling

      // Compensate layout shifts for missing scrollbars
      // document.body.style.paddingRight = (!value) ? `${scrollbarWidth}px` : ''
    }

    addEventListeners () {
      this.modal.addEventListener('click', this.onClick)
      this.modal.addEventListener('keydown', this.onKeydown)
    }

    removeEventListeners () {
      this.modal.removeEventListener('click', this.onClick)
      this.modal.removeEventListener('keydown', this.onKeydown)
    }

    /**
     * Handles all click events from the modal.
     * Closes modal if a target matches the closeTrigger attribute.
     * @param {*} event Click Event
     */
    onClick (event) {
      const overlayClicked = isOverlay(event.target, this.modal)
      const closestElement = event.target.closest(`[${ this.config.closeTrigger }]`) // eslint-disable-line template-curly-spacing
      if (
        (event.target.hasAttribute(this.config.closeTrigger) && overlayClicked) || // clicked on modal overlay
        (closestElement !== null && !isOverlay(closestElement, this.modal) && !overlayClicked) // clicked on a close trigger inside modal
      ) {
        event.preventDefault()
        event.stopPropagation()
        this.closeModal(event)
      }
    }

    onKeydown (event) {
      // close modal on esc key press unless the modal is an alertdialog
      if ((event.key === 'Escape' || event.keyCode === 27) && this.modal.hasAttribute('disable-esc')) this.closeModal(event)

      // ...and trap focus on tab key press
      if (event.key === 'Tab' || event.keyCode === 9) this.retainFocus(event)
    }

    getFocusableNodes () {
      const nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS)
      return [...nodes]
    }

    /**
     * Tries to set focus on a node which is not a close trigger
     * if no other nodes exist then focuses on first close trigger
     */
    setFocusToFirstNode () {
      if (this.config.disableFocus) return

      const focusableNodes = this.getFocusableNodes()

      // no focusable nodes
      if (focusableNodes.length === 0) return

      // remove nodes on whose click, the modal closes
      // could not think of a better name :(
      const nodesWhichAreNotCloseTargets = focusableNodes.filter(node => {
        return !node.hasAttribute(this.config.closeTrigger)
      })

      if (nodesWhichAreNotCloseTargets.length > 0) nodesWhichAreNotCloseTargets[0].focus()
      if (nodesWhichAreNotCloseTargets.length === 0) focusableNodes[0].focus()
    }

    retainFocus (event) {
      let focusableNodes = this.getFocusableNodes()

      // no focusable nodes
      if (focusableNodes.length === 0) return

      /**
       * Filters nodes which are hidden to prevent
       * focus leak outside modal
       */
      focusableNodes = focusableNodes.filter(node => {
        return (node.offsetParent !== null)
      })

      // prevents the focus inside the modal from going out
      const focusedItemIndex = focusableNodes.indexOf(document.activeElement)

      // Shift + Tab on first focusable node
      if (event.shiftKey && focusedItemIndex === 0) {
        focusableNodes[focusableNodes.length - 1].focus()
        event.preventDefault()
      }

      // Tab on last focusable node
      if (!event.shiftKey && focusableNodes.length > 0 && focusedItemIndex === focusableNodes.length - 1) {
        focusableNodes[0].focus()
        event.preventDefault()
      }
    }
  }

  /**
   * Modal prototype ends.
   * Here on code is responsible for detecting and
   * auto binding event handlers on modal triggers
   */

  const isOverlay = (element, modal) => {
    return element === modal || element.parentNode === modal
  }

  // Public APIs
  const exported = Modal
  Object.assign(exported, { options })

  return exported
})()

export default MicroModal

if (typeof window !== 'undefined') {
  window.MicroModal = MicroModal
}
