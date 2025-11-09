import MicroModal from './micromodal.js'

// Initial config for setting up modals
MicroModal.init({
  openTrigger: 'data-custom-open',
  disableScroll: false,
  awaitCloseAnimation: true
})

// Programmatically show modal
document.querySelector('.js-modal-trigger')?.addEventListener('click', function (event) {
  MicroModal.show('modal-2', {
    debugMode: true,
    disableScroll: true,
    onShow: function (modal) { document.querySelector('.js-body').classList.add(modal.id) },
    onClose: function (modal) { document.querySelector('.js-body').classList.remove(modal.id) },
    closeTrigger: 'data-custom-close',
    awaitCloseAnimation: true
  })
})

document.querySelector('.js-modal-close-trigger')?.addEventListener('click', function (event) {
  event.preventDefault()
  MicroModal.close('modal-2')
})
