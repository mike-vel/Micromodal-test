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
  const allModals = {}
  const activeModals = []

  class Modal {
    constructor ({
      targetModal,
      triggers = [],
      onShow = () => { },
      onClose = () => { },
      openTrigger = 'data-micromodal-trigger',
      closeTrigger = 'data-micromodal-close',
      openClass = 'is-open',
      disableScroll = false,
      disableFocus = false,
      awaitCloseAnimation = false,
      awaitOpenAnimation = false,
      debugMode = false
    }) {
      // Save a reference of the modal
      this.modal = typeof targetModal === 'string' ? document.getElementById(targetModal) : targetModal
      this.modalId = null

      // Save a reference to the passed config
      this.config = { debugMode, disableScroll, openTrigger, closeTrigger, openClass, onShow, onClose, awaitCloseAnimation, awaitOpenAnimation, disableFocus }

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
     * @param  {array} triggers [Array of node elements]
     * @return {void}
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

    showModal (event = null) {
      this.activeElement = document.activeElement
      this.modal.setAttribute('aria-hidden', 'false')
      this.modal.classList.add(this.config.openClass)
      this.scrollBehaviour('disable')
      this.addEventListeners()

      // stores reference to active modal
      if (activeModals.indexOf(this.modalId) === -1) activeModals.push(this.modalId)

      if (this.config.awaitOpenAnimation) {
        const handler = () => {
          this.modal.removeEventListener('animationend', handler, false)
          this.setFocusToFirstNode()
        }
        this.modal.addEventListener('animationend', handler, false)
      } else {
        this.setFocusToFirstNode()
      }

      this.config.onShow(this.modal, this.activeElement, event)
    }

    closeModal (event = null) {
      const modal = this.modal
      this.modal.setAttribute('aria-hidden', 'true')
      this.removeEventListeners()
      this.scrollBehaviour('enable')

      // remove from activeModals if present
      const idx = activeModals.indexOf(this.modalId)
      if (idx > -1) activeModals.splice(idx, 1)

      if (this.activeElement && this.activeElement.focus) {
        this.activeElement.focus()
      }
      this.config.onClose(this.modal, this.activeElement, event)

      if (this.config.awaitCloseAnimation) {
        const openClass = this.config.openClass // <- old school ftw
        this.modal.addEventListener('animationend', function handler () {
          modal.classList.remove(openClass)
          modal.removeEventListener('animationend', handler, false)
        }, false)
      } else {
        modal.classList.remove(this.config.openClass)
      }
    }

    scrollBehaviour (toggle) {
      if (!this.config.disableScroll) return
      const body = document.querySelector('body')
      switch (toggle) {
        case 'enable':
          Object.assign(body.style, { overflow: '' })
          break
        case 'disable':
          Object.assign(body.style, { overflow: 'hidden' })
          break
        default:
      }
    }

    addEventListeners () {
      this.modal.addEventListener('touchstart', this.onClick)
      this.modal.addEventListener('click', this.onClick)
      document.addEventListener('keydown', this.onKeydown)
    }

    removeEventListeners () {
      this.modal.removeEventListener('touchstart', this.onClick)
      this.modal.removeEventListener('click', this.onClick)
      document.removeEventListener('keydown', this.onKeydown)
    }

    /**
     * Handles all click events from the modal.
     * Closes modal if a target matches the closeTrigger attribute.
     * @param {*} event Click Event
     */
    onClick (event) {
      if (
        event.target.hasAttribute(this.config.closeTrigger) ||
        event.target.parentNode.hasAttribute(this.config.closeTrigger)
      ) {
        event.preventDefault()
        event.stopPropagation()
        this.closeModal(event)
      }
    }

    onKeydown (event) {
      if (event.keyCode === 27) this.closeModal(event) // esc
      if (event.keyCode === 9) this.retainFocus(event) // tab
    }

    getFocusableNodes () {
      const nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS)
      return Array(...nodes)
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

      // if disableFocus is true
      if (!this.modal.contains(document.activeElement)) {
        focusableNodes[0].focus()
      } else {
        const focusedItemIndex = focusableNodes.indexOf(document.activeElement)

        if (event.shiftKey && focusedItemIndex === 0) {
          focusableNodes[focusableNodes.length - 1].focus()
          event.preventDefault()
        }

        if (!event.shiftKey && focusableNodes.length > 0 && focusedItemIndex === focusableNodes.length - 1) {
          focusableNodes[0].focus()
          event.preventDefault()
        }
      }
    }
  }

  /**
   * Modal prototype ends.
   * Here on code is responsible for detecting and
   * auto binding event handlers on modal triggers
   */

  /**
   * Generates an associative array of modals and it's
   * respective triggers
   * @param  {array} triggers     An array of all triggers
   * @param  {string} triggerAttr The data-attribute which triggers the module
   * @return {array}
   */
  const generateTriggerMap = (triggers, triggerAttr) => {
    const triggerMap = []

    triggers.forEach(trigger => {
      const targetModal = trigger.attributes[triggerAttr].value
      if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = []
      triggerMap[targetModal].push(trigger)
    })

    return triggerMap
  }

  /**
   * Validates whether a modal of the given id exists
   * in the DOM
   * @param  {string|object} modal the html ID of the modal, or the modal element itself
   * @return {boolean}
   */
  const validateModalPresence = modal => {
    if (typeof id === 'string' ? !document.getElementById(modal) : !modal) {
      console.warn(`MicroModal: \u2757Seems like you have missed %c'${ modal }'`, 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'ID somewhere in your code. Refer example below to resolve it.')
      console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', `<div class="modal" id="${ modal }"></div>`)
      return false
    }
  }

  /**
   * Validates if there are modal triggers present
   * in the DOM
   * @param  {array} triggers An array of data-triggers
   * @return {boolean}
   */
  const validateTriggerPresence = triggers => {
    if (triggers.length <= 0) {
      console.warn('MicroModal: \u2757Please specify at least one %c\'micromodal-trigger\'', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'data attribute.')
      console.warn('%cExample:', 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', '<a href="#" data-micromodal-trigger="my-modal"></a>')
      return false
    }
  }

  /**
   * Checks if triggers and their corresponding modals
   * are present in the DOM
   * @param  {array} triggers   Array of DOM nodes which have data-triggers
   * @param  {array} triggerMap Associative array of modals and their triggers
   * @return {boolean}
   */
  const validateArgs = (triggers, triggerMap) => {
    validateTriggerPresence(triggers)
    if (!triggerMap) return true
    for (const id in triggerMap) validateModalPresence(id)
    return true
  }

  /**
   * Binds click handlers to all modal triggers
   * @param  {object} config [description]
   * @return void
   */
  const init = config => {
    // Create an config object with default openTrigger
    Object.assign(options, config)

    // Collects all the nodes with the trigger
    const triggers = [...document.querySelectorAll(`[${ options.openTrigger }]`)]

    // Makes a mappings of modals with their trigger nodes
    const triggerMap = generateTriggerMap(triggers, options.openTrigger)

    // Checks if modals and triggers exist in dom
    if (options.debugMode === true && validateArgs(triggers, triggerMap) === false) return

    // For every target modal creates a new instance
    for (const key in triggerMap) {
      const value = triggerMap[key]
      options.targetModal = key
      options.triggers = [...value]
      initModal(key, options)
    }
  }

  /**
   * Binds click handlers in a new modal
   * @param  {string|object} targetModal [The id of the modal to initialize]
   * @param  {object} config [description]
   * @return {void}
   */
  const initModal = (targetId, config) => {
    allModals[targetId] = new Modal(config) // eslint-disable-line no-new
    allModals[targetId].modal.setAttribute(options.identifier, targetId)
    allModals[targetId].modalId = targetId
  }

  const getTargetId = (modal) => {
    return typeof modal === 'string' ? modal : modal.attributes[options.identifier].value
  }

  /**
   * Modifies the modal properties including the show and hide listeners.
   * Does not change trigger elements
   * @param  {string|object} targetModal [The id of the modal to configure]
   * @param  {object} config [The configuration object to pass]
   * @return {void}
   */
  const configModal = (targetModal, config) => {
    const targetId = getTargetId(targetModal)
    Object.assign(allModals[targetId].config, config)
  }

  /**
   * Shows a particular modal
   * @param  {string|object} targetModal [The id of the modal to display]
   * @param  {object} config [The configuration object to pass]
   * @return {void}
   */
  const show = (targetModal, config) => {
    const targetId = getTargetId(targetModal)
    if (config) configModal(targetModal, config)

    // Checks if modals and triggers exist in dom
    if (allModals[targetId].debugMode === true && validateModalPresence(targetId) === false) return

    // clear events in case previous modal wasn't closed
    if (allModals[targetId]) allModals[targetId].removeEventListeners()

    allModals[targetId].showModal()
  }

  /**
   * Closes the active modal
   * @param  {string|object} targetModal The id of the modal to close, or the modal element itself
   * @return {void}
   */
  const close = targetModal => {
    if (activeModals.length === 0) return

    if (targetModal) {
      // Closes the modal that matches the id
      const targetId = getTargetId(targetModal)

      if (activeModals.indexOf(targetId) > -1) allModals[targetId].closeModal()
    } else {
      // Closes the most recent one
      allModals[activeModals[activeModals.length - 1]].closeModal()
    }
  }

  /**
   * Closes all active modals
   */
  const closeAll = () => {
    for (let i = activeModals.length - 1; i >= 0; i--) allModals[activeModals[i]].closeModal()
  }

  /**
   * Removes a modal from the allModals list.
   * Hides the modal and removes all event listeners and triggers before removing.
   * @param {string|object} targetModal The id of the modal to remove, or the modal element itself
   * @return {void}
   */
  const removeModal = (targetModal) => {
    const targetId = getTargetId(targetModal)
    const modalInstance = allModals[targetId]
    if (!modalInstance) return

    // Hide modal and remove event listeners and triggers
    modalInstance.closeModal()
    modalInstance.removeEventListeners()
    modalInstance.unregisterTriggers()

    // Remove from allModals
    delete allModals[targetId]
  }

  return { init, initModal, config: configModal, show, close, closeAll, removeModal }
})()

export default MicroModal

if (typeof window !== 'undefined') {
  window.MicroModal = MicroModal
}
